import { City } from "./city";

export class CitiesService {
  public get(name: string): City {
    return {
      city: name,
      city_ascii: name,
      country: "TestCountry",
      lat: 0,
      lng: 0,
      iso2: "TT",
      iso3: "TST",
      population: 100,
      id: 12345678,
    };
  }
}
