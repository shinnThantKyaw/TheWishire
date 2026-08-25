export interface OccasionMetadata {
  id: string;
  name: string;
  description: string;
  icon: string;
  available: boolean;
}

export const occasions: OccasionMetadata[] = [
  {
    id: "birthday",
    name: "Birthday",
    description: "Celebrate another year of amazingness",
    icon: "🎂",
    available: true,
  },
  {
    id: "anniversary",
    name: "Anniversary",
    description: "Commemorate your special milestone",
    icon: "💕",
    available: false,
  },
  {
    id: "valentine",
    name: "Valentine's Day",
    description: "Show your love and appreciation",
    icon: "💝",
    available: false,
  },
  {
    id: "wedding",
    name: "Wedding",
    description: "Celebrate the union of two hearts",
    icon: "💒",
    available: false,
  },
  {
    id: "graduation",
    name: "Graduation",
    description: "Honor this incredible achievement",
    icon: "🎓",
    available: false,
  },
  {
    id: "friendship",
    name: "Friendship",
    description: "Celebrate your bond with a friend",
    icon: "🤝",
    available: false,
  },
  {
    id: "thank-you",
    name: "Thank You",
    description: "Express heartfelt gratitude",
    icon: "🙏",
    available: false,
  },
];

export function getAvailableOccasions(): OccasionMetadata[] {
  return occasions.filter((o) => o.available);
}

export function getOccasionById(id: string): OccasionMetadata | undefined {
  return occasions.find((o) => o.id === id);
}
