const frag = `
varying vec2 vUv;
varying vec3 vPos;

uniform sampler2D uTexGradient;
uniform float u_Time;
uniform vec2 u_Resolution;

uniform sampler2D PermTexture;			// Permutation texture
const float permTexUnit = 1.0/256.0;		// Perm texture texel-size
const float permTexUnitHalf = 0.5/256.0;	// Half perm texture texel-size

float fade(in float t) {
	return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float pnoise1D(in float p)
{
	// Integer part, scaled and offset for texture lookup
	float pi = permTexUnit*floor(p) + permTexUnitHalf;
	// Fractional part for interpolation
	float pf = fract(p);
	//
	float grad00 = texture2D(PermTexture, vec2(pi, 0.0)).r * 4.0 - 1.0;
	float n00 = dot(grad00, pf);
	//
	float grad10 = texture2D(PermTexture, pi + vec2(permTexUnit, 0.0)).r * 4.0 - 1.0;
	float n10 = dot(grad10, pf - 1.0);
	// Blend contributions
	float n = mix(n00, n10, fade(pf));
	
	return n;
}

void main() {
    vec3 pos = vPos;
    vec2 centeredUv = vUv * 2.0 - 1.0;
    float time = u_Time;

    // float pulseMinMax = mix(3.8, 4.0, sin(time * 0.8) * 0.7 );
    float pulseMinMax = mix(3.0, 3.5, sin(time));

    // Multiplication of centeredUv by pulse minmax manipulates pulse amplitude
    // float len = length(centeredUv);
    float len = length(centeredUv * pulseMinMax);

    // Manipulate gradient by multiplying len by different values or by mixing it between different intervals of the gradient
    // vec4 texel = texture(uTexGradient, vec2(0.0, len * 1.0));
    vec4 texel = texture(uTexGradient, vec2(0.0, len * 1.0));
    // vec4 texel = texture(uTexGradient, vec2(0.0, mix(0.0, 0.9, len)));
    // vec4 texel = texture(uTexGradient, vec2(0.0, mix(0.5, 1.0, sin(len * 0.9) * sin(time))));
    // vec4 texel = texture(uTexGradient, vec2(0.0, mix(0.5, 1.0, sin(len * 0.9) * sin(time))));
    // vec4 texel = texture(uTexGradient, vec2(0.0, 1.0 - (mix(0.2, 0.9, sin(len - 0.15) * sin(time)))));
    // vec4 texel = texture(uTexGradient, vec2(0.0, 1.0 - max(mix(0.2, 0.9, sin(len - 0.15) * sin(time)), 0.3)));
    // vec4 texel = texture(uTexGradient, vec2(0.0, mix(0.2, 0.9, (sin(len) * 2.0 - 1.0) * (sin(time * 1.7) * 2.0 - 1.0))));

    // Don't let the gradient be linearly interpolated in the alpha channel all the way to 1, because we lose control of the gradient colors. The closer we are to the center, the higher the alpha, and the aura becomes opaque
    // float gradientAlpha = clamp(1.0 - mix(-2.0, 1.0, len), 0.0, 0.6);
    float gradientAlpha = clamp(1.0 - mix(0.0, 1.3, len), 0.0, 0.2);


    float red = mix(0.0, 1.0, texel.r);
    float green = mix(0.0, 1.0, texel.g);
    float blue = mix(0.0, 1.0, texel.b);
    float alpha = mix(0.0, 1.0, texel.w);
    
    vec4 gradientColor = vec4(red, green, blue, gradientAlpha);

    vec4 canvas = vec4(0.0);
    
    canvas += gradientColor;

    gl_FragColor = canvas;
    // gl_FragColor = vec4(1.0);
}
`

export default frag;