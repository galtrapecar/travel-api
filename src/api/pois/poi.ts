export interface PointOfInterest {
  id: string;
  name: string;
  name_ascii: string;
  lat: number;
  lng: number;
  iso2: string;
  location: string;
  type: "windmill" | "monument";
}
