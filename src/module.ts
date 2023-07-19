import { Page } from "./page.ts";
import { Raw } from "./raw.ts";
import { Block } from "./block.ts";

/** Siki module */
export function module(config: ModuleConfig): Module {
  return Object.entries(config.routes).reduce(
    (acc, [path, item]) => {
      const newPath = path.startsWith("$")
        ? path.replace("$", config.path)
        : config.path === "/" && !path.startsWith("/")
        ? config.path + path
        : config.path.startsWith("/")
        ? `${config.path}/${path}`
        : `/${config.path}/${path}`;

      return { ...acc, [newPath]: item };
    },
    {},
  );
}

interface ModuleConfig {
  path: string;
  // handle?: Handle;
  routes: Module;
}

export type Module = Record<string, ModuleContent>;
export type ModuleMap = Map<string, ModuleContent>;
export type ModuleContent = Page | Raw | Block;
