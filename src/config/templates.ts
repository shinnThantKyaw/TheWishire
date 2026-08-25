export interface TemplateMetadata {
  id: string;
  name: string;
  description: string;
  occasion: string;
  thumbnail: string;
}

export const birthdayTemplates: TemplateMetadata[] = [
  {
    id: "birthday-classic",
    name: "Classic Birthday",
    description: "Timeless birthday celebration with warm colors and elegant animations",
    occasion: "birthday",
    thumbnail: "/templates/birthday-classic.svg",
  },
  {
    id: "birthday-playful",
    name: "Playful Party",
    description: "Fun, colorful party theme with confetti and bouncing animations",
    occasion: "birthday",
    thumbnail: "/templates/birthday-playful.svg",
  },
  {
    id: "birthday-elegant",
    name: "Elegant Celebration",
    description: "Sophisticated, minimal design with smooth transitions",
    occasion: "birthday",
    thumbnail: "/templates/birthday-elegant.svg",
  },
];

export function getTemplatesByOccasion(occasion: string): TemplateMetadata[] {
  switch (occasion) {
    case "birthday":
      return birthdayTemplates;
    default:
      return [];
  }
}

export function getTemplateById(id: string): TemplateMetadata | undefined {
  return [...birthdayTemplates].find((t) => t.id === id);
}
