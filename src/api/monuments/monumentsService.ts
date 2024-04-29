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
}
