uniform sampler2D uNoiseTexture;
uniform float uTime;

varying vec3 vPosition;
varying vec3 vNormal;

void main() {
    float stripes = vPosition.y;

    stripes = mod((stripes - uTime * 0.02) * 20.0, 1.0);
    stripes = pow(stripes, 3.0);

    vec3 viewDirection = normalize(vPosition - cameraPosition);
    float fresnel = dot(viewDirection, vNormal) + 1.0;

    vec3 color = vec3(1.0);
    gl_FragColor = vec4(color, fresnel);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
