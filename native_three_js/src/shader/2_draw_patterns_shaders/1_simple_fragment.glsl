varying vec2 v_UV;

void main() {
    // 将 uv 的值映射到 -1 到 1 之间
    vec2 uv = v_UV * 2.0 - 1.0;

    if (length(uv) < 0.75) {
        gl_FragColor = vec4(v_UV, 1.0, 1.0);
    } else {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 0.0);
    }
}
