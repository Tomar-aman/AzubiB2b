import { AppColorModel } from "../../models";
import { type AppColorDoc } from "../../models/appColor";

export class AppColorService {
  public async appColorContent(data: AppColorDoc) {
    const colorContent = await AppColorModel.findOneAndUpdate({}, data, {
      new: true,
      upsert: true,
    });
    return colorContent;
  }

  public async getAppColorContent() {
    const result = await AppColorModel.findOne();
    return result;
  }
}
