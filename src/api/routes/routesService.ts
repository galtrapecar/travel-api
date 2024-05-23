import axios from "axios";
import { RouteDto } from "./route";
import { Client } from "pg";

export class RoutesService {
  public async get(body: RouteDto) {
    const client = new Client();
    try {
      await client.connect();
      const res = await client.query(
        `WITH 
            city1 AS (SELECT lat, lng, city FROM cities WHERE LOWER(city) LIKE LOWER($1) AND LOWER(iso3) LIKE LOWER($2)),
            city2 AS (SELECT lat, lng, city FROM cities WHERE LOWER(city) LIKE LOWER($3) AND LOWER(iso3) LIKE LOWER($4))
            SELECT city1.city AS city1, city2.city AS city2,
            earth_distance(ll_to_earth(city1.lat, city1.lng), ll_to_earth(city2.lat, city2.lng))
            AS distance
            FROM city1, city2`,
        [
          `%${body.route[0].name}%`,
          `%${body.route[0].country}%`,
          `%${body.route[1].name}%`,
          `%${body.route[1].country}%`,
        ]
      );
      return {
        distance: res.rows.at(0).distance / 1000,
      };
    } catch (error) {
      return {
        distance: 0,
      };
    } finally {
      await client.end();
    }
  }
}
