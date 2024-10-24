uniform float uTime;
uniform float uParticleSize;
uniform float uParticleScale;

varying vec2 vUv;

void main() {

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    vec4 modelNormal = modelMatrix * vec4(normal, 0.0);

    float animationSpeed = uTime * 2.0;
    float glitchSize = sin(modelPosition.y * 10.0 + animationSpeed);
    glitchSize += sin(modelPosition.y * 5.0 + animationSpeed);
    glitchSize += sin(modelPosition.y + animationSpeed);
    glitchSize = max(glitchSize, 0.0);
    glitchSize += 0.5;
    glitchSize *= 0.5;
    vec4 expansionSize = glitchSize > 0.5 ? ((glitchSize * modelNormal) * 0.05) : vec4(0.0);

    modelPosition.xz = modelPosition.xz + expansionSize.xz;

    vec4 viewPosition = viewMatrix * modelPosition;

    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    gl_PointSize += uParticleSize * uParticleScale;
    gl_PointSize *= (1.0 / -viewPosition.z);

    vUv = uv;
}
