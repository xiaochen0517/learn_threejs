#include <common>

varying vec2 vUv;

void main() {
//    vec4 modelNormal = modelMatrix * vec4(normal, 0.0);
//    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
//    vec4 viewPosition = viewMatrix * modelPosition;
//    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = vec4(position, 1.0);

    vUv = uv;
}