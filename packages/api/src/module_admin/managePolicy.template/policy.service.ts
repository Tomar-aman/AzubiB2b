import ObjectIdConverter from "../../utils/objectIdConvertor";
import { PolicyContentModel } from "../../models";
import { PolicyContentDoc } from "../../models/managePrivacyPolicy";

export class PrivacyPolicyContentService {
    private readonly objectIdConverter: ObjectIdConverter;
    constructor() {
        this.objectIdConverter = new ObjectIdConverter();
    }

    public async privacyPolicyContent(data: PolicyContentDoc) {
        const policyContent = await PolicyContentModel.findOneAndUpdate({}, data, {
            new: true,
            upsert: true,
        });
        return policyContent;
    };

    public async getPrivacyPolicyContent({ companyId }) {
        const objectId = this.objectIdConverter.convertToObjectId(companyId);

        const result = await PolicyContentModel.findOne({ companyId: objectId });
        return result;
    };

    public async getPrivacyPolicyContentForApp({ companyId }) {
        const result = await PolicyContentModel.findOne({ companyId });
        return result;
    };
}