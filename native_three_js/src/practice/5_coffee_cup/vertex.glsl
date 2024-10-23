uniform float uTime;

varying vec2 v_UV;

vec2 rotate2D(vec2 value, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    mat2 m = mat2(c, s, -s, c);
    return m * value;
}

void main() {

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    modelPosition.xz = rotate2D(modelPosition.xz, modelPosition.y);

    modelPosition.z += sin(modelPosition.y * 1.0 - uTime) * modelPosition.y * 0.05;
    modelPosition.z += sin(uTime) * modelPosition.y * 0.05;
    modelPosition.x += sin(uTime) * modelPosition.y * 0.05;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    v_UV = uv;
}
