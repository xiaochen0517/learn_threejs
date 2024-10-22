precision mediump float;

#define PI 3.141592653589793238462643383279

uniform float uTime;

varying vec2 vUv;

// 计算一个圆圈的形状
float circle(vec2 st, float radius) {
    // 计算当前点与圆心(0.5, 0.5)的相对位置
    vec2 pos = vec2(0.5) - st;

    // 调整半径大小
    radius *= 0.75;

    // 使用 smoothstep 函数来平滑边缘
    // dot(pos, pos) 计算的是 pos 向量的平方和，即当前点到圆心的距离的平方
    // 乘以 3.14 是为了调整距离的尺度
    // smoothstep 函数用于在边缘处平滑过渡
    return 1.0 - smoothstep(
    radius - (radius * 0.05), // 内边界
    radius + (radius * 0.05), // 外边界
    dot(pos, pos) * 3.14// 当前点到圆心的距离的平方，乘以 3.14 调整尺度
    );
}

float cirque(vec2 st, float radius, float thickness) {
    return circle(st, radius) - circle(st, radius - thickness);
}

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

void main() {
    vec3 color = vec3(38, 70, 83) / 255.0;

    // 旋转 UV 坐标
    vec2 rotatedUv = rotatePoint(vUv, vec2(0.5), PI / 4.0);

    // 网格
    vec2 smallGridUv = fract((rotatedUv + vec2(cos(uTime), sin(uTime)) * 0.05) * 10.0);
    float smallCirqueShape = cirque(smallGridUv, 0.5, 0.45);
    color = mix(color, vec3(231, 111, 81) / 255.0, smallCirqueShape);

    // 网格2
    vec2 bigGridUv = fract((rotatedUv + vec2(cos(-uTime), sin(-uTime)) * 0.1) * 5.0);
    float bigCirqueShape = circle(bigGridUv, 0.75);
    color = mix(color, vec3(42, 157, 143) / 255.0, bigCirqueShape);
    float bigInnerCirqueShape = circle(bigGridUv, 0.25);
    vec3 bigInnerCirqueShapeColor = vec3(244, 162, 97) / 255.0;
    color = mix(color, bigInnerCirqueShapeColor, bigInnerCirqueShape);

    gl_FragColor = vec4(color, 1.0);
}
