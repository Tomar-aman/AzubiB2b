import { ImpressumDoc } from "../../models/manageImpressum";
import { ImpressumModel } from "../../models";


export class ImpressumService {
    public async impressumContent(data: ImpressumDoc) {
        const impressumContent = await ImpressumModel.findOneAndUpdate({}, data, {
            new: true,
            upsert: true,
        });
        return impressumContent;
    };

    public async getImpressum() {
        const result = await ImpressumModel.find();
        return result;
    };

    public async getImpressumForApp() {
        const result = await ImpressumModel.find();
        return result;
    };
};