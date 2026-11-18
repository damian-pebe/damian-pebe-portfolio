import { fragmentShader, vertexShader } from "./metalShaderSource";
import { waitForShader } from "./waitForShader";

/** Shader Metal's studio lighting, rendered without a third-party runtime. */
export async function createWebGLRenderer(
  canvas: HTMLCanvasElement | OffscreenCanvas,
  signal: AbortSignal,
) {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
  }) as WebGLRenderingContext | null;
  if (!gl) return null;
  // Enable parallel compilation before submitting the program.
  gl.getExtension("KHR_parallel_shader_compile");
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
  const position = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const uniforms = Object.fromEntries(
    ["u_time", "u_resolution", "u_dark", "u_pull", "u_mouse", "u_light"].map(
      (name) => [name, gl.getUniformLocation(program, name)],
    ),
  );
  const target = { x: 0.5, y: 0.5, active: 0 };
  const pointer = { x: 0.5, y: 0.5, active: 0 };
  let previousTime = 0;
  return {
    resize(width: number, height: number, pixelRatio: number) {
      const ratio = Math.min(
        pixelRatio,
        2,
        Math.sqrt(2_000_000 / Math.max(1, width * height)),
      );
      canvas.width = Math.max(1, Math.round(width * ratio));
      canvas.height = Math.max(1, Math.round(height * ratio));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uniforms.u_resolution, canvas.width, canvas.height);
    },
    pointer(x: number, y: number, active: boolean) {
      target.x = Math.max(0, Math.min(1, x));
      target.y = Math.max(0, Math.min(1, y));
      target.active = active ? 1 : 0;
    },
    paint(time: number, dark: boolean) {
      const easing =
        1 - Math.exp(-Math.min(0.05, Math.max(0, time - previousTime)) * 5);
      previousTime = time;
      pointer.x += (target.x - pointer.x) * easing;
      pointer.y += (target.y - pointer.y) * easing;
      pointer.active += (target.active - pointer.active) * easing;
      gl.uniform1f(uniforms.u_time, time);
      gl.uniform1f(uniforms.u_dark, dark ? 1 : 0);
      gl.uniform1f(uniforms.u_pull, pointer.active);
      gl.uniform2f(uniforms.u_mouse, pointer.x, pointer.y);
      gl.uniform2f(
        uniforms.u_light,
        -0.45 + (pointer.x - 0.5) * pointer.active,
        0.55 + (pointer.y - 0.5) * pointer.active,
      );
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    dispose,
  };
}
