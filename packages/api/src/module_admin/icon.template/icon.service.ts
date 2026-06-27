import { IconModel } from "../../models";
import { type Icon } from "../../models/icons";

export class IconService {
  public async addIcon(iconData: Icon) {
    const newIcon = await IconModel.create(iconData);
    return newIcon;
  }

  public async getIcons() {
    const pipeline: any[] = [];
    pipeline.push({
      $project: {
        _id: 1,
        icon: 1,
      },
    });

    const [icons] = await Promise.all([IconModel.aggregate(pipeline)]);
    return icons;
  }

  public async deleteIconsById(id: string) {
    const deletedIcons = await IconModel.findByIdAndDelete(id);
    return deletedIcons;
  };
}
