varying vec2 v_UV;

void main() {
    vec3 color = vec3(v_UV, 1.0);
    gl_FragColor = vec4(color, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
