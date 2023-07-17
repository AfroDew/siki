const HOOK_DIR = "./app/hooks";

/** Read hooks files */
export async function mapHooks(path: string): Promise<Uint8Array | null> {
  try {
    return await Deno.readFile(path);
  } catch (_error) {
    return null;
  }
}

interface HookMap {
  // layouts: Map<string, >
}
