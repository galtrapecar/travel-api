import { Client } from "pg";
import { WorldHeritageSite } from "./worldHeritageSite";

export class WorldHeritageSitesService {
  public async get(iso2: string): Promise<WorldHeritageSite[]> {
    const client = new Client();
    try {
      await client.connect();
      const res = await client.query(
        "SELECT * FROM unesco WHERE array_to_string(iso2, ',') like $1 ",
        [`%${iso2}%`]
      );
      return res.rows.map((monument) => ({
        ...monument,
        lat: parseFloat(monument.lat),
        lng: parseFloat(monument.lng),
      }));
    } catch (error) {
      return [];
    } finally {
      await client.end();
    }
  }

  public async getInRadius(
    lat: number,
    lng: number,
    radius: number = 60000
  ): Promise<WorldHeritageSite[]> {
    const client = new Client();
    try {
      await client.connect();
      const res = await client.query(
        "SELECT DISTINCT * FROM unesco WHERE (point(lng, lat) <@> point($2, $1)) < ($3 / 1609.344)",
        [lat, lng, radius]
      );
      return res.rows.map((monument) => ({
        ...monument,
        lat: parseFloat(monument.lat),
        lng: parseFloat(monument.lng),
      }));
    } catch (error) {
      return [];
    } finally {
      await client.end();
    }
  }
}
