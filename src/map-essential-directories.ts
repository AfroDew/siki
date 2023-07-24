import { Layout } from "./layout.ts";
import { Module } from "./module.ts";

const MODULES_DIR_PATH = Deno.cwd() + "/+modules";
const LAYOUTS_DIR_PATH = Deno.cwd() + "/+layouts";

export async function loadModules(
  path: string = MODULES_DIR_PATH,
): Promise<Module> {
  let items: Module = {};

  // Read items directory content
  for await (const entry of Deno.readDir(path)) {
    // Prevent entries that a not dir and not module files
    if (!entry.isDirectory && !entry.name.startsWith("+")) {
      continue;
    }

    const entryPath = `${path}/${entry.name}`;

    // Get module file. Files that begins with '+'
    if (entry.isDirectory) {
      // Get items in directory
      items = { ...items, ...(await loadModules(entryPath)) };

      continue;
    }

    // Import module
    const module = (await import(entryPath)).default;

    if (typeof module === "object" && !Array.isArray(module)) {
      items = { ...items, ...module };
      continue;
    }
  }

  return items;
}

export async function loadLayouts(
  path: string = LAYOUTS_DIR_PATH,
): Promise<Record<string, Layout>> {
  let layouts: Record<string, Layout> = {};

  // Read layouts directory content
  for await (const entry of Deno.readDir(path)) {
    // Prevent entries that a not dir and not layout files
    if (!entry.isDirectory && !entry.name.startsWith("+")) {
      continue;
    }

    const entryPath = `${path}/${entry.name}`;

    // Get layout file. Files that begins with '+'
    if (entry.isDirectory) {
      // Get layouts in directory
      layouts = {
        ...layouts,
        ...(await loadLayouts(entryPath)),
      };

      continue;
    }

    // Import layout
    const layout: Layout = (await import(entryPath)).default;

    if (layout && typeof layout === "object" && !Array.isArray(layout)) {
      layouts = { ...layouts, [layout.id]: layout };
      continue;
    }
  }

  return layouts;
}
