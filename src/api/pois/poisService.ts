import { Client } from "pg";
import { PointOfInterest } from "./poi";

export class PoisService {
  public async get(city: string, iso2: string): Promise<PointOfInterest[]> {
    const client = new Client();
    try {
      await client.connect();
      const res = await client.query(
        "SELECT * FROM pois WHERE LOWER(location) LIKE $1 AND iso2 = $2",
        [`%${city}%`, iso2]
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

  public async getInCountry(iso2: string): Promise<PointOfInterest[]> {
    const client = new Client();
    try {
      await client.connect();
      const res = await client.query(
        "SELECT * FROM pois WHERE iso2 = $2",
        [iso2]
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
    radius: number = 10000
  ): Promise<PointOfInterest[]> {
    const client = new Client();
    try {
      await client.connect();
      const res = await client.query(
        "SELECT DISTINCT * FROM pois WHERE (point(lng, lat) <@> point($2, $1)) < ($3 / 1609.344)",
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
