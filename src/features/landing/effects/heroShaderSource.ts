/** Radial ShaderLines from Clyra’s landing page, with a monochrome palette. */
export const vertexShader = `attribute vec2 position; void main() { gl_Position = vec4(position, 0.0, 1.0); }`;
export const fragmentShader = `
      #define TWO_PI 6.2831853072
      #define PI 3.14159265359

      precision highp float;
      uniform vec2 resolution;
      uniform float time;

      float random (in float x) {
          return fract(sin(x)*1e4);
      }
      float random (vec2 st) {
          return fract(sin(dot(st.xy,
                               vec2(12.9898,78.233)))*
              43758.5453123);
      }

      uniform float darkMode;

      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

        vec2 fMosaicScal = vec2(4.0, 2.0);
        vec2 vScreenSize = vec2(256,256);
        uv.x = floor(uv.x * vScreenSize.x / fMosaicScal.x) / (vScreenSize.x / fMosaicScal.x);
        uv.y = floor(uv.y * vScreenSize.y / fMosaicScal.y) / (vScreenSize.y / fMosaicScal.y);

        float t = time*0.06+random(uv.x)*0.4;
        float lineWidth = 0.0008;

        vec3 color = vec3(0.0);
        for(int j = 0; j < 3; j++){
          for(int i=0; i < 5; i++){
            color[j] += lineWidth*float(i*i) / abs(fract(t - 0.01*float(j)+float(i)*0.01)*1.0 - length(uv));
          }
        }

        // Preserve readable negative space around the name throughout the pulse.
        float centerMask = smoothstep(0.40, 0.86, length(uv * vec2(0.72, 1.0)));
        float intensity = clamp(dot(color, vec3(0.333333)), 0.0, 1.0) * centerMask * 0.82;
        float base = mix(0.980392, 0.035294, darkMode);
        float ink = mix(0.55, 1.0, darkMode);
        gl_FragColor = vec4(vec3(mix(base, ink, intensity)), 1.0);
      }
    `;
