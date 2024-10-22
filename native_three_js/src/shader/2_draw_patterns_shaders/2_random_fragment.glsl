varying vec2 v_UV;

float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233)))*43758.5453123);
}

void main() {
    float pixelGrayGrade = 10.0;
    float totalResolution = 50.0;

    float randomValue = random(vec2(floor(v_UV.x * totalResolution) / totalResolution, floor(v_UV.y * totalResolution) / totalResolution));
    randomValue = randomValue > 0.85 ? 0.85 : randomValue;
    float pixelGrayColor = (randomValue * pixelGrayGrade) / pixelGrayGrade;
    gl_FragColor = vec4(0.6 * pixelGrayColor, 0.4, 0.6 * (pixelGrayColor - 0.5), 1.0);
}
