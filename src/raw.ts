/** Siki raw */
export function raw(config: RawConfig): Raw {
  return { ...config, type: "raw" };
}

/* Type definitions */
interface RawConfig {
  handle: RawHandle;
}

export interface Raw {
  type: "raw";
  handle: RawHandle;
}

interface RawHandle {
  (request: Request): Promise<Response> | Response;
}
