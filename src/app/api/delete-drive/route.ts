import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

// Load environment variables
const CLIENT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;

// OAuth2 Credentials
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get('fileId');

    if (!fileId) {
      return NextResponse.json({ error: 'ID File wajib disertakan' }, { status: 400 });
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
        { error: 'Kredensial Google Drive belum dikonfigurasi' },
        { status: 500 }
      );
    }

    let drive = google.drive({ version: 'v3', auth });

    // Delete file from Google Drive (with Service Account fallback if OAuth2 fails)
    try {
      await drive.files.delete({ fileId });
    } catch (deleteErr: any) {
      const isAuthErr = deleteErr.message?.includes('invalid_grant') || 
                        deleteErr.code === 400 || 
                        deleteErr.code === 401 ||
                        deleteErr.message?.includes('auth');

      if (usingOAuth2 && isAuthErr) {
        console.warn('OAuth2 delete failed with auth error, trying Service Account fallback...', deleteErr);
        const serviceAuth = getServiceAccountAuth();
        if (serviceAuth) {
          drive = google.drive({ version: 'v3', auth: serviceAuth });
          await drive.files.delete({ fileId });
        } else {
          throw deleteErr;
        }
      } else {
        throw deleteErr;
      }
    }

    return NextResponse.json({ success: true, message: 'File berhasil dihapus dari Google Drive' });
  } catch (error: any) {
    console.error('Google Drive Delete Error:', error);
    // If file is not found (404), treat it as success since it's already gone
    if (error.code === 404) {
      return NextResponse.json({ success: true, message: 'File sudah tidak ada di Google Drive' });
    }
    return NextResponse.json(
      { error: error.message || 'Gagal menghapus file dari Google Drive' },
      { status: 500 }
    );
  }
}
