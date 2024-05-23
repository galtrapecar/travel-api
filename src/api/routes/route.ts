export interface Route {
  distance: number;
  duration?: number;
}

export interface RouteDto {
  route: {
    country: string;
    name: string;
  }[];
}
