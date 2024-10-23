uniform sampler2D uNoiseTexture;
uniform float uTime;
uniform vec3 uColor;

varying vec3 vPosition;
varying vec3 vNormal;

void main() {
    float stripes = vPosition.y;

    stripes = mod((stripes - uTime * 0.02) * 30.0, 1.0);
    stripes = pow(stripes, 3.0);

    vec3 normal = normalize(vNormal);
    if (!gl_FrontFacing) {
        normal = -normal;
    }

    vec3 viewDirection = normalize(vPosition - cameraPosition);
    float fresnel = dot(viewDirection, normal) + 1.0;

    float holographic = stripes * fresnel;
    holographic *= 1.2;

    vec3 color = vec3(1.0);
    gl_FragColor = vec4(uColor, holographic);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
