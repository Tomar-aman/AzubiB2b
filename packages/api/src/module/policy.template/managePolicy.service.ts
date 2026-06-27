import { PrivacyPolicyModel } from "../../models";
import { PolicyDoc } from "../../models/superadminPolicies";


export class PolicyService {
    public async policyContent(data: PolicyDoc) {
        const policyContent = await PrivacyPolicyModel.findOneAndUpdate({}, data, {
            new: true,
            upsert: true,
        });
        return policyContent;
    };

    public async getPolicy() {
        const result = await PrivacyPolicyModel.find();
        return result;
    };

    public async getPolicyForApp() {
        const result = await PrivacyPolicyModel.find();
        return result;
    };
};