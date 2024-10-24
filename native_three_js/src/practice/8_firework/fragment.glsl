uniform float uProgress;
uniform sampler2D uParticleTexture;
uniform vec3 uColor;

varying vec2 vUv;

void main() {
    vec3 color = vec3(1.0);

    float textureAlpha = texture2D(uParticleTexture, gl_PointCoord).r;

    gl_FragColor = vec4(uColor, textureAlpha);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
