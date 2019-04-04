const meshRotationOffset = 45;
const cameraRotationOffset = -45;

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
        console.log({numberOfCameras});

        const cameraIndex = 1 + 1;
        let camerasInFile = dataLines.slice(cameraIndex, cameraIndex + numberOfCameras);
        camerasInFile.map((cameraLine, i) => {

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
          let hValue = i/(camerasInFile.length*1.5);
          let coloredMeshMaterial = new THREE.MeshPhongMaterial( { color: new THREE.Color().setHSL(hValue, 0.8, 0.7) } );
          mesh.children.filter(e => e.name=='Body_Plane')[0].material = coloredMeshMaterial;

          if(!initialPosition)
            position = initialPosition;

          // swap y and z for display
          mesh.position.x = x - initialPosition.x;
          mesh.position.y = z - initialPosition.z;
          mesh.position.z = y - initialPosition.y;

          // mesh.rotation.x = rotationEuler.x
          // mesh.rotation.z = rotationEuler.z
          mesh.rotation.y = rotationEuler.y + (meshRotationOffset * Math.PI / 180)
          // console.log(rotationEuler);

          mesh.updateMatrix();
          mesh.matrixAutoUpdate = false;

          mesh.data = {focalLength: fl, position, rotationEuler, index: i};

          mesh.name = 'car';
          scene.add( mesh );

          // add camera
          camera.position.x = mesh.position.x
          camera.position.y = mesh.position.y
          camera.position.z = mesh.position.z

          camera.rotation.x = mesh.rotation.x
          camera.rotation.y = mesh.rotation.y + ( cameraRotationOffset * Math.PI / 180 )
          camera.rotation.z = mesh.rotation.z

          camera.name = 'carCamera';
          cameraHelper.name = 'carCameraHelper';
          // scene.add( camera );
          // scene.add( cameraHelper );

          // Add to global cameras
          cameras.push({position, rotationEuler, focalLength: fl, index: i});

        });

        const numberOfPoints = parseInt(dataLines[cameraIndex + numberOfCameras].split(' ')[0]);
        console.log({numberOfPoints});

        let dotGeometry = new THREE.Geometry();
        let dotMaterial = new THREE.PointsMaterial( { size: 2, sizeAttenuation: false } );

        const pointIndex = cameraIndex + numberOfCameras + 1
        let pointsInFile = dataLines.slice(pointIndex, pointIndex + numberOfPoints);
        pointsInFile.map((pointLine, i) => {

          let params = pointLine.split(' ');

          // parse xyz
          let x = params[0];
          let y = params[1];
          let z = params[2];
          let position = {x, y, z};

          // Swap z and y for display
          let displayPosition = {
            x: x - initialPosition.x,
            y: z - initialPosition.z,
            z: y - initialPosition.y
          }

          // parse rgb
          let r = params[3];
          let g = params[4];
          let b = params[5];
          let color = {r, g, b};

          // parse number of measurements
          let numberOfMeasurements = params[6];
          let measurementsList = params.slice(7);

          // parse measurements
          let measurements = [];
          for (let i = 0; i < numberOfMeasurements; i++)
            measurements.push(measurementsList.slice(i*4, i*4 + 4));

          // create dot to display
          dotGeometry.vertices.push(new THREE.Vector3(...Object.values(displayPosition)));

          // Add to global points
          points.push({position, color, measurements, index: i, displayPosition});

        });

        // calculate 90th percentile
        pointsArray = {xPoints: [], yPoints: [], zPoints: []};
        points.map(point => {
            pointsArray.xPoints.push(Math.abs(point.displayPosition.x));
            pointsArray.yPoints.push(Math.abs(point.displayPosition.y));
            pointsArray.zPoints.push(Math.abs(point.displayPosition.z));
        });
        normXYZ = {
          x: percentile(pointsArray.xPoints, 0.9999),
          y: percentile(pointsArray.yPoints, 0.9999),
          z: percentile(pointsArray.zPoints, 0.9999),
        }
        console.log({normXYZ});

        let dot = new THREE.Points( dotGeometry, dotMaterial );
        dot.name = 'pointCloud';
        scene.add( dot );

    });

}

const percentile = (arr, q) => {
    const sorted = arr.sort();
    const pos = ((sorted.length) - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if ((sorted[base + 1] !== undefined)) {
        return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    } else {
        return sorted[base];
    }
};
