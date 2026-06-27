import { JobFormContentModel } from "../../models";
import { JobFormContentDocument } from "../../models/jobFormContent";

export class JobFormContentService {
    public async jobFormContent(data: JobFormContentDocument) {
        const content = await JobFormContentModel.findOneAndUpdate({}, data, {
            new: true,
            upsert: true
        });
        return content;
    };

    public async getJobFormContent() {
        const result = await JobFormContentModel.find();
        return result;
    };

    public async getJobFormContentForApp() {
        const result = await JobFormContentModel.find();
        return result;
    };
};