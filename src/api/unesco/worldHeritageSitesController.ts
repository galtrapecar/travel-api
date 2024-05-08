import { Route, Get, Query } from "tsoa";
import { WorldHeritageSite } from "./worldHeritageSite";
import { WorldHeritageSitesService } from "./worldHeritageSitesService";

@Route("worldHeritageSites")
export class WorldHeritageSitesController {
  @Get()
  public async get(@Query() iso2: string): Promise<WorldHeritageSite[]> {
    return new WorldHeritageSitesService().get(iso2);
  }

  @Get("/inRadius")
  public async getInRadius(
    @Query() lat: number,
    @Query() lng: number,
    @Query() radius?: number
  ): Promise<WorldHeritageSite[]> {
    return new WorldHeritageSitesService().getInRadius(lat, lng, radius);
  }
}
