import { LightningElement, track } from 'lwc';

export default class CreateGoogleDriveFolder extends LightningElement {
@track folderName = '';

handleFolderNameChange(event) {
    this.folderName = event.target.value;
}

handleCreateFolder() {
    let accessToken = 'ya29.a0AfB_byCRoFIvfQIDffiISbt6LY7Gz5-QgsfGtUGcZSilNAIkXPTEuzfRfwsbM5eWbn5yFylZ5PkkpfZkvcFBff1kljLwB71ImlVTESWo4gOK0csweODbV3MCLtp6vj8u-xKsBrW6sICRX8ivyn-L7QIroO6g-5_wJnQaCgYKARQSARASFQHGX2Mit1wHStPviE01kerZSACNxw0170'; 
    let endpoint = 'https://www.googleapis.com/drive/v3/files';


    const folderMetadata = {
        name: this.folderName,
        mimeType: 'application/vnd.google-apps.folder',
    };
    console.log('folderMetadata',folderMetadata);
    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(folderMetadata),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Folder created:', data);
    })
    .catch(error => {
        console.error('Error creating folder:', error);
        console.error('Error creating folder==>>:', error.message);
    });       
}

}