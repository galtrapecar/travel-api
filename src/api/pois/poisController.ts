import { Route, Get, Query } from "tsoa";
import { PointOfInterest } from "./poi";
import { PoisService } from "./poisService";

@Route("pois")
export class PoisController {
  @Get()
  public async get(
    @Query() iso2: string,
    @Query() city?: string
  ): Promise<PointOfInterest[]> {
    if (city) return new PoisService().get(city, iso2);
    return new PoisService().getInCountry(iso2);
  }

  @Get("/inRadius")
  public async getInRadius(
    @Query() lat: number,
    @Query() lng: number,
    @Query() radius?: number
  ): Promise<PointOfInterest[]> {
    return new PoisService().getInRadius(lat, lng, radius);
  }

  @Get("/nearPolyline")
  public async getNearPolyline(
    @Query() polyline: string
  ): Promise<PointOfInterest[]> {
    return new PoisService().getNearPolyline(polyline);
  }
}
