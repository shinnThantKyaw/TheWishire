import type { TemplateConfig } from "@/types/template";
import birthdayClassic from "./birthday/classic.json";

const templateRegistry: Record<string, TemplateConfig> = {};

// Register built-in templates
registerTemplate(birthdayClassic as TemplateConfig);

export function registerTemplate(config: TemplateConfig) {
  templateRegistry[config.id] = config;
}

export function getTemplate(id: string): TemplateConfig | undefined {
  return templateRegistry[id];
}

export function getAllTemplates(): TemplateConfig[] {
  return Object.values(templateRegistry);
}

export function getTemplatesByOccasion(occasion: string): TemplateConfig[] {
  return Object.values(templateRegistry).filter((t) => t.occasion === occasion);
}
