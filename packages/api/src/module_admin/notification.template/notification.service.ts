import { type NotificationDoc } from "../../models/notification";
import { DeviceIdModel, NotificationModel } from "../..//models";
import ObjectIdConverter from "../../utils/objectIdConvertor";

export class NotificationService {
  private readonly objectIdConverter: ObjectIdConverter;
  constructor() {
    this.objectIdConverter = new ObjectIdConverter();
  }

  public async createNotification(data: NotificationDoc) {
    const { companyId, title, description } = data;

    // const sevenDaysAgo = new Date();
    // sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 7);
    // sevenDaysAgo.setUTCHours(0, 0, 0, 0);

    // const existingNotification = await NotificationModel.findOne({
    //   companyId,
    //   createdAt: { $gte: sevenDaysAgo },
    // });

    // if (existingNotification) {
    //   throw new Error("Notification already sent in this week.");
    // }

    const newNotification = await NotificationModel.create({
      companyId,
      title,
      description,
    });

    const user = await DeviceIdModel.updateMany({
      notificationSentDate: new Date(),
    });
    // eslint-disable-next-line no-console
    console.log(user);
    return newNotification;
  }

  public async getAllNotifications({ companyId }) {
    const objectId = this.objectIdConverter.convertToObjectId(companyId);
    const result = await NotificationModel.find({ companyId: objectId });
    return result;
  }
}
