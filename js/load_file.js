const meshRotationOffset = 45;
const cameraRotationOffset = -45;

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

        let initialPosition = null;

        const cameraIndex = 1 + 1;
        let cameras = dataLines.slice(cameraIndex, cameraIndex + numberOfCameras);
        cameras.map((cameraLine, i) => {

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

          let mesh = car.clone();

          // increase hue as the car moves forward
          let hValue = i/(cameras.length*1.5);
          let coloredMeshMaterial = new THREE.MeshPhongMaterial( { color: new THREE.Color().setHSL(hValue, 0.8, 0.7) } );
          mesh.children.filter(e => e.name=='Body_Plane')[0].material = coloredMeshMaterial;

          if(!initialPosition)
            position = initialPosition;

          mesh.position.x = x - initialPosition.x;
          mesh.position.y = z - initialPosition.z;
          mesh.position.z = y - initialPosition.y;


          // mesh.rotation.x = rotationEuler.x
          // mesh.rotation.z = rotationEuler.z
          mesh.rotation.y = rotationEuler.y + (meshRotationOffset * Math.PI / 180)
          // console.log(rotationEuler);

          mesh.updateMatrix();
          mesh.matrixAutoUpdate = false;

          mesh.data = {focalLength: fl, position, rotationEuler};

          mesh.name = 'car';
          scene.add( mesh );

          // add camera
          camera.position.x = mesh.position.x
          camera.position.y = mesh.position.y
          camera.position.z = mesh.position.z
          camera.rotation.x = mesh.rotation.x
          camera.rotation.z = mesh.rotation.z
          camera.rotation.y = mesh.rotation.y + ( cameraRotationOffset * Math.PI / 180 )

          camera.name = 'carCamera';
          cameraHelper.name = 'carCameraHelper';
          scene.add( camera );
          scene.add( cameraHelper );

        });

        const numberOfPoints = parseInt(dataLines[cameraIndex + numberOfCameras].split(' ')[0]);
        console.log({numberOfPoints});

        let dotGeometry = new THREE.Geometry();
        let dotMaterial = new THREE.PointsMaterial( { size: 1, sizeAttenuation: false } );

        const pointIndex = cameraIndex + numberOfCameras + 1
        let points = dataLines.slice(pointIndex, pointIndex + numberOfPoints);
        points.map(pointLine => {

          let params = pointLine.split(' ');

          // parse xyz
          let x = params[0];
          let y = params[1];
          let z = params[2];

          // parse rgb
          let r = params[3];
          let g = params[4];
          let b = params[5];

          // parse number of measurements
          let numberOfMeasurements = params[6];
          let measurementsList = params.slice(7);

          // parse measurements
          let measurements = [];
          for (let i = 0; i < numberOfMeasurements; i++)
            measurements.push(measurementsList.slice(i*4, i*4 + 4));

          // create dot to display
          dotGeometry.vertices.push(new THREE.Vector3( x - initialPosition.x, z - initialPosition.z, y - initialPosition.y ));

        });

        let dot = new THREE.Points( dotGeometry, dotMaterial );
        scene.add( dot );

    });

}
