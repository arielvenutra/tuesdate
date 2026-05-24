export type PlaceStatus = "unvisited" | "selected" | "visited";

export interface Place {
  id: string;
  name: string;
  instagram_link: string | null;
  note: string | null;
  status: PlaceStatus;
  rating: number | null;
  review: string | null;
  created_at: string;
  visited_at: string | null;
}

export interface NewPlace {
  name: string;
  instagram_link?: string;
  note?: string;
}
