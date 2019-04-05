var mouse = { x: 0, y: 0 };
var currentIntersectedObject;

var isPinned = false;
var isRightClickAndDragged = false;
function pinObject() {
  isPinned = !isPinned;
  if(isPinned) document.getElementById('pin').classList.remove('unpinned');
  else document.getElementById('pin').classList.add('unpinned');
}
function rightClickAndDragged() { isRightClickAndDragged = true; }

document.addEventListener('mousemove', onDocumentMouseMove, false);
function onDocumentMouseMove(event) {
  // the following line would stop any other event handler from firing
  // (such as the mouse's TrackballControls)
  // event.preventDefault();

  // update the mouse variable
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function update() {

  if(isPinned) return;

  var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
  vector.unproject( camera );

  var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

  // create an array containing all objects in the scene with which the ray intersects
  var intersects = ray.intersectObjects( scene.children, true );
  if ( intersects.length > 0 ) {

    // Keep checking even behind the object in front
    for (var i = 0; i < intersects.length; i++) {
      if ( intersects[ i ].object != currentIntersectedObject ) {

        if(intersects[ i ].object.type == 'Mesh'
            && intersects[ i ].object.parent.name == 'car') {

          // restore previous intersection object (if it exists) to its original color
          if ( currentIntersectedObject )
              resetHighlightedObject(currentIntersectedObject);

          // change color of highlighted object
          currentIntersectedObject = intersects[ i ].object.parent;
          currentIntersectedObject.currentHex = currentIntersectedObject.children[13].material.color.getHex();
          currentIntersectedObject.children[13].material.color.setHex( 0x000000 );

          showToolTip(mouse, currentIntersectedObject.data);
          break;
        }

      }
    }

  } else {
    if ( currentIntersectedObject )
      resetHighlightedObject(currentIntersectedObject);
    currentIntersectedObject = null;
  }

}

function resetHighlightedObject(highlightedObject) {
  highlightedObject.children[13].material.color.setHex( currentIntersectedObject.currentHex );
  removeHighlightPoints();
}

function showToolTip(mouse, data) {

  let tooltip = document.getElementsByClassName('info-tooltip')[0];
  let tooltipTable = tooltip.getElementsByClassName('table')[0];

  tooltipTable.innerHTML = '';
  getTableHTML(tooltipTable, data);

  tooltip.style.display = 'block';

  // highlight pointcloud for current pose
  highlightPoints(data);
}

function hideToolTip() {
  let tooltip = document.getElementsByClassName('info-tooltip')[0];
  tooltip.style.display = 'none';
}

// Fill table recursively parsing data
function getTableHTML(parent, data) {
  Object.keys(data).map(key => {

    // skip if display is none
    if(key === 'display' && data[key] === 'none')
      return;

    let trNode = document.createElement('tr');

    let tdLabelNode = document.createElement('td');
    tdLabelNode.innerHTML = key;
    trNode.appendChild(tdLabelNode);

    let tdValueNode = document.createElement('td');
    if(typeof data[key] === 'object' && data[key] !== null){
      tdValueNode.className += 'subcontent';
      getTableHTML(tdValueNode, data[key]);
    }
    else tdValueNode.innerHTML = data[key];
    trNode.appendChild(tdValueNode);

    parent.appendChild(trNode);
  });
}

function highlightPoints(data) {

  let texture = new THREE.TextureLoader().load( 'js/viridis.png' );
  let dotGeometry = new THREE.Geometry();

  let selectedPoints = points.filter(point => point.measurements.some(measurement => measurement[0]==data.index))
  selectedPoints.map(point =>
    dotGeometry.vertices.push(new THREE.Vector3(
                                  point.displayPosition.x,
                                  point.displayPosition.y,
                                  point.displayPosition.z)));

  // calculate 90th percentile
  let pointsArray = {xPoints: [], yPoints: [], zPoints: []};
  selectedPoints.map(point => {
      pointsArray.xPoints.push(Math.abs(point.displayPosition.x));
      pointsArray.yPoints.push(Math.abs(point.displayPosition.y));
      pointsArray.zPoints.push(Math.abs(point.displayPosition.z));
  });
  let localMax = {
    x: percentile(pointsArray.xPoints, 0.9),
    y: percentile(pointsArray.yPoints, 0.9),
    z: percentile(pointsArray.zPoints, 0.9),
  }

  // let zMax = Math.max(...selectedPoints.map(point => Math.abs(point.displayPosition.z)));
  // console.log({localMax, zMax});

  // // check outlier ratio
  // outliers = selectedPoints.map(point => {
  //   if(Math.abs(point.displayPosition.z / localMax.z) > 1) return point;
  // }).filter(e => e!=null);
  // console.log(outliers.length, selectedPoints.length);

  let dotMaterial = new THREE.ShaderMaterial( {
    uniforms: {
      map: { value: texture },
      width: { value: innerWidth },
      height: { value: innerHeight },
      normX: { value: localMax.x },
      normY: { value: localMax.y },
      normZ: { value: localMax.z },
      currentX: { value: data.displayPosition.x },
      currentY: { value: data.displayPosition.y },
      currentZ: { value: data.displayPosition.z },
    },
    vertexShader: document.getElementById( 'vs' ).textContent,
		fragmentShader: document.getElementById( 'fs' ).textContent,
  } );

  let dot = new THREE.Points( dotGeometry, dotMaterial );
  dot.name = 'highlightedPoints'
  scene.add( dot );

}

function removeHighlightPoints() {

  let highlightedPoints = scene.getObjectByName('highlightedPoints');
  scene.remove(highlightedPoints);

}

function percentile(arr, p) {

    // Dont remove the callback
    // https://stackoverflow.com/q/55523587/3125070
    arr.sort((a,b)=>a-b);

    const pos = (arr.length - 1) * p;
    const base = Math.floor(pos);
    const rest = pos - base;
    if ((arr[base + 1] !== undefined))
        return arr[base] + rest * (arr[base + 1] - arr[base]);
    else return arr[base];
};
