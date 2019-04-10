const meshRotationOffsetX = 0;
const meshRotationOffsetY = 180;
const meshRotationOffsetZ = 90;
const cameraRotationOffset = 45;

var points = [];
var cameras = [];
var normXYZ = null;

var initialPosition = null;

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

        const cameraIndex = 1 + 1;
        let camerasInFile = dataLines.slice(cameraIndex, cameraIndex + numberOfCameras);
        camerasInFile.map((cameraLine, i) => {

          let params = cameraLine.split(' ');

          let image = params[0];
          let fl = parseFloat(params[1]);

          let rw = parseFloat(params[2]);
          let rx = parseFloat(params[3]);
          let ry = parseFloat(params[4]);
          let rz = parseFloat(params[5]);
          let rotation = new Quaternion(rw, rx, ry, rz);
          let rotationEuler = rotation.toEuler();

          let x = parseFloat(params[6]);
          let y = parseFloat(params[7]);
          let z = parseFloat(params[8]);
          let position = {x, y, z};

          if(initialPosition === null)
            initialPosition = position;

          // swap y and z for display
          let displayPosition = {
            x: x - initialPosition.x,
            y: z - initialPosition.z,
            z: y - initialPosition.y
          };

          let camera = new THREE.PerspectiveCamera( 10, 1, 10, 20 );
          let cameraHelper = new THREE.CameraHelper( camera );

          let mesh = car.clone();

          // increase hue as the car moves forward
          let hValue = i/(camerasInFile.length*10);
          mesh.children.filter(e => e.name==='Body_Plane')[0].material = new THREE.MeshPhongMaterial({color: new THREE.Color().setHSL(hValue, 0.8, 0.7)});

          if(!initialPosition)
            position = initialPosition;

          mesh.position.x = displayPosition.x;
          mesh.position.y = displayPosition.y;
          mesh.position.z = displayPosition.z;

          mesh.rotation.x = rotationEuler.z + (meshRotationOffsetX * Math.PI / 180);
          mesh.rotation.y = -rotationEuler.y + (meshRotationOffsetY * Math.PI / 180);
          mesh.rotation.z = -rotationEuler.x + (meshRotationOffsetZ * Math.PI / 180);
          // console.log(rotationEuler);

          mesh.updateMatrix();
          mesh.matrixAutoUpdate = false;

          mesh.data = {
            focalLength: fl,
            position,
            displayPosition,
            rotationEuler,
            index: i,
            image: {
              display: 'none',
              value: image
            }
          };

          mesh.name = 'car';
          scene.add( mesh );

          // add camera
          camera.position.x = mesh.position.x;
          camera.position.y = mesh.position.y;
          camera.position.z = mesh.position.z;

          camera.rotation.x = mesh.rotation.x;
          camera.rotation.y = -mesh.rotation.y + ( cameraRotationOffset * Math.PI / 180 );
          camera.rotation.z = mesh.rotation.z;

          camera.name = 'carCamera';
          cameraHelper.name = 'carCameraHelper';
          // scene.add( camera );
          // scene.add( cameraHelper );

          // Add to global cameras
          cameras.push(mesh.data);

        });

        const numberOfPoints = parseInt(dataLines[cameraIndex + numberOfCameras].split(' ')[0]);

        let dotGeometry = new THREE.Geometry();
        let dotMaterial = new THREE.PointsMaterial( { size: 1, sizeAttenuation: false } );

        const pointIndex = cameraIndex + numberOfCameras + 1;
        let pointsInFile = dataLines.slice(pointIndex, pointIndex + numberOfPoints);
        pointsInFile.map((pointLine, i) => {

          let params = pointLine.split(' ');

          // parse xyz
          let x = parseFloat(params[0]);
          let y = parseFloat(params[1]);
          let z = parseFloat(params[2]);
          let position = {x, y, z};

          // Swap z and y for display
          let displayPosition = {
            x: x - initialPosition.x,
            y: z - initialPosition.z,
            z: y - initialPosition.y
          };

          // parse rgb
          let r = parseFloat(params[3]);
          let g = parseFloat(params[4]);
          let b = parseFloat(params[5]);
          let color = {r, g, b};

          // parse number of measurements
          let numberOfMeasurements = params[6];
          let measurementsList = params.slice(7);

          // parse measurements
          let measurements = [];
          for (let i = 0; i < numberOfMeasurements; i++)
            measurements.push(measurementsList.slice(i*4, i*4 + 4).map(m => parseFloat(m)));

          // create dot to display
          dotGeometry.vertices.push(new THREE.Vector3(...Object.values(displayPosition)));

          // Add to global points
          points.push({position, color, measurements, index: i, displayPosition});

        });

        let dot = new THREE.Points( dotGeometry, dotMaterial );
        dot.name = 'pointCloud';
        scene.add( dot );

        const infoPanel = document.getElementById('info-panel-table');
        createTable(infoPanel, {Poses: numberOfCameras, Points: numberOfPoints});

    });

}
