import type { TemplateConfig } from "@/types/template";

export type { TemplateConfig };

export interface TemplateRegistry {
  [id: string]: TemplateConfig;
}
