import { type Request, type Response } from "express";
import { UserService } from "./user.service";
import logger from "../../utils/logger";

class UserController {
  private readonly userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public getAllUsers = async (req: Request, res: Response) => {
    try {
      const { role, page, recordPerPage, search } = req.query;

      const pageNumber = page ? Number(page) : 1;
      const recordsPerPage = recordPerPage ? Number(recordPerPage) : 10;

      const filter: any = {};

      if (role) {
        filter.role = role;
      }

      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ];
      }

      const users = await this.userService.getAllUsersService(
        filter,
        pageNumber,
        recordsPerPage
      );
      const totalRecords = await this.userService.getCount({ role: "Sub-SuperAdmin" });
      const totalPages = Math.ceil(totalRecords / recordsPerPage);

      res.sendSuccess200Response("Users retrieved successfully",
        {
          users,
          pagination: {
            totalRecords,
            totalPages,
            currentPage: pageNumber,
            pageSize: recordsPerPage,
          }
        });
    } catch (error) {
      logger.error(error);
      res.sendErrorResponse("Error creating user", error);
    }
  };

  public updateUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { newPassword, oldPassword, ...otherProfileFields } = req.body;

      const company = await this.userService.updateUser(
        id,
        newPassword,
        oldPassword,
        otherProfileFields,
      );

      res.sendSuccess200Response("Company updated successfully", company);
    } catch (error) {
      logger.error(error);
      res.sendErrorResponse("Error updating profile", error);
    }
  };

  public getUserDetailById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      res.sendSuccess200Response("Sub-SuperAdmin retrived successfully", user);
    } catch (error) {
      logger.error("getUserDetailById", error);
      res.sendErrorResponse("getUserDetailById ", error);
    }
  };


  public getDetail = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      const user = await this.userService.findOneWithOptions({
        _id: userId,
      });

      if (!user) {
        res.status(404).json({ error: "Company not found" });
        return;
      }
      res.sendSuccess200Response("Super-admin retrived successfully", user);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      logger.error("getDetail", error);
      res.sendErrorResponse("getDetail ", error);
    }
  };

  public updateSuperAdmin = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      const { newPassword, oldPassword, ...otherFields } = req.body;

      const user = await this.userService.updateSuperAdmin(
        userId,
        newPassword,
        oldPassword,
        otherFields,
      );

      res.sendSuccess200Response("Super-admin updated successfully", user);
    } catch (error) {
      logger.error("updateSuperAdmin", error);
      res.sendErrorResponse("Error updating super-admin", error);
    }
  };

  public deleteUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await this.userService.deleteUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.sendCreated201Response("User deleted successfully", { user });
    } catch (error) {
      logger.error(error);
      res.sendErrorResponse("Error deleting company", error);
    }
  };
}

export default UserController;
