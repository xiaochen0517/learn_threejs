uniform float uTime;

varying vec2 v_UV;

void main() {

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

//    modelPosition.z += sin(modelPosition.y * 10.0);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    v_UV = uv;
}
