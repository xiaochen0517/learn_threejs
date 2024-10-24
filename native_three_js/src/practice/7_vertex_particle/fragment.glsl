uniform float uTime;

varying vec2 vUv;

void main() {
    vec3 color = vec3(1.0);

    float distanceToCenter = length(gl_PointCoord - vec2(0.5));
    color = vec3(1.0 - step(0.5, distanceToCenter));

    gl_FragColor = vec4(color, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
