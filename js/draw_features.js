function drawFeatures(points, camera) {

  const image = document.getElementById("camera-image");
  const canvas = document.getElementById("camera-image-canvas");

  canvas.width = image.offsetWidth;
  canvas.height = image.offsetHeight;
  const { width, height } = canvas;

  const ctx = canvas.getContext("2d");
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.9)';

  // let min = {x: 9999, y: 9999};
  // let max = {x: -9999, y: -9999};

  points.map(point => {
    point.measurements.map(measurement => {
      if(measurement[0]!==camera.index) return;
      let x = measurement[2] + 0.5;
      let y = measurement[3] + 0.5;

      ctx.beginPath();
      ctx.arc(x * width, y * height, 1, 0, 2 * Math.PI);
      ctx.stroke();
    });
  });

}
