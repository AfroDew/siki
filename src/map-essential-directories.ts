import { Module } from "./module.ts";

const MODULES_DIR_PATH = Deno.cwd() + "/app/+modules";
const LAYOUTS_DIR_PATH = Deno.cwd() + "/app/+layouts";

export async function loadModules(path: string = MODULES_DIR_PATH) {
  let modules: Module[] = [];

  // Read modules directory content
  for await (const entry of Deno.readDir(path)) {
    // Prevent entries that a not dir and not module files
    if (!entry.isDirectory && !entry.name.startsWith("+")) {
      continue;
    }

    const entryPath = `${path}/${entry.name}`;

    // Get module file. Files that begins with '+'
    if (entry.isDirectory) {
      // Get modules in directory
      modules = modules.concat(
        await loadModules(entryPath),
      );
      continue;
    }

    // Import module
    const module = (await import(entryPath)).default;

    if (typeof module === "object" && !Array.isArray(module)) {
      modules = modules.concat([module]);
      continue;
    }
  }

  return modules;
}
