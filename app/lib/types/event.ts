export type PublicEvent = {
  url: string;
  categories: string[];
  name: string;
  about: string;
  image: string;
  actor: string;
  duration: number;
  schedule: {
    startDate: string;
    endDate: string;
  }[];
  schema: {
    location: string;
  };
  cheapestPrice: number;
  minimumAge: number;
};
