precision mediump float;

varying float vPosition;

void main() {
    gl_FragColor = vec4(vPosition, vPosition * 0.5, 1.0, 1.0);
}
