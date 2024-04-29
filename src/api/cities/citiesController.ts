import { Controller, Get, Middlewares, Query, Route } from "tsoa";
import { City } from "./city";
import { CitiesService } from "./citiesService";
import { DuckDuckGoImage } from "duckduckgo-images-api";
import { getVqdToken } from "./util";
import axios from "axios";
import apicache from 'apicache';

const cache = apicache.middleware;

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
  @Middlewares(cache('60 minutes'))
  public async getCityImages(
    @Query() query: string,
    @Query() count?: number
  ): Promise<DuckDuckGoImage[]> {
    await new Promise(r => setTimeout(r, 2000));
    const url = `https://duckduckgo.com/i.js`
    const vqd = await getVqdToken(query);
    const response = await axios.get(url, {
      params: {
        o: 'json',
        q: query,
        vqd,
        f: ',,,,,',
        p: 1,
      }
    }).catch(error => {
      console.log(error);
      throw error;
    });

    const data = response.data;

    if (count) {
      return data.results.slice(0, count);
    }
    return [data.results[0]];
  }
}
