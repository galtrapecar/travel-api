import { Route, Body, Post } from "tsoa";
import { Route as RouteType, RouteDto } from "./route";
import { RoutesService } from "./routesService";

@Route("routes")
export class RoutesController {
  @Post()
  public async getRoute(
    @Body() body: RouteDto,
  ): Promise<RouteType> {
    return new RoutesService().get(body);
  }
}
