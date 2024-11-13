import { Client } from "pg";
import { PointOfInterest } from "./poi";
import { decode } from "@googlemaps/polyline-codec";

export class PoisService {
  public async get(name: string, iso2: string): Promise<PointOfInterest[]> {
    const client = new Client();
    try {
      await client.connect();
      const res = await client.query(
        "SELECT * FROM pois WHERE LOWER(location) LIKE $1 AND iso2 = $2",
        [`%${name}%`, iso2]
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
    radius: number = 10000,
    withCity: boolean = true
  ): Promise<PointOfInterest[]> {
    const client = new Client();
    try {
      if (withCity) {
        await client.connect();
        const res = await client.query(
          `SELECT pois.*, cities.city, cities.city_ascii, cities.iso2 as city_iso2, cities.iso3 as city_iso3
        FROM pois
        JOIN cities ON pois.nearest_city_id = cities.id
        WHERE (point(pois.lng, pois.lat) <@> point($2, $1)) < ($3 / 1609.344)`,
          [lat, lng, radius]
        );
        return res.rows.map(
          (row): PointOfInterest => ({
            id: row.id,
            name: row.name,
            name_ascii: row.name_ascii,
            iso2: row.iso2,
            location: row.location,
            type: row.type,
            lat: parseFloat(row.lat),
            lng: parseFloat(row.lng),
            city: {
              id: row.nearest_city_id,
              city: row.city,
              city_ascii: row.city_ascii,
              iso2: row.city_iso2,
              iso3: row.city_iso3,
            },
          })
        );
      } else {
        await client.connect();
        const res = await client.query(
          `SELECT * FROM pois WHERE (point(lng, lat) <@> point($2, $1)) < ($3 / 1609.344)`,
          [lat, lng, radius]
        );
        return res.rows.map(
          (row): PointOfInterest => ({
            ...row,
            lat: parseFloat(row.lat),
            lng: parseFloat(row.lng),
          })
        );
      }
    } catch (error) {
      return [];
    } finally {
      await client.end();
    }
  }

  public async getNearPolyline(
    polyline: string,
    withCity: boolean = true
  ): Promise<PointOfInterest[]> {
    const decodedPolyline = decode(polyline);
    const client = new Client();
    try {
      if (withCity) {
        await client.connect();
        const res = await client.query(
          `WITH coordinates AS (
          SELECT
            unnest($1::float8[]) AS lat,
            unnest($2::float8[]) AS lng
          )
          SELECT DISTINCT p.*, cities.city, cities.city_ascii, cities.iso2 as city_iso2, cities.iso3 as city_iso3
          FROM pois p
          JOIN coordinates c
          ON (point(p.lng, p.lat) <@> point(c.lng, c.lat)) < ($3 / 1609.344)
          JOIN cities ON p.nearest_city_id = cities.id`,
          [
            decodedPolyline.map((latLng) => latLng[0]).slice(2, -2),
            decodedPolyline.map((latLng) => latLng[1]).slice(2, -2),
            15_000,
          ]
        );
        return res.rows.map((row) => ({
          id: row.id,
          name: row.name,
          name_ascii: row.name_ascii,
          iso2: row.iso2,
          location: row.location,
          type: row.type,
          lat: parseFloat(row.lat),
          lng: parseFloat(row.lng),
          city: {
            id: row.nearest_city_id,
            city: row.city,
            city_ascii: row.city_ascii,
            iso2: row.city_iso2,
            iso3: row.city_iso3,
          },
        }));
      } else {
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
        return res.rows.map((row) => ({
          ...row,
          lat: parseFloat(row.lat),
          lng: parseFloat(row.lng),
        }));
      }
    } catch (error) {
      return [];
    } finally {
      await client.end();
    }
  }

  public async getSloChurches(): Promise<
    { name: string; lat: number; lng: number }[]
  > {
    const client = new Client();
    try {
      await client.connect();
      const res = await client.query("SELECT * FROM slo_churches");
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
