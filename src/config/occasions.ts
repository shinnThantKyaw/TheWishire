export interface OccasionMetadata {
  id: string;
  name: string;
  description: string;
  icon: string;
  available: boolean;
}

/**
 * Occasion registry — main set per Wave 0 decision 0.2 (Myanmar scope):
 * birthday, anniversary, valentine, girlfriend-day, boyfriend-day,
 * thadingyut, thingyan. The rest are parked (`available: false`) for a
 * later backlog; recipient copy for them lives in git history, not copy.ts.
 */
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
    available: true,
  },
  {
    id: "valentine",
    name: "Valentine's Day",
    description: "Show your love and appreciation",
    icon: "💝",
    available: true,
  },
  {
    id: "girlfriend-day",
    name: "Girlfriend Day",
    description: "Celebrate the girl who makes days brighter",
    icon: "💗",
    available: true,
  },
  {
    id: "boyfriend-day",
    name: "Boyfriend Day",
    description: "Celebrate the one on your mind",
    icon: "💙",
    available: true,
  },
  {
    id: "thadingyut",
    name: "Thadingyut",
    description: "Festival of lights — welcome the end of Lent",
    icon: "🏮",
    available: true,
  },
  {
    id: "thingyan",
    name: "Thingyan",
    description: "Myanmar New Year water festival",
    icon: "🌊",
    available: true,
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
