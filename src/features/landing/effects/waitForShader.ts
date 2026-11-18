/** Poll parallel compilation without forcing the browser to wait on its GPU. */
export function waitForShader(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  signal: AbortSignal,
) {
  const parallel = gl.getExtension("KHR_parallel_shader_compile");
  return new Promise<boolean>((resolve) => {
    let frame = 0;
    const finish = (ready: boolean) => {
      cancelAnimationFrame(frame);
      signal.removeEventListener("abort", abort);
      resolve(ready);
    };
    const abort = () => finish(false);
    const check = () => {
      if (signal.aborted || gl.isContextLost()) {
        finish(false);
      } else if (
        !parallel ||
        gl.getProgramParameter(program, parallel.COMPLETION_STATUS_KHR)
      ) {
        finish(true);
      } else {
        frame = requestAnimationFrame(check);
      }
    };
    signal.addEventListener("abort", abort, { once: true });
    frame = requestAnimationFrame(check);
  });
}
