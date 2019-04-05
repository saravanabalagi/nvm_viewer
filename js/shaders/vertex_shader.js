uniform sampler2D map;
uniform float width;
uniform float height;
uniform float normX;
uniform float normY;
uniform float normZ;
uniform float currentX;
uniform float currentY;
uniform float currentZ;

varying vec2 vUv;
void main() {
  vUv = vec2( abs(position.z - currentZ) / normZ, 1.0);
  gl_PointSize = 2.0;
  vec4 pos = vec4(position, 1.0);
  gl_Position = projectionMatrix * modelViewMatrix * pos;
}
