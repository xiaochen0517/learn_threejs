varying vec2 v_UV;
varying vec3 vColor;

void main() {
    float strength = 0.0;
    float length = distance(gl_PointCoord, vec2(0.5));
    strength = pow(1.0 - length, 5.0) * 5.0;
    vec3 mixedColor = mix(vec3(0.0), vColor, strength);
    gl_FragColor = vec4(mixedColor, 1.0);
}
