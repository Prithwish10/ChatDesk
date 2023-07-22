import { Service } from "typedi";
import { SearchRepository } from "../repositories/Search.repository";

@Service()
export class SearchService {
  constructor(private readonly _searchRepository: SearchRepository) {}

  public async findUsers(
    keyword: string,
    currentPage: number,
    itemsPerPage: number,
    sort: string,
    order: string
  ) {
    try {
      const users = await this._searchRepository.findUsers(
        keyword,
        currentPage,
        itemsPerPage,
        sort,
        order
      );

      return users;
    } catch (error) {
      throw error;
    }
  }

  public async findGroups(
    groupName: string,
    currentUserId: string,
    currentPage: number,
    itemsPerPage: number,
    sort: string,
    order: string
  ) {
    try {
      const groups = await this._searchRepository.findGroups(
        groupName,
        currentUserId,
        currentPage,
        itemsPerPage,
        sort,
        order
      );
      return groups;
    } catch (error) {
      throw error;
    }
  }

  public async findAll(
    keyword: string,
    currentUserId: string,
    currentPage: number,
    itemsPerPage: number
  ) {
    try {
      let sort = "firstName";
      let order = "asc";

      const users = await this.findUsers(
        keyword,
        currentPage,
        itemsPerPage,
        sort,
        order
      );

      sort = "group_name";

      const groups = await this.findGroups(
        keyword,
        currentUserId,
        currentPage,
        itemsPerPage,
        sort,
        order
      );

      return { users, groups };
    } catch (error) {
      throw error;
    }
  }
}
