import axios from "axios";
import { getVqdToken } from "./util";

export class ImagesService {
  public async get(query: string, count?: number) {
    await new Promise((r) => setTimeout(r, 2000));
    const url = `https://duckduckgo.com/i.js`;
    const vqd = await getVqdToken(query);

    try {
      const response = await axios.get(url, {
        params: {
          o: "json",
          q: query,
          vqd,
          f: ",,,,,",
          p: 1,
        },
      });

      const data = response.data;

      if (count) {
        return data.results.slice(0, count);
      }
      return [data.results[0]];
    } catch (error) {
      return {
        message: error,
      };
    }
  }
}
