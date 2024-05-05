import { Get, Query, Route } from "tsoa";
import { ImagesService } from "./imagesService";
import { Image } from "./image";

@Route("images")
export class ImagesController {
  @Get()
  public async get(
    @Query() query: string,
    @Query() count?: number
  ): Promise<Image[]> {
    return new ImagesService().get(query, count);
  }
}
