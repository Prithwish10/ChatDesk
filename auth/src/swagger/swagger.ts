import { Application } from "express";
import YAML from "yamljs";
import path from "path";
import swaggerUI from "swagger-ui-express";
import config from "../config/config.global";

const swaggerDocument = YAML.load(path.join(__dirname, "swagger.yaml"));

export function setupSwagger(app: Application): void {
  app.use(
    `${config.api.prefix}${config.api.version}/users/api-docs`,
    swaggerUI.serve,
    swaggerUI.setup(swaggerDocument)
  );
}
