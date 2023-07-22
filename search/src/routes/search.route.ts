import { Router, Request, Response, NextFunction } from "express";
import { currentUser, requireAuth } from "@pdchat/common";
import sanitize from "mongo-sanitize";
import Container from "typedi";
import { SearchController } from "../controllers/Search.controller";

const route = Router();

export default (app: Router) => {
  function MongoSanitize(data: any) {
    return sanitize(data);
  }

  app.use(
    "/search",
    route,
    function (req: Request, res: Response, next: NextFunction) {
      req.body = MongoSanitize(req.body);
      next();
    }
  );

  const searchController = Container.get(SearchController);

  route.get(
    "/",
    currentUser,
    requireAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      await searchController.find(req, res, next);
    }
  );
};
