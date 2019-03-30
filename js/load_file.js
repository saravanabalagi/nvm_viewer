function loadFile(fileUrl) {

  console.log('Loading Files in Folder: ', fileUrl);

  fetch(fileUrl)
    .then(response => response.text())
    .then((data) => {

        // Return if empty
        if(data && data.length <= 0) {
          console.log('File is empty');
          return;
        }

        // Read line by line
        let dataLines = data.split('\n');

        // First line should be NVM_V3
        if(dataLines.length < 3 || dataLines[0] !== 'NVM_V3') {
          console.log('Unsupported File');
          return;
        }

        const numberOfCameras = parseInt(dataLines[1].split(' ')[0]);
        console.log({numberOfCameras});

        const cameraIndex = 2
        const pointIndex = cameraIndex + numberOfCameras

        let initialPosition = null;

        let cameras = dataLines.slice(cameraIndex, cameraIndex + numberOfCameras);
        cameras.map(cameraLine => {

          let params = cameraLine.split(' ');

          let image = params[0];
          let fl = params[1];

          let rw = params[2];
          let rx = params[3];
          let ry = params[4];
          let rz = params[5];
          let rotation = new Quaternion(rw, rx, ry, rz);
          let rotationEuler = rotation.toEuler();

          let x = params[6];
          let y = params[7];
          let z = params[8];
          let position = {x, y, z};

          let camera = new THREE.PerspectiveCamera( 10, 1, 10, 20 );
          let cameraHelper = new THREE.CameraHelper( camera );

          if(initialPosition === null)
            initialPosition = position;

          camera.position.x = x - initialPosition.x;
          camera.position.y = z - initialPosition.z;
          camera.position.z = y - initialPosition.y;

          // camera.rotation.x = rotationEuler.x
          // camera.rotation.z = rotationEuler.y
          camera.rotation.y = rotationEuler.y
          console.log(rotationEuler);

          camera.data = {fl, position, rotation};

          scene.add( camera );
          scene.add( cameraHelper );

          if(!initialPosition)
            position = initialPosition;

        });

        const numberOfPoints = parseInt(dataLines[pointIndex].split(' ')[0]);
        console.log({numberOfPoints});

    });

}
