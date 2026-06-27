import { SideMenuModel } from "../../models";
import { type SideMenu } from "../../models/sidemenu";

export class SideMenuService {
  public async add(sideMenuData: SideMenu) {
    const newSideMenu = await SideMenuModel.create(sideMenuData);
    return newSideMenu;
  }

  public async getSideMenuById(id: string) {
    const sideMenu = await SideMenuModel.findById(id).populate("createdBy");
    return sideMenu;
  }

  public async updateSideMenuById(id: string, sideMenuData: SideMenu) {
    const sideMenu = await SideMenuModel.findByIdAndUpdate(
      id,
      { $set: sideMenuData },
      { new: true },
    );
    return sideMenu;
  }

  public async getAllSideMenusForApp(
    pageNo: string,
    recordPerPage: string,
    search?: string,
  ) {
    const limit = parseInt(recordPerPage || "0");
    const skip = (parseInt(pageNo) - 1) * limit;

    const query = search
      ? {
          isDeleted: false,
          $or: [
            { name: { $regex: search, $options: "i" } }, // Case-insensitive search in 'name'
            { url: { $regex: search, $options: "i" } }, // Case-insensitive search in 'url'
          ],
        }
      : { isDeleted: false };

    const SideMenus = await SideMenuModel.find(query)
      .populate("createdBy")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const count = await SideMenuModel.countDocuments(query);

    return {
      SideMenus,
      totalSideMenus: count,
      totalPages: Math.ceil(count / limit),
    };
  }

  public async deleteSideMenuById(id: string) {
    const deletedSideMenu = await SideMenuModel.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true } },
      { new: true },
    );
    return deletedSideMenu;
  }
}
