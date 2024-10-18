uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

attribute vec3 position;

varying float vPosition;

void main() {
    float height = 0.5;
    float frequency = 10.0;

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    float xAxisZPosition = (sin(modelPosition.x * frequency) * height);
    float yAxisZPosition = (sin(modelPosition.y * frequency) * height);
    modelPosition.z = xAxisZPosition * yAxisZPosition + pow(height, 2.0);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    vPosition = modelPosition.z * (1.0 / height);
}
