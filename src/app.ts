import express, {
  json,
  urlencoded,
  Request as ExRequest,
  Response as ExResponse,
  NextFunction,
} from "express";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "../build/routes";
import * as dotenv from "dotenv";
import cors from "cors";
import { ValidateError } from "tsoa";

dotenv.config();
export const app = express();

app.use(cors());

app.use(
  urlencoded({
    extended: true,
  })
);
app.use(json());

app.use("/docs", swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
  return res.send(
    swaggerUi.generateHTML(await import("../build/swagger.json"))
  );
});

RegisterRoutes(app);

app.use(function errorHandler(
  err: unknown,
  req: ExRequest,
  res: ExResponse,
  next: NextFunction
): ExResponse | void {
  if (err instanceof ValidateError) {
    console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
    return res.status(422).json({
      message: "Validation Failed",
      details: err?.fields,
    });
  }
  if (err instanceof Error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }

  next();
});

app.use(function notFoundHandler(_req, res: ExResponse) {
  res.status(404).send({
    message: "Not Found",
  });
});
