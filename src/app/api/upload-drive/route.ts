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

    // Strict validation of file types
    if (uploadType === 'video' && !file.type.startsWith('video/')) {
      return NextResponse.json({ error: 'Tipe file tidak valid! Kategori video hanya menerima file video.' }, { status: 400 });
    }

    if (uploadType === 'design' && !file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Tipe file tidak valid! Kategori foto/desain hanya menerima file gambar.' }, { status: 400 });
    }

    // Helper functions for authorization
    const getServiceAccountAuth = () => {
      if (CLIENT_EMAIL && PRIVATE_KEY) {
        const formattedKey = PRIVATE_KEY.replace(/^['"]/, '').replace(/['"]$/, '').replace(/\\n/g, '\n');
        return new google.auth.JWT({
          email: CLIENT_EMAIL,
          key: formattedKey,
          scopes: ['https://www.googleapis.com/auth/drive']
        });
      }
      return null;
    };

    const getOAuth2Auth = () => {
      if (CLIENT_ID && CLIENT_SECRET && REFRESH_TOKEN) {
        const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET);
        oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
        return oauth2Client;
      }
      return null;
    };

    let auth = getOAuth2Auth();
    let usingOAuth2 = !!auth;

    if (!auth) {
      auth = getServiceAccountAuth();
      usingOAuth2 = false;
    }

    if (!auth) {
      return NextResponse.json(
        { error: 'Kredensial Google Drive belum dikonfigurasi di file .env.local (Butuh OAuth2 atau Service Account)' },
        { status: 500 }
      );
    }

    let drive = google.drive({ version: 'v3', auth });

    // Convert File object to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Helper to get a fresh readable stream for each upload attempt
    const getFreshStream = () => {
      const s = new Readable();
      s.push(buffer);
      s.push(null);
      return s;
    };

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

    let uploadRes: any;

    // 1. Upload file to Google Drive (with Service Account fallback if OAuth2 fails)
    try {
      uploadRes = await drive.files.create({
        requestBody: fileMetadata,
        media: {
          mimeType: file.type,
          body: getFreshStream(),
        },
        fields: 'id, webViewLink, webContentLink',
      });
    } catch (uploadErr: any) {
      const isAuthErr = uploadErr.message?.includes('invalid_grant') || 
                        uploadErr.code === 400 || 
                        uploadErr.code === 401 ||
                        uploadErr.message?.includes('auth');

      if (usingOAuth2 && isAuthErr) {
        console.warn('OAuth2 failed with auth error, trying Service Account fallback...', uploadErr);
        const serviceAuth = getServiceAccountAuth();
        if (serviceAuth) {
          drive = google.drive({ version: 'v3', auth: serviceAuth });
          uploadRes = await drive.files.create({
            requestBody: fileMetadata,
            media: {
              mimeType: file.type,
              body: getFreshStream(),
            },
            fields: 'id, webViewLink, webContentLink',
          });
        } else {
          throw uploadErr;
        }
      } else {
        throw uploadErr;
      }
    }

    const fileId = uploadRes.data.id;
    if (!fileId) {
      throw new Error('Gagal mendapatkan ID file dari Google Drive');
    }

    // 2. Make the file public (Anyone can view)
    try {
      await drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });
    } catch (permErr) {
      console.warn('Failed to set public permission, continuing anyway...', permErr);
    }

    // 3. Construct a reliable direct public view link
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
