function loadFile(fileUrl) {

  console.log('Loading Files in Folder: ', fileUrl);

  fetch(fileUrl)
    .then(response => response.text())
    .then((data) => {

        // Return if empty
        if(data.length <= 0) {
          console.log('File is empty');
          return;
        }

        // Read line by line
        dataLines = data.split('\n');

        // First line should be NVM_V3
        if(dataLines.length < 1 || dataLines[0] !== 'NVM_V3') {
          console.log('Unsupported File');
          return;
        }

        console.log(dataLines[0]);

    });

}
