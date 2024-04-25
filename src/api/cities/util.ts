import axios from "axios";

// From https://www.npmjs.com/package/duckduckgo-images-api
export const getVqdToken = async (keywords: string) => {
  let token = null;
  try {
    let res = await axios.get("https://duckduckgo.com/", {
      params: {
        q: keywords,
      },
    });

    token = res.data.match(/vqd=([\d-]+)\&/)[1];
  } catch (error) {
    console.error(error);
  }
  return new Promise((resolve, reject) => {
    if (!token) reject("Failed to get token");
    resolve(token);
  });
};
