import { type SideBarContentDoc } from "../../models/manageSideBar";
import {
  AlarmContentModel,
  SideBarContentModel,
  TipsContentModel,
} from "../../models";
import { type AlarmContentDoc } from "../../models/manageAlarm";
import { type TipsContentDoc } from "../../models/manageTips";

export class SideBarContentService {
  // Side bar content
  public async sideBarContent(data: SideBarContentDoc) {
    const sideMenuContent = await SideBarContentModel.findOneAndUpdate(
      {},
      data,
      {
        new: true,
        upsert: true,
      },
    );
    return sideMenuContent;
  }

  public async getSideBarContent() {
    const result = await SideBarContentModel.findOne();
    return result;
  }

  // Manage Tips
  public async tipsContent(data: TipsContentDoc) {
    const tipsContent = await TipsContentModel.findOneAndUpdate({}, data, {
      new: true,
      upsert: true,
    });
    return tipsContent;
  }

  public async getTipsContent() {
    const result = await TipsContentModel.findOne();
    return result;
  }

  // Manage Alarm
  public async alarmContent(data: AlarmContentDoc) {
    const alarmContent = await AlarmContentModel.findOneAndUpdate({}, data, {
      new: true,
      upsert: true,
    });
    return alarmContent;
  }

  public async getAlarmContent() {
    const result = await AlarmContentModel.findOne();
    return result;
  }
}
