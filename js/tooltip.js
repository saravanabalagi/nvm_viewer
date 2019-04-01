var mouse = { x: 0, y: 0 };
var currentIntersectedObject;

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
              currentIntersectedObject.children[13].material.color.setHex( currentIntersectedObject.currentHex );

          currentIntersectedObject = intersects[ i ].object.parent;
          currentIntersectedObject.currentHex = currentIntersectedObject.children[13].material.color.getHex();
          currentIntersectedObject.children[13].material.color.setHex( 0x000000 );
          showToolTip(mouse, currentIntersectedObject.data);
          highlightPoints(currentIntersectedObject.data.index);
          break;
        }

      }
    }



  } else {
    if ( currentIntersectedObject )
        currentIntersectedObject.children[13].material.color.setHex( currentIntersectedObject.currentHex );
    currentIntersectedObject = null;
  }

}

function showToolTip(mouse, data) {

  let tooltip = document.getElementsByClassName('info-tooltip')[0];
  let tooltipTable = tooltip.getElementsByClassName('table')[0];

  tooltipTable.innerHTML = '';
  getTableHTML(tooltipTable, data);

  tooltip.style.display = 'block';
}

function hideToolTip() {
  let tooltip = document.getElementsByClassName('info-tooltip')[0];
  tooltip.style.display = 'none';
}

// Fill table recursively parsing data
function getTableHTML(parent, data) {
  Object.keys(data).map(key => {
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

function highlightPoints(index) {
  let selectedPoints = points.filter(point => point.measurements.some(measurement => measurement[0]==index))
  console.log(selectedPoints);
}
