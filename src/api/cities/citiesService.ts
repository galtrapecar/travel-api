import { Client } from "pg";
import { City } from "./city";

export class CitiesService {
  public async get(name: string): Promise<City[]> {
    const client = new Client();
    try {
      await client.connect();
      const res = await client.query(
        "SELECT * FROM cities WHERE city = $1 OR city_ascii = $1",
        [name]
      );
      return res.rows;
    } catch (error) {
      return [];
    } finally {
      await client.end();
    }
  }

  public async search(query: string): Promise<City[]> {
    const client = new Client();
    try {
      await client.connect();
      const res = await client.query(
        "SELECT * FROM cities WHERE LOWER(city) LIKE $1 OR LOWER(city_ascii) LIKE $1",
        [`%${query}%`]
      );
      return res.rows;
    } catch (error) {
      console.log(error);
      
      return [];
    } finally {
      await client.end();
    }
  }
}
