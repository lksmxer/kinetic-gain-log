// This file will contain the logic for interacting with the Google Drive API.
// It will handle authentication, file creation, and file reading.

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

let tokenClient: google.accounts.oauth2.TokenClient;

/**
 * Initializes the Google API client.
 * @param callback A function to call after the client is initialized.
 */
export const initClient = (callback: () => void) => {
  if (!API_KEY) {
    console.warn("VITE_GOOGLE_API_KEY is not defined");
    return;
  }
  gapi.load('client', () => {
    gapi.client
      .init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
      })
      .then(() => {
        callback();
      }).catch(err => console.error("GAPI ERROR", err));
  });
};

/**
 * Initializes the Google Identity Services client.
 * @param callback A function to call after the client is initialized.
 */
export const initGis = (callback: (token: google.accounts.oauth2.TokenResponse) => void) => {
  if (!CLIENT_ID) {
    console.warn("VITE_GOOGLE_CLIENT_ID is not defined");
    return;
  }
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: callback,
  });
};

/**
 *  Sign in the user upon button click.
 */
export const handleAuthClick = () => {
  if (gapi.client.getToken() === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
    tokenClient.requestAccessToken({ prompt: 'consent' });
  } else {
    // Skip display of account chooser and consent dialog for an existing session.
    tokenClient.requestAccessToken({ prompt: '' });
  }
};

/**
 *  Sign out the user upon button click.
 */
export const handleSignoutClick = () => {
  const token = gapi.client.getToken();
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token, () => {
      gapi.client.setToken('');
    });
  }
};

/**
 * Creates a file in Google Drive, updating it if a file with the same name already exists.
 * @param content The content of the file.
 * @param fileName The name of the file.
 */
export const createFile = async (content: string, fileName: string): Promise<void> => {
  const token = gapi.client.getToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  // 1. Check if file exists
  const listResponse = await gapi.client.drive.files.list({
    q: `name='${fileName}' and trashed=false`,
    spaces: 'drive',
    fields: 'files(id, name)',
  });

  const files = listResponse.result.files;
  const fileId = files && files.length > 0 ? files[0].id : null;

  if (fileId) {
    // 2a. Update existing file
    const response = await fetch(
      `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token.access_token}`,
          'Content-Type': 'application/json',
        },
        body: content,
      }
    );
    if (!response.ok) {
      throw new Error('Failed to update file');
    }
  } else {
    // 2b. Create new file
    const boundary = '-------314159265358979323846';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";

    const metadata = {
      name: fileName,
      mimeType: 'application/json',
    };

    const multipartRequestBody =
      delimiter +
      'Content-Type: application/json\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: application/json\r\n\r\n' +
      content +
      close_delim;

    const response = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.access_token}`,
          'Content-Type': `multipart/related; boundary=${boundary}`,
        },
        body: multipartRequestBody,
      }
    );
    if (!response.ok) {
      throw new Error('Failed to create file');
    }
  }
};

export const openFilePicker = (callback: (doc: google.picker.ResponseObject) => void) => {
  const view = new google.picker.View(google.picker.ViewId.DOCS);
  view.setMimeTypes('application/json');
  const picker = new google.picker.PickerBuilder()
    .enableFeature(google.picker.Feature.NAV_HIDDEN)
    .setAppId(CLIENT_ID)
    .setOAuthToken(gapi.client.getToken().access_token)
    .addView(view)
    .setDeveloperKey(API_KEY)
    .setCallback(callback)
    .build();
  picker.setVisible(true);
};
