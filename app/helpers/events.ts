import type { EventCategory } from "@/lib/db/models/event";

export const eventCategoryMap = new Map<string, EventCategory>([
  ["Todos", "Event"],
  ["Event", "Event"],
  ["Negócios", "BusinessEvent"],
  ["Infantil", "ChildrensEvent"],
  ["Comédia", "ComedyEvent"],
  ["CourseInstance", "CourseInstance"],
  ["Dança", "DanceEvent"],
  ["DeliveryEvent", "DeliveryEvent"],
  ["Educação", "EducationEvent"],
  ["EventSeries", "EventSeries"],
  ["Exposição", "ExhibitionEvent"],
  ["Festival", "Festival"],
  ["Culinária", "FoodEvent"],
  ["Hackathon", "Hackathon"],
  ["Literatura", "LiteraryEvent"],
  ["Música", "MusicEvent"],
  ["PublicationEvent", "PublicationEvent"],
  ["SaleEvent", "SaleEvent"],
  ["Cinema", "ScreeningEvent"],
  ["SocialEvent", "SocialEvent"],
  ["SportsEvent", "SportsEvent"],
  ["Teatro", "TheaterEvent"],
  ["Artes visuais", "VisualArtsEvent"],
  ["OlderAudienceEvent", "OlderAudienceEvent"],
]);

export const categoryToDisplayMap = new Map<EventCategory, string>();

// Populate the reverse map
for (const [displayName, categoryType] of eventCategoryMap.entries()) {
  // If there are multiple display names for the same category type,
  // this will keep the last one. Adjust logic if needed.
  categoryToDisplayMap.set(categoryType, displayName);
}
