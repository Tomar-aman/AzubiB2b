import type mongoose from "mongoose";
import { type FilterQuery } from "mongoose";
import { UserModel, UserSessionModel } from "../../models";
import { type User, type UserDocument } from "../../models/user.template";
import { type UserSession } from "../../models/userSessionModel";
import bcrypt from "bcrypt";

export class UserService {
  public async findById(id: string | mongoose.Schema.Types.ObjectId) {
    const user = await UserModel.findById(id);
    return user;
  }

  public async findOneWithOptions(options: FilterQuery<UserDocument>) {
    const user = await UserModel.findOne(options);
    return user;
  }

  public async create(user: User) {
    const newUser = await UserModel.create(user);
    return newUser;
  }

  public async createSession(payload: UserSession) {
    const { userId, userAgent, ipAddress } = payload;
    return await UserSessionModel.create({
      userId,
      userAgent,
      ipAddress,
    });
  }

  public async getAllUsersService(
    filter: any,
    page: number,
    recordPerPage: number,
  ): Promise<UserDocument[]> {
    try {
      const pageValue = page || 1;
      const recordPerPageValue = recordPerPage || 10;
      const skip = (pageValue - 1) * recordPerPageValue;

      const users = await UserModel.find(filter)
        .select("-password")
        .skip(skip)
        .limit(recordPerPage);
      return users;
    } catch (error) {
      throw new Error("Error fetching users");
    }
  };

  public async getUserById(id: string): Promise<UserDocument> {
    const user = await UserModel.findById(id).select("-password");
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  };

  public async getCount(filter: any) {
    const usersCount = await UserModel.find().count(filter);
    return usersCount;
  }

  public async updateUser(
    id: string,
    newPassword?: string,
    oldPassword?: string,
    profileFields?: Record<string, any>,
  ) {
    const user = await UserModel.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    if (oldPassword) {
      const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordMatch) {
        throw new Error("Old password is incorrect");
      }
    }

    if (newPassword) {
      user.password = newPassword;
    }

    if (profileFields) {
      Object.assign(user, profileFields);
    }

    await user.save();
    return user;
  }

  public async updateSuperAdmin(
    userId: string,
    newPassword?: string,
    oldPassword?: string,
    otherFields?: string,
  ) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("Super-admin not found");
    }

    if (oldPassword) {
      const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordMatch) {
        throw new Error("Old password is incorrect");
      }
    }

    if (newPassword) {
      user.password = newPassword;
    }

    if (otherFields) {
      Object.assign(user, otherFields);
    }

    await user.save();
    return user;
  }

  public async deleteUser(id: string) {
    const user = await UserModel.findByIdAndDelete(id);
    return user;
  }
}
