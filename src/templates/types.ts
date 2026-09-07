import type { TemplateConfig } from "@/types/template";

export type { TemplateConfig };

export interface TemplateRegistry {
  [id: string]: TemplateConfig;
}

// i dont' understand it. what is this for. and what is [id:string]:TemplateConfig