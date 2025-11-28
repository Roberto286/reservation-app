export enum EventCategory {
  Music = "MUSIC",
  Nightlife = "NIGHTLIFE",
  PerformingArts = "PERFORMING_ARTS",
  Holidays = "HOLIDAYS",
  Business = "BUSINESS",
}

export const EVENT_CATEGORY_LABELS: Record<EventCategory, string> = {
  [EventCategory.Music]: "Musica",
  [EventCategory.Nightlife]: "Vita notturna",
  [EventCategory.PerformingArts]: "Arti sceniche",
  [EventCategory.Holidays]: "Festività",
  [EventCategory.Business]: "Affari",
};
