let mouse = {x: 0, y: 0};
let currentIntersectedObject;

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

  let vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
  vector.unproject( camera );

  let ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

  // create an array containing all objects in the scene with which the ray intersects
  let intersects = ray.intersectObjects( scene.children, true );
  if ( intersects.length > 0 ) {

    // Keep checking even behind the object in front
    for (let i = 0; i < intersects.length; i++) {
      if ( intersects[ i ].object !== currentIntersectedObject ) {

        if(intersects[ i ].object.type === 'Mesh'
            && intersects[ i ].object.parent.name === 'car') {

          // avoid repainting if it is the same object
          // or different part of the same object
          if(intersects[ i ].object.parent === currentIntersectedObject) break;

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
  tooltip.classList.remove('hide');
  createTable(tooltipTable, data);

  // highlight pointcloud for current pose
  let selectedPoints = highlightPoints(data);
  showImage(currentIntersectedObject.data);
  drawFeatures(selectedPoints, data);

}

function hideToolTip() {
  let tooltip = document.getElementsByClassName('info-tooltip')[0];
  tooltip.classList.add('hide');
}
