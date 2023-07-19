/** Siki raw */
export function raw(config: RawConfig): Raw {
  return { ...config, type: "raw" };
}

/* Type definitions */
interface RawConfig {
  path: string;
  handle: RawHandle;
}

export interface Raw {
  type: "raw";
  path: string;
  handle: RawHandle;
}

interface RawHandle {
  (request: Request): Promise<Response> | Response;
}
