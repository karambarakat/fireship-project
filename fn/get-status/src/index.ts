import {onRequest} from "firebase-functions/v2/https";
import scrape from "./scrape";

export const helloWorld = onRequest((request, response) => {
  if (request.headers.authorization !== `Bearer ${process.env.auth}`) {
    response.send("not authorized");
    return;
  }

  scrape().then((value) => {
    response.json(value);
  });
});

