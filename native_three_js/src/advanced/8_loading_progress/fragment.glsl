uniform float uAlpha;

varying vec2 vUv;

void main() {
    vec3 color = vec3(0.01);
    gl_FragColor = vec4(color, uAlpha);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
