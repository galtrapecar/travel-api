export interface PointOfInterest {
  id: string;
  name: string;
  name_ascii: string;
  lat: number;
  lng: number;
  iso2: string;
  location: string;
  type:
    | "bridge"
    | "castle"
    | "church"
    | "historical_site"
    | "monument"
    | "mosque"
    | "museum"
    | "palace"
    | "piece_of_art"
    | "pyramid"
    | "religious_site"
    | "tower"
    | "windmill";
}
