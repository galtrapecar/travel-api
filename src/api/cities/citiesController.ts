import { Body, Controller, Get, Query, Route } from "tsoa";
import { City } from "./city";
import { CitiesService } from "./citiesService";
import { DuckDuckGoImage, image_search } from "duckduckgo-images-api";

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

  @Get("/images")
  public async getCityImages(@Query() query: string): Promise<DuckDuckGoImage> {
    const results = await image_search({
      query,
      moderate: true,
      iterations: 1,
      retries: 2,
    });
    return results[0];
  }
}
