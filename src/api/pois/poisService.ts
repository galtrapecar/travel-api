import { Client } from "pg";
import { PointOfInterest } from "./poi";
import { decode } from "@googlemaps/polyline-codec";

export class PoisService {
  public async get(city: string, iso2: string): Promise<PointOfInterest[]> {
    const client = new Client();
    try {
      await client.connect();
      const res = await client.query(
        "SELECT * FROM pois WHERE LOWER(location) LIKE $1 AND iso2 = $2",
        [`%${city}%`, iso2]
      );
      return res.rows.map((poi) => ({
        ...poi,
        lat: parseFloat(poi.lat),
        lng: parseFloat(poi.lng),
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
      const res = await client.query("SELECT * FROM pois WHERE iso2 = $2", [
        iso2,
      ]);
      return res.rows.map((poi) => ({
        ...poi,
        lat: parseFloat(poi.lat),
        lng: parseFloat(poi.lng),
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
      return res.rows.map((poi) => ({
        ...poi,
        lat: parseFloat(poi.lat),
        lng: parseFloat(poi.lng),
      }));
    } catch (error) {
      return [];
    } finally {
      await client.end();
    }
  }

  public async getNearPolyline(polyline: string): Promise<PointOfInterest[]> {
    const decodedPolyline = decode(polyline);
    const client = new Client();
    try {
      await client.connect();
      const res = await client.query(
        `WITH coordinates AS (
          SELECT
            unnest($1::float8[]) AS lat,
            unnest($2::float8[]) AS lng
          )
          SELECT DISTINCT p.*
          FROM pois p
          JOIN coordinates c
          ON (point(p.lng, p.lat) <@> point(c.lng, c.lat)) < ($3 / 1609.344);`,
        [
          decodedPolyline.map((latLng) => latLng[0]).slice(2, -2),
          decodedPolyline.map((latLng) => latLng[1]).slice(2, -2),
          15_000,
        ]
      );
      return res.rows.map((poi) => ({
        ...poi,
        lat: parseFloat(poi.lat),
        lng: parseFloat(poi.lng),
      }));
    } catch (error) {
      return [];
    } finally {
      await client.end();
    }
  }
}
