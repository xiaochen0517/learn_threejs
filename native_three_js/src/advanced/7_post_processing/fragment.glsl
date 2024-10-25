uniform sampler2D tDiffuse;
uniform vec3 uColor;
uniform float uStrength;

varying vec2 vUv;

void main() {
    vec3 color = vec3(1.0);
    vec3 showColor = color;
    if (distance(vUv, vec2(0.5)) < 0.25) {
        float textureRedColor = texture2D(tDiffuse, vUv).r;
        float textureGreenColor = texture2D(tDiffuse, vUv + 0.005).g;
        float textureBlueColor = texture2D(tDiffuse, vUv + 0.02).b;
        showColor = vec3(textureRedColor, textureGreenColor, textureBlueColor);
    } else {
        showColor = texture2D(tDiffuse, vUv).rgb;
    }
    color = mix(uColor, showColor, uStrength);
    gl_FragColor = vec4(color, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
