import { Controller, Get, Query, Route } from "tsoa";
import { City } from "./city";
import { CitiesService } from "./citiesService";

@Route("cities")
export class CitiesController extends Controller {
  @Get()
  public async getCity(@Query() name: string): Promise<City> {
    return new CitiesService().get(name);
  }
}
