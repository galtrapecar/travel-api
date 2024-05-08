import { Client } from "pg";
import { Monument } from "./monument";

export class MonumentsService {
  public async get(city: string, iso2: string): Promise<Monument[]> {
    const client = new Client();
    try {
      await client.connect();
      const res = await client.query(
        "SELECT * FROM monuments WHERE LOWER(location) LIKE $1 AND iso2 = $2",
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

  public async getInCountry(iso2: string): Promise<Monument[]> {
    const client = new Client();
    try {
      await client.connect();
      const res = await client.query(
        "SELECT * FROM monuments WHERE iso2 = $2",
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
    radius: number = 40000
  ): Promise<Monument[]> {
    const client = new Client();
    try {
      await client.connect();
      const res = await client.query(
        "SELECT DISTINCT * FROM monuments WHERE (point(lng, lat) <@> point($2, $1)) < ($3 / 1609.344)",
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
