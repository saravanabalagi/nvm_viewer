function showImage(data) {
    let camera = cameras.filter(cam => cam.index === data.index)[0];

    let imagePanel = document.getElementsByClassName('image-panel')[0];
    if(imagePanel.classList.contains('no-image')) imagePanel.classList.remove('no-image');

    let domImg = document.getElementById('camera-image');
    domImg.src = '/data/' + filename + '/' + camera.image.value;
}

function hideImage() {
    let imagePanel = document.getElementsByClassName('image-panel')[0];
    if(!imagePanel.classList.contains('no-image')) imagePanel.classList.add('no-image');

    let domImg = document.getElementById('camera-image');
    domImg.src = '';
}