// This file will contain the logic for interacting with the Google Drive API.
// It will handle authentication, file creation, and file reading.

const CLIENT_ID = 'YOUR_CLIENT_ID'; // TODO: Replace with your client ID
const API_KEY = 'YOUR_API_KEY'; // TODO: Replace with your API key
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

let tokenClient: google.accounts.oauth2.TokenClient;
let gapiInited = false;
let gisInited = false;

/**
 * Initializes the Google API client.
 * @param callback A function to call after the client is initialized.
 */
export const initClient = (callback: () => void) => {
  gapi.load('client', () => {
    gapi.client
      .init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
      })
      .then(() => {
        gapiInited = true;
        callback();
      });
  });
};

/**
 * Initializes the Google Identity Services client.
 * @param callback A function to call after the client is initialized.
 */
export const initGis = (callback: (token: google.accounts.oauth2.TokenResponse) => void) => {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: callback,
  });
  gisInited = true;
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
 * Creates a file in Google Drive.
 * @param content The content of the file.
 * @param fileName The name of the file.
 */
export const createFile = (content: string, fileName: string) => {
  const fileMetadata = {
    name: fileName,
    mimeType: 'application/json',
  };
  const media = {
    mimeType: 'application/json',
    body: content,
  };
  gapi.client.drive.files
    .create({
      resource: fileMetadata,
      media: media,
      fields: 'id',
    })
    .then((response) => {
      console.log('File ID:', response.result.id);
    });
};

export const openFilePicker = (callback: (doc: any) => void) => {
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
