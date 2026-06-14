import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { Readable } from 'stream';

// Load environment variables
const CLIENT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;
const DEFAULT_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;
const VIDEO_FOLDER_ID = process.env.GOOGLE_DRIVE_VIDEO_FOLDER_ID;
const DESIGN_FOLDER_ID = process.env.GOOGLE_DRIVE_DESIGN_FOLDER_ID;

// OAuth2 Credentials
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

export async function POST(req: NextRequest) {
  try {
    // Parse form data
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const uploadType = formData.get('type') as string; // 'video' or 'design'

    if (!file) {
      return NextResponse.json({ error: 'File tidak ditemukan dalam request' }, { status: 400 });
    }

    let auth: any;

    // Use OAuth2 if configured (avoids Service Account 0GB quota issue)
    if (CLIENT_ID && CLIENT_SECRET && REFRESH_TOKEN) {
      const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET);
      oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
      auth = oauth2Client;
    } else if (CLIENT_EMAIL && PRIVATE_KEY) {
      // Fallback to JWT Service Account
      const formattedKey = PRIVATE_KEY.replace(/^['"]/, '').replace(/['"]$/, '').replace(/\\n/g, '\n');
      auth = new google.auth.JWT({
        email: CLIENT_EMAIL,
        key: formattedKey,
        scopes: ['https://www.googleapis.com/auth/drive']
      });
    } else {
      return NextResponse.json(
        { error: 'Kredensial Google Drive belum dikonfigurasi di file .env.local (Butuh OAuth2 atau Service Account)' },
        { status: 500 }
      );
    }

    const drive = google.drive({ version: 'v3', auth });

    // Convert File object to buffer then readable stream
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    // Upload config
    const fileMetadata: any = {
      name: `${Math.random().toString(36).substring(2, 15)}_${Date.now()}_${file.name}`,
    };

    // Determine correct folder ID based on upload type
    let targetFolderId = DEFAULT_FOLDER_ID;
    if (uploadType === 'video' && VIDEO_FOLDER_ID) {
      targetFolderId = VIDEO_FOLDER_ID;
    } else if (uploadType === 'design' && DESIGN_FOLDER_ID) {
      targetFolderId = DESIGN_FOLDER_ID;
    }

    // If folder ID is provided, place the file inside it
    if (targetFolderId) {
      fileMetadata.parents = [targetFolderId];
    }

    const media = {
      mimeType: file.type,
      body: stream,
    };

    // 1. Upload file to Google Drive
    const uploadRes = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, webViewLink, webContentLink',
    });

    const fileId = uploadRes.data.id;
    if (!fileId) {
      throw new Error('Gagal mendapatkan ID file dari Google Drive');
    }

    // 2. Make the file public (Anyone can view)
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    // 3. Construct a reliable direct public view link
    // Google Drive direct link format for images/videos:
    const publicUrl = `https://lh3.googleusercontent.com/d/${fileId}`;

    return NextResponse.json({
      success: true,
      fileId,
      publicUrl,
      webViewLink: uploadRes.data.webViewLink,
    });
  } catch (error: any) {
    console.error('Google Drive Upload Error:', error);
    return NextResponse.json(
      { error: error.message || 'Gagal mengunggah ke Google Drive' },
      { status: 500 }
    );
  }
}
