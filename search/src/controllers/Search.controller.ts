import { Service } from "typedi";
import { Request, Response, NextFunction } from "express";
import { SearchService } from "../services/Search.service";
import { createSearchSchema } from "../validations/search.validation.schema";
import { logger } from "../loaders/logger";

@Service()
export class SearchController {
  constructor(private readonly _searchService: SearchService) {}

  public async find(req: Request, res: Response, next: NextFunction) {
    try {
      await createSearchSchema.validateAsync(req.query);

      const currentUserId = req.currentUser!.id;
      const keyword = req.query.keyword as string;
      const page = parseInt(req.query.page as string) || 1;
      let limit = parseInt(req.query.limit as string) || 10;
      if (limit > 10) {
        limit = 10;
      }
      const { users, groups } = req.query;

      let usersBoolean = users === "true";
      let groupsBoolean = groups === "true";

      if (
        users &&
        groups &&
        ((usersBoolean && groupsBoolean) || (!usersBoolean && !groupsBoolean))
      ) {
        const { users, groups } = await this._searchService.findAll(
          keyword,
          currentUserId,
          page,
          limit
        );

        return res.status(200).json({
          success: true,
          statusCode: 200,
          users,
          groups,
        });
      } else if (usersBoolean) {
        const sort = "firstName";
        const order = "asc";
        const users = await this._searchService.findUsers(
          keyword,
          page,
          limit,
          sort,
          order
        );

        return res.status(200).json({
          success: true,
          statusCode: 200,
          users,
        });
      } else {
        const sort = "group_name";
        const order = "asc";
        const groups = await this._searchService.findGroups(
          keyword,
          currentUserId,
          page,
          limit,
          sort,
          order
        );

        return res.status(200).json({
          success: true,
          statusCode: 200,
          groups,
        });
      }
    } catch (error) {
      logger.error(`Error in controller while searching: ${error} `);
      next(error);
    }
  }
}
