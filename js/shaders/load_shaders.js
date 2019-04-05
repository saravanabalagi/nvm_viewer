const body = document.getElementsByTagName('body')[0];

async function loadShader(shaderElement, fileUrl) {
  let response = await fetch(fileUrl);
  shaderElement.innerHTML = await response.text();
  body.appendChild(shaderElement);
}

const vertexShader = document.createElement('script');
vertexShader.type = 'x-shader/x-vertex';
vertexShader.id = 'vs';
loadShader(vertexShader, '/js/shaders/vertex_shader.js');

const fragmentShader = document.createElement('script');
fragmentShader.type = 'x-shader/x-fragment';
fragmentShader.id = 'fs';
loadShader(fragmentShader, '/js/shaders/fragment_shader.js');
