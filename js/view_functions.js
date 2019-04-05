var isPinned = false;
var isRightClickAndDragged = false;

function rightClickAndDragged() { isRightClickAndDragged = true; }

function pinObject() {
  isPinned = !isPinned;
  if(isPinned) document.getElementById('pin').classList.remove('unpinned');
  else document.getElementById('pin').classList.add('unpinned');
}

function toggleAnimate() {
	shouldAnimate=!shouldAnimate;
	if(shouldAnimate) document.getElementById('animate').classList.add('playing');
  else document.getElementById('animate').classList.remove('playing');
}

function resetView() {
	camera.position.set( 60, 50, 60 );
	camera.lookAt( 0, 0, 0 );
}

function reloadLoadViewButton() {
	let loadView = document.getElementById('loadView');
	if(getCookie('position').length > 0 && getCookie('rotation').length > 0)
		loadView.style.display = 'inline-block';
	else { loadView.style.display = 'none'; }
}

function saveView() {
	let {rotation, position} = camera;
	document.cookie = 'rotation=' + JSON.stringify(rotation);
	document.cookie = 'position=' + JSON.stringify(position);
	reloadLoadViewButton();
}

function loadView() {
	let rotation = JSON.parse(getCookie('rotation'));
	let position = JSON.parse(getCookie('position'));
	camera.rotation.set(rotation._x, rotation._y, rotation._z, rotation._order);
	camera.position.set(position.x, position.y, position.z);
	console.log(camera.position, camera.rotation);
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

reloadLoadViewButton();
