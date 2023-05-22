import { Router, Request, Response, NextFunction } from "express";
import sanitize from "mongo-sanitize";

const route = Router();

export default (app: Router) => {
  function MongoSanitize(data: any) {
    return sanitize(data);
  }
  app.use(
    "/conversations",
    route,
    function (req: Request, res: Response, next: NextFunction) {
      req.body = MongoSanitize(req.body);
      next();
    }
  );

  route.get("/");
};
