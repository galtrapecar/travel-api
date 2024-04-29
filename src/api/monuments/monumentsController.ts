import { Route, Get, Query } from "tsoa";
import { Monument } from "./monument";
import { MonumentsService } from "./monumentsService";

@Route("monuments")
export class MonumentsController {
  @Get()
  public async get(@Query() city: string, @Query() iso2: string): Promise<Monument[]> {
    return new MonumentsService().get(city, iso2);
  }
}
