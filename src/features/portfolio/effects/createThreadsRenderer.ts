import { fragmentShader, vertexShader } from "./threadShaders";
import { waitForShader } from "./waitForShader";

/** Clyra's Threads shader, rendered locally without a third-party WebGL runtime. */
export async function createThreadsRenderer(
  canvas: HTMLCanvasElement,
  signal: AbortSignal,
) {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: false,
    powerPreference: "low-power",
  });
  if (!gl) return null;
  const shaders: WebGLShader[] = [];
  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    shaders.push(shader);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
  };
  const vertex = compile(gl.VERTEX_SHADER, vertexShader);
  const fragment = compile(gl.FRAGMENT_SHADER, fragmentShader);
  const program = gl.createProgram();
  const buffer = gl.createBuffer();
  const dispose = () => {
    if (buffer) gl.deleteBuffer(buffer);
    if (program) gl.deleteProgram(program);
    shaders.forEach((shader) => gl.deleteShader(shader));
  };
  if (!vertex || !fragment || !program || !buffer) {
    dispose();
    return null;
  }
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  const completed = await waitForShader(gl, program, signal);
  if (
    !completed ||
    signal.aborted ||
    !gl.getProgramParameter(program, gl.LINK_STATUS)
  ) {
    dispose();
    return null;
  }
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW,
  );
  const position = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const uniforms = Object.fromEntries(
    ["iTime", "iResolution", "uColor", "uAmplitude", "uDistance", "uMouse"].map(
      (name) => [name, gl.getUniformLocation(program, name)],
    ),
  );
  gl.uniform1f(uniforms.uAmplitude, 0.7);
  gl.uniform1f(uniforms.uDistance, 0.3);
  return {
    resize(width: number, height: number) {
      const ratio = Math.min(devicePixelRatio || 1, 1);
      canvas.width = Math.max(1, Math.round(width * ratio));
      canvas.height = Math.max(1, Math.round(height * ratio));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform3f(
        uniforms.iResolution,
        canvas.width,
        canvas.height,
        canvas.width / canvas.height,
      );
    },
    paint(time: number, mouse: [number, number], dark: boolean) {
      const color = dark ? 0.9 : 0.12;
      gl.uniform1f(uniforms.iTime, time);
      gl.uniform2f(uniforms.uMouse, mouse[0], mouse[1]);
      gl.uniform3f(uniforms.uColor, color, color, color);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    dispose,
  };
}
