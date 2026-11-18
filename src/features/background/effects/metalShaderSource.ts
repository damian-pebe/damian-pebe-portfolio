/*! Shader Metal by Jay Sharma / 23rd.dev (MIT).
 * Adapted for local OffscreenCanvas rendering; monochrome output.
 * Source: github.com/radiumcoders/23rd.dev/registry/shader-metal
 * Full license: /third-party-notices.txt
 */
export const vertexShader = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;
export const fragmentShader = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_count;
uniform float u_iridescence;
uniform float u_pull;
uniform float u_dark;
uniform vec2 u_mouse;
uniform vec2 u_light;
uniform vec3 u_f0;

const float TAU = 6.28318530718;
const float TILT = -0.32;

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

// Smooth 1D value noise, for the brushed grain that runs along each ribbon.
float lines(float x, float seed) {
  float i = floor(x);
  float f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(hash(vec2(i, seed)), hash(vec2(i + 1.0, seed)), f);
}

vec2 rotate(vec2 p, float a) {
  float c = cos(a);
  float s = sin(a);
  return vec2(c * p.x - s * p.y, s * p.x + c * p.y);
}

// The spine of ribbon k: three swells at different speeds, so it never
// settles into a loop. Near the pointer it leans toward it.
float spine(float x, float k, float lane, float t, vec2 m) {
  float y = lane;
  y += 0.13 * sin(1.15 * x + 0.55 * t + 2.1 * k);
  y += 0.06 * sin(2.6 * x - 0.8 * t + 1.3 * k + 0.7);
  y += 0.025 * sin(5.3 * x + 1.3 * t + 4.0 * k);
  float near = exp(-(x - m.x) * (x - m.x) * 5.0);
  y += (m.y - y) * 0.22 * u_pull * near;
  return y;
}

// A studio to reflect: sky and floor meet at a crisp horizon, a big
// softbox overhead, two strip lights and the key light. Linear light.
vec3 studio(vec3 r, float t) {
  float a = 0.28 * sin(t * 0.11);
  r.xz = rotate(r.xz, a);
  float y = r.y;

  vec3 top = mix(vec3(0.82, 0.83, 0.86), vec3(0.025, 0.025, 0.028), u_dark);
  vec3 horizon = mix(vec3(1.0), vec3(0.16, 0.16, 0.17), u_dark);
  vec3 ground = mix(vec3(0.05, 0.05, 0.055), vec3(0.004), u_dark);
  vec3 sky = mix(horizon, top, smoothstep(0.0, 0.85, y));
  vec3 floor_ = mix(ground * 2.4, ground, smoothstep(0.0, -0.5, y));
  vec3 c = mix(floor_, sky, smoothstep(-0.025, 0.025, y));

  // Overhead softbox, feathered.
  float box = smoothstep(0.6, 0.45, abs(r.x)) * smoothstep(0.42, 0.55, y) *
              smoothstep(1.0, 0.85, y);
  c += box * mix(1.6, 2.2, u_dark);

  // Tall strip lights left and right: warm and cool, faintly.
  float stripL = smoothstep(0.1, 0.03, abs(r.x + 0.78)) * smoothstep(-0.35, -0.1, y) * smoothstep(0.8, 0.5, y);
  float stripR = smoothstep(0.08, 0.02, abs(r.x - 0.72)) * smoothstep(-0.3, -0.05, y) * smoothstep(0.75, 0.45, y);
  c += stripL * vec3(1.25, 1.1, 0.95) * mix(1.0, 1.5, u_dark);
  c += stripR * vec3(0.9, 1.05, 1.3) * mix(0.8, 1.3, u_dark);

  // A low bounce card, so the undersides aren't dead.
  float card = smoothstep(0.7, 0.2, abs(r.x)) * smoothstep(-0.95, -0.7, y) * smoothstep(-0.4, -0.65, y);
  c += card * mix(0.35, 0.18, u_dark);
  return c;
}

vec3 tonemap(vec3 x) {
  x = max(x, 0.0);
  return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}

vec3 linearToSrgb(vec3 c) {
  c = clamp(c, 0.0, 1.0);
  vec3 lo = c * 12.92;
  vec3 hi = 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055;
  return mix(lo, hi, step(vec3(0.0031308), c));
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  float px = 1.0 / u_resolution.y;
  vec2 p = rotate((frag - 0.5 * u_resolution) * px, TILT);
  vec2 m = rotate((u_mouse - 0.5) * u_resolution * px, TILT);
  float t = u_time;

  vec3 L = normalize(vec3(u_light, 0.85));
  float count = u_count;
  float spread = mix(0.0, 0.3, clamp((count - 1.0) / 4.0, 0.0, 1.0)) + 0.08 * step(1.5, count);
  float baseWidth = mix(0.13, 0.075, clamp((count - 1.0) / 4.0, 0.0, 1.0));

  // Premultiplied, composited back to front.
  vec3 col = vec3(0.0);
  float alpha = 0.0;

  for (int i = 0; i < 5; i++) {
    float k = float(i);
    if (k >= count) break;
    float f = count > 1.0 ? k / (count - 1.0) : 0.5;
    float lane = (f - 0.5) * spread;
    // Farther ribbons drift a touch slower: a hint of depth.
    float tk = t * mix(0.82, 1.0, f);

    float x = p.x;
    float e = 0.004;
    float c = spine(x, k, lane, tk, m);
    float slope = (spine(x + e, k, lane, tk, m) - spine(x - e, k, lane, tk, m)) / (2.0 * e);
    float stretch = inversesqrt(1.0 + slope * slope);
    float d = (p.y - c) * stretch;

    // Twist along the length; width breathes.
    float theta = 1.5 * x + 0.45 * tk + 1.7 * k + 0.55 * sin(0.7 * x - 0.3 * tk + k);
    float ct = cos(theta);
    float st = sin(theta);
    float hw = baseWidth * (0.82 + 0.22 * sin(0.9 * x + 0.35 * tk + 2.3 * k));
    // Seen edge-on a ribbon still has a little thickness.
    float proj = hw * max(abs(ct), 0.035);

    // Soft contact shadow on whatever is behind, before the ribbon lands.
    float sd = d + 0.045;
    float shadowW = proj + 0.05;
    float shadow = (1.0 - smoothstep(0.35, 1.0, abs(sd) / shadowW)) * mix(0.2, 0.32, u_dark);
    col *= 1.0 - shadow;
    alpha = alpha + shadow * (1.0 - alpha);

    float v = d / (ct >= 0.0 ? proj : -proj);
    float aa = 1.2 * px / proj;
    float cover = 1.0 - smoothstep(1.0 - aa, 1.0 + aa, abs(v));
    if (cover <= 0.0) continue;

    // Ribbon frame: T along, N2 across in the screen plane, Z toward us.
    vec3 T = normalize(vec3(1.0, slope, 0.0));
    vec3 N2 = normalize(vec3(-slope, 1.0, 0.0));
    vec3 B = ct * N2 + st * vec3(0.0, 0.0, 1.0);
    vec3 n = -st * N2 + ct * vec3(0.0, 0.0, 1.0);

    // A shallow arc across the width, rolling over at the edges, plus
    // slow ripples running down the length and a brushed grain.
    float roll = v * 0.45 + v * v * v * 0.5;
    float ripple = sin(x * 13.0 - tk * 2.2 + k * 3.1) * 0.06 + sin(x * 31.0 + tk * 1.3 + k) * 0.015;
    float grain = lines(v * 34.0 + k * 17.0, k) - 0.5;
    n = normalize(n + B * (roll + grain * 0.015) + T * ripple);
    // Edge-on, what shows is the strip's polished edge. It faces us, tipped
    // up a little so it catches the sky rather than sitting on the horizon.
    float edge = smoothstep(0.14, 0.03, abs(ct));
    vec3 rim = B * (st >= 0.0 ? 1.0 : -1.0) + vec3(0.0, 0.2, 0.0);
    n = normalize(mix(n, normalize(rim), edge));
    float back = step(n.z, 0.0);
    n *= 1.0 - 2.0 * back;

    vec3 r = reflect(vec3(0.0, 0.0, -1.0), n);
    vec3 env = studio(r, t);

    float facing = clamp(n.z, 0.0, 1.0);
    vec3 F = u_f0 + (1.0 - u_f0) * pow(1.0 - facing, 5.0);

    // Thin film: thickness drifts along the ribbon, and the colour shifts
    // with the viewing angle, strongest on the turns.
    float film = 0.5 + 0.5 * sin(x * 1.6 + v * 0.9 + tk * 0.35 + k * 1.9);
    vec3 rainbow = 0.5 + 0.5 * cos(TAU * (film * 1.6 + facing * 1.1 + vec3(0.0, 0.33, 0.67)));
    // Keep the film's brightness level, so it tints the metal, never dims it.
    rainbow = 0.2 + 0.8 * rainbow;
    rainbow /= max(dot(rainbow, vec3(0.2126, 0.7152, 0.0722)), 0.2);
    float sheen = u_iridescence * (0.45 + 0.55 * (1.0 - facing));
    F *= mix(vec3(1.0), rainbow, sheen);

    float rl = max(dot(r, L), 0.0);
    float spec = pow(rl, 90.0) * 5.0 + pow(rl, 14.0) * 0.55;

    vec3 lit = env * F + spec * F;
    lit *= mix(1.0, 0.72, back) * (0.94 + grain * 0.12);
    lit *= mix(0.86, 1.0, f);
    vec3 rgb = linearToSrgb(tonemap(lit * 1.05));

    col = col * (1.0 - cover) + rgb * cover;
    alpha = alpha * (1.0 - cover) + cover;
  }

  // A hair of dither, so the long gradients never band. Faint shadows
  // need it on alpha too, or they step into contour lines.
  float dither = (hash(frag + fract(t) * 91.0) - 0.5) / 255.0;
  col += dither * alpha;
  alpha = clamp(alpha + dither * step(0.0005, alpha) * 1.5, 0.0, 1.0);
  // A neutral chrome palette for the monochrome portfolio.
  float silver = dot(clamp(col, 0.0, 1.0), vec3(0.2126, 0.7152, 0.0722));
  gl_FragColor = vec4(vec3(silver), alpha);
}
`;
