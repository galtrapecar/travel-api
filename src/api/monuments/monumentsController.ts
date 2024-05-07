import { Route, Get, Query } from "tsoa";
import { Monument } from "./monument";
import { MonumentsService } from "./monumentsService";

@Route("monuments")
export class MonumentsController {
  @Get()
  public async get(@Query() iso2: string, @Query() city?: string): Promise<Monument[]> {
    if (city) return new MonumentsService().get(city, iso2);
    return new MonumentsService().getInCountry(iso2);
  }
}
