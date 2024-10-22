uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float uHeight;
uniform float uFrequency;
uniform float uTime;

attribute vec3 position;

varying float vPosition;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    float xAxisZPosition = sin(modelPosition.x * uFrequency - uTime);
    float yAxisZPosition = sin(modelPosition.y * uFrequency);
    float zAxisPositionNormalized = (xAxisZPosition * yAxisZPosition) * 0.5;
    float zAxisPositionScaled = zAxisPositionNormalized * uHeight;
    float zAxisPostionStartZero = zAxisPositionScaled + (0.5 * uHeight);
    modelPosition.z += zAxisPostionStartZero;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    vPosition = modelPosition.z * (1.0 / uHeight);
}
