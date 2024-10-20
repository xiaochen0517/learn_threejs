uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
// 颜色混合比率
uniform float uColorOffset;
uniform float uColorMultiplier;

varying vec2 v_UV;
varying float v_UV_Height;

void main() {
    vec3 minedColor = mix(uDepthColor, uSurfaceColor, v_UV_Height * uColorMultiplier + uColorOffset);
    gl_FragColor = vec4(minedColor, 1.0);
}
