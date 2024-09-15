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
      return res.rows.map((city) => ({
        ...city,
        lat: parseFloat(city.lat),
        lng: parseFloat(city.lng),
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
    radius?: number,
    population?: number
  ): Promise<City[]> {
    if (!radius) radius = 400_000;
    if (!population) population = 0;
    const client = new Client();
    try {
      await client.connect();
      const res = await client.query(
        "SELECT DISTINCT * FROM cities WHERE (point(lng, lat) <@> point($2, $1)) < ($3 / 1609.344) AND population > $4 ORDER BY population DESC",
        [lat, lng, radius, population]
      );
      return res.rows.map((city) => ({
        ...city,
        lat: parseFloat(city.lat),
        lng: parseFloat(city.lng),
      }));
    } catch (error) {
      return [];
    } finally {
      await client.end();
    }
  }

  public async getClosestCity(
    lat: number,
    lng: number
  ): Promise<City | undefined> {
    const client = new Client();
    try {
      await client.connect();
      const res = await client.query(
        "SELECT * FROM cities ORDER BY (point(lng, lat) <@> point($2, $1)) LIMIT 1",
        [lat, lng]
      );
      return res.rows
        .map((city) => ({
          ...city,
          lat: parseFloat(city.lat),
          lng: parseFloat(city.lng),
        }))
        .at(0);
    } catch (error) {
      return;
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
      return res.rows.map((city) => ({
        ...city,
        lat: parseFloat(city.lat),
        lng: parseFloat(city.lng),
      }));
    } catch (error) {
      console.log(error);
      return [];
    } finally {
      await client.end();
    }
  }
}
