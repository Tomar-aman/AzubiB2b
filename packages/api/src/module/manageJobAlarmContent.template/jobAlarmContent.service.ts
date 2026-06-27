import { JobAlarmContentModel } from "../../models";
import { JobAlarmContentDocument } from "../../models/jobAlarmContent";

export class JobAlarmContentService {
    public async jobAlarmContent(data: JobAlarmContentDocument) {
        const content = await JobAlarmContentModel.findOneAndUpdate({}, data, {
            new: true,
            upsert: true
        })
        return content;
    };

    public async getJobAlarmContent() {
        const result = await JobAlarmContentModel.find();
        return result;
    };

    public async getJobAlarmContentForApp() {
        const result = await JobAlarmContentModel.find();
        return result;
    };
}