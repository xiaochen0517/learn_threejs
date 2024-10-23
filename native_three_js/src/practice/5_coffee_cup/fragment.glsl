uniform sampler2D uNoiseTexture;
uniform float uTime;

varying vec2 v_UV;

void main() {

    vec2 smokeUV = v_UV;
    smokeUV.x *= 0.5;
    smokeUV.y *= 0.3;
    smokeUV.y -= uTime * 0.1;

    // get the smoke value from the noise texture
    float smoke = texture(uNoiseTexture, smokeUV).r;

    // remap the smoke value to be between 0.4 and 1.0
    smoke = smoothstep(0.4, 1.0, smoke);

    // remap smooth edge
    smoke *= smoothstep(0.0, 0.1, v_UV.x);
    smoke *= smoothstep(1.0, 0.9, v_UV.x);
    smoke *= smoothstep(0.0, 0.1, v_UV.y);
    smoke *= smoothstep(1.0, 0.8, v_UV.y);

    //    smoke = 1.0;
    vec3 color = vec3(smoke);
    gl_FragColor = vec4(color, smoke);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
