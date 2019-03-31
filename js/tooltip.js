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

      if ( intersects[ 0 ].object != currentIntersectedObject ) {
          // restore previous intersection object (if it exists) to its original color
          if ( currentIntersectedObject ) {
              currentIntersectedObject.children[13].material.color.setHex( currentIntersectedObject.currentHex );
          }

          if(intersects[ 0 ].object.type == 'Mesh'
              && intersects[ 0 ].object.parent.name == 'car') {
            currentIntersectedObject = intersects[ 0 ].object.parent;
            currentIntersectedObject.currentHex = currentIntersectedObject.children[13].material.color.getHex();
            currentIntersectedObject.children[13].material.color.setHex( 0x000000 );
            showToolTip(mouse, currentIntersectedObject.data);
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
  Object.keys(data).map(key => {
    let trNode = document.createElement('tr');

    let tdLabelNode = document.createElement('td');
    tdLabelNode.innerHTML = key;
    trNode.appendChild(tdLabelNode);

    let tdValueNode = document.createElement('td');
    tdValueNode.innerHTML = data[key];
    trNode.appendChild(tdValueNode);

    tooltipTable.appendChild(trNode);
  });

  tooltip.style.display = 'block';
}

function hideToolTip() {
  let tooltip = document.getElementsByClassName('info-tooltip')[0];
  tooltip.style.display = 'none';
}
