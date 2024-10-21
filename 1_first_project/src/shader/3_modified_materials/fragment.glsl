#define PI 3.141592653589793238462643383279

varying vec2 vUv;

void main() {
    vec3 color = vec3(38, 70, 83) / 255.0;

    gl_FragColor = vec4(color, 1.0);
}
