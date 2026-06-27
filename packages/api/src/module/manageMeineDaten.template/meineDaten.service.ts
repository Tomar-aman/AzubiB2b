import { MeineDatenModel } from "../../models";
import { MeineDatenDoc } from "../../models/manageMeineDaten";

export class MeineDatenService {
    public async meineDatenContent(data: MeineDatenDoc) {
        const content = await MeineDatenModel.findOneAndUpdate({}, data, {
            new: true,
            upsert: true,
        });
        return content;
    };

    public async getContent() {
        const result = await MeineDatenModel.find();
        return result;
    };

    public async getContentForApp() {
        const result = await MeineDatenModel.find();
        return result;
    };
}