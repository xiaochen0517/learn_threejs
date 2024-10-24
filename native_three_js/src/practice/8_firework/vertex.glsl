#include <common>

uniform float uProgress;
uniform float uParticleSize;
uniform float uParticleScale;

attribute float aSize;
attribute float aParticleLifetime;

varying vec2 vUv;

float remap(float value, float originMin, float originMax, float destinationMin, float destinationMax) {
    return clamp(destinationMin + (value - originMin) * (destinationMax - destinationMin) / (originMax - originMin), 0.1, 1.0);
}

void main() {
    float progress = uProgress * aParticleLifetime;
    vec3 newPosition = position;

    float expoldingProgress = remap(progress, 0.0, 0.1, 0.0, 1.0);
    expoldingProgress = 1.0 - pow(1.0 - expoldingProgress, 3.0);
    newPosition *= expoldingProgress;

    float fallingProgress = remap(progress, 0.02, 1.0, 0.0, 1.0);
    newPosition.y -= fallingProgress * 0.4;

    float sizeOpeningProgress = remap(progress, 0.0, 0.125, 0.0, 1.0);
    float sizeClosingProgress = remap(progress, 0.13, 1.0, 1.0, 0.0);
    float sizeProgress = min(sizeOpeningProgress, sizeClosingProgress);

    float blinkingProgress = remap(progress, 0.3, 0.8, 0.0, 1.0);
    sizeProgress *= 1.0 - sin(blinkingProgress * 20.0) * 0.25 + 0.5;

    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 modelNormal = modelMatrix * vec4(normal, 0.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    gl_PointSize += uParticleSize * uParticleScale * aSize * sizeProgress;
    gl_PointSize *= (1.0 / -viewPosition.z);

    if (gl_PointSize < 1.0) {
        gl_Position = vec4(9999.9);
    }

    vUv = uv;
}
