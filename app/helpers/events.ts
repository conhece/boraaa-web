import type { EventCategory } from "@/lib/types/event";

export const eventCategoryMap = new Map<string, EventCategory>([
  ["Evento", "Event"],
  ["Negócios", "BusinessEvent"],
  ["Infantil", "ChildrensEvent"],
  ["Comédia", "ComedyEvent"],
  ["Curso", "CourseInstance"],
  ["Dança", "DanceEvent"],
  ["Entrega", "DeliveryEvent"],
  ["Educação", "EducationEvent"],
  ["Recorrente", "EventSeries"],
  ["Exposição", "ExhibitionEvent"],
  ["Festival", "Festival"],
  ["Culinária", "FoodEvent"],
  ["Hackathon", "Hackathon"],
  ["Literatura", "LiteraryEvent"],
  ["Música", "MusicEvent"],
  ["Publicação", "PublicationEvent"],
  ["Vendas", "SaleEvent"],
  ["Cinema", "ScreeningEvent"],
  ["Social", "SocialEvent"],
  ["Esportes", "SportsEvent"],
  ["Teatro", "TheaterEvent"],
  ["Artes visuais", "VisualArtsEvent"],
  ["3ª idade", "OlderAudienceEvent"],
  ["Saúde", "HealthEvent"],
  ["Tecnologia", "TechnologyEvent"],
  ["Turismo", "TourismEvent"],
]);

export const categoryToDisplayMap = new Map<EventCategory, string>();

// Populate the reverse map
for (const [displayName, categoryType] of eventCategoryMap.entries()) {
  // If there are multiple display names for the same category type,
  // this will keep the last one. Adjust logic if needed.
  categoryToDisplayMap.set(categoryType, displayName);
}
