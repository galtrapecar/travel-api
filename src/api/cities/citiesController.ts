import { Controller, Get, Query, Route } from "tsoa";
import { City } from "./city";
import { CitiesService } from "./citiesService";

@Route("cities")
export class CitiesController extends Controller {
  @Get()
  public async getCity(@Query() name: string): Promise<City[]> {
    return new CitiesService().get(name);
  }

  @Get("/search")
  public async searchCity(@Query() query: string): Promise<City[]> {
    return new CitiesService().search(query);
  }

  @Get("/inRadius")
  public async getCityInRadius(
    @Query() lat: number,
    @Query() lng: number,
    @Query() radius?: number,
    @Query() population?: number
  ): Promise<City[]> {
    this.setStatus(201);
    return new CitiesService().getInRadius(lat, lng, radius, population);
  }

  @Get("/closest")
  public async getClosestCity(
    @Query() lat: number,
    @Query() lng: number
  ): Promise<City | undefined> {
    return new CitiesService().getClosestCity(lat, lng);
  }
}
