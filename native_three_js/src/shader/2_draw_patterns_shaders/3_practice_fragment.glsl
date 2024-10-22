#define PI 3.141592653589793238462643383279

varying vec2 v_UV;

vec2 rotatePoint(vec2 point, vec2 center, float angle) {
    // Translate point to origin
    float translatedX = point.x - center.x;
    float translatedY = point.y - center.y;

    // Apply rotation
    float rotatedX = translatedX * cos(angle) - translatedY * sin(angle);
    float rotatedY = translatedX * sin(angle) + translatedY * cos(angle);

    // Translate point back
    float finalX = rotatedX + center.x;
    float finalY = rotatedY + center.y;

    return vec2(finalX, finalY);
}

//	Classic Perlin 2D Noise
//	by Stefan Gustavson (https://github.com/stegu/webgl-noise)
//
vec2 fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }
vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }

float cnoise(vec2 P){
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0);// To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0;// 1/41 = 0.024...
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x, gy.x);
    vec2 g10 = vec2(gx.y, gy.y);
    vec2 g01 = vec2(gx.z, gy.z);
    vec2 g11 = vec2(gx.w, gy.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 *
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}

void main() {

    float strength = 0.0;

    // 斑马纹，横向
    //    strength = mod(v_UV.y * 10.0, 1.0);

    // 斑马纹，纵向
    //    strength = mod(v_UV.x * 10.0, 1.0);

    // 黑白条纹，横向
    //    strength = step(0.5, mod(v_UV.y * 10.0, 1.0));
    //    strength = step(0.8, mod(v_UV.y * 10.0, 1.0));

    // 黑白条纹，纵向
    //    strength = step(0.5, mod(v_UV.x * 10.0, 1.0));
    //    strength = step(0.8, mod(v_UV.x * 10.0, 1.0));

    // 网格
    //    float linesX = step(0.8, mod(v_UV.x * 10.0, 1.0));
    //    float linesY = step(0.8, mod(v_UV.y * 10.0, 1.0));
    //    strength = linesX + linesY;

    // 网点
    //    float linesX = step(0.8, mod(v_UV.x * 10.0, 1.0));
    //    float linesY = step(0.8, mod(v_UV.y * 10.0, 1.0));
    //    strength = linesX * linesY;

    // 横线截断
    //    float linesX = step(0.4, 1.0 - mod(v_UV.x * 10.0, 1.0));
    //    float linesY = step(0.8, mod(v_UV.y * 10.0, 1.0));
    //    strength = linesX * linesY;

    // 右上角半框
    //    float linesX = step(0.8, mod(v_UV.x * 10.0, 1.0));
    //    float linesY = step(0.8, mod(v_UV.y * 10.0, 1.0));
    //
    //    float subLinesX = step(0.6, 1.0 - mod(v_UV.x * 10.0, 1.0));
    //    float subLinesY = step(0.6, 1.0 - mod(v_UV.y * 10.0, 1.0));
    //    strength = (linesX + linesY) - (subLinesX + subLinesY);

    // 加号
    //    float linesX = step(0.4, mod(v_UV.x * 10.0, 1.0));
    //    linesX *= step(0.4, 1.0 - mod(v_UV.x * 10.0, 1.0));
    //    linesX -= step(0.8, mod(v_UV.y * 10.0, 1.0));
    //    linesX -= step(0.8, 1.0 - mod(v_UV.y * 10.0, 1.0));
    //
    //    float linesY = step(0.4, mod(v_UV.y * 10.0, 1.0));
    //    linesY *= step(0.4, 1.0 - mod(v_UV.y * 10.0, 1.0));
    //    linesY -= step(0.8, mod(v_UV.x * 10.0, 1.0));
    //    linesY -= step(0.8, 1.0 - mod(v_UV.x * 10.0, 1.0));
    //
    //    strength = linesX + linesY;

    // 横向渐变
    //    strength = abs(v_UV.x - 0.5);

    // 横向渐变加纵向
    //    strength = min(abs(v_UV.x - 0.5), abs(v_UV.y - 0.5));

    // 中心方块
    //    strength = step(0.2, max(abs(v_UV.x - 0.5), abs(v_UV.y - 0.5)));

    // 中心方块 边缘黑色
    //    strength = step(0.2, max(abs(v_UV.x - 0.5), abs(v_UV.y - 0.5)));
    //    strength -= step(0.25, max(abs(v_UV.x - 0.5), abs(v_UV.y - 0.5)));

    // 灰阶
    //    strength = 0.1 * floor(v_UV.x * 10.0);

    // 灰阶 双向
    //    strength = 0.1 * floor(v_UV.x * 10.0);
    //    strength *= 0.1 * floor(v_UV.y * 10.0);

    // 点扩散
    //    strength = length(v_UV);

    // 中心点扩散
    //    strength = distance(v_UV.xy, vec2(0.5));

    // 中心点亮点
    //    strength = 0.01 / distance(v_UV.xy, vec2(0.5));

    // 中心点亮点，横向扩散
    //    strength = 0.015 / distance(vec2(v_UV.x * 0.1 + 0.45, v_UV.y * 0.5 + 0.25), vec2(0.5));

    // 中心点 十字星星
    //    vec2 m_UV = rotatePoint(v_UV.xy, vec2(0.5), PI * 0.25);
    //    strength = 0.015 / distance(vec2(m_UV.x * 0.1 + 0.45, m_UV.y * 0.5 + 0.25), vec2(0.5));
    //    strength *= 0.015 / distance(vec2(m_UV.x * 0.5 + 0.25, m_UV.y * 0.1 + 0.45), vec2(0.5));

    // 中心 圆
    //    strength = step(0.25, distance(v_UV.xy, vec2(0.5)));

    // 中心 圆环 黑色
    //    strength = step(0.01, abs(distance(v_UV.xy, vec2(0.5)) - 0.25));

    // 中心 圆环 白色
    //    strength = 1.0 - step(0.01, abs(distance(v_UV.xy, vec2(0.5)) - 0.25));

    // 中心 圆环 扭曲
    //    strength = 1.0 - step(0.01, abs(distance(vec2(v_UV.x, v_UV.y + sin(v_UV.x * 30.0) * 0.1), vec2(0.5)) - 0.25));

    // 中心 圆环 扭曲 双向
    //    vec2 wavedUV = vec2(
    //        v_UV.x + sin(v_UV.y * 30.0) * 0.1,
    //        v_UV.y + sin(v_UV.x * 30.0) * 0.1
    //    );
    //    strength = 1.0 - step(0.01, abs(distance(wavedUV, vec2(0.5)) - 0.25));

    // tan
    //    float angle = atan(v_UV.x, v_UV.y);
    //    strength = angle;

    // tan 中心点
    //    float angle = atan(v_UV.x - 0.5, v_UV.y - 0.5);
    //    strength = angle;

    // tan 中心点 旋转渐变
    //    float angle = atan(v_UV.x - 0.5, v_UV.y - 0.5);
    //    angle /= PI * 2.0;
    //    angle += 0.5;
    //    strength = angle;

    // tan 中心点 旋转渐变 mod
    //    float angle = atan(v_UV.x - 0.5, v_UV.y - 0.5);
    //    angle /= PI * 2.0;
    //    angle += 0.5;
    //    angle *= 50.0;
    //    angle = mod(angle, 1.0);
    //    strength = angle;

    // tan 中心点 旋转渐变 sin
    //    float angle = atan(v_UV.x - 0.5, v_UV.y - 0.5);
    //    angle /= PI * 2.0;
    //    angle += 0.5;
    //    strength = sin(angle * 200.0);

    // 圆圈与tan sin结合
    //    float angle = atan(v_UV.x - 0.5, v_UV.y - 0.5);
    //    angle /= PI * 2.0;
    //    angle += 0.5;
    //    angle = sin(angle * 100.0);
    //    float radius = angle * 0.01 + 0.25;
    //    strength = 1.0 - step(0.01, abs(distance(v_UV.xy, vec2(0.5)) - radius));

    // 噪波
    //    strength = cnoise(v_UV.xy * 10.0);

    // 噪波 黑白
    //    strength = step(0.1, cnoise(v_UV.xy * 10.0));

    // 噪波 黑白 sin
    strength = sin(cnoise(v_UV.xy * 10.0) * 20.0);

    // 颜色混合
    vec3 blackColor = vec3(0.0);
    vec3 uvColor = vec3(v_UV.xy, 1.0);
    vec3 minedColor = mix(blackColor, uvColor, strength);
    gl_FragColor = vec4(minedColor, 1.0);

    //    gl_FragColor = vec4(strength, strength, strength, 1.0);
}
