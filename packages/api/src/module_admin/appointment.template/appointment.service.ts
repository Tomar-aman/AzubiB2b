
import type { AppointmentForm } from "../../models/appointmentForm";
import { AppointmentContentModel, AppointmentFormModel } from "../../models";
import { AppointmentContentDoc } from "../../models/appointmentContent";

export class AppointmentFormService {
    public async add(data: AppointmentForm) {
        const newData = await AppointmentFormModel.create(data);
        return newData;
    };

    public async appointmentContent(data: AppointmentContentDoc) {
        const content = await AppointmentContentModel.findOneAndUpdate({}, data, {
            new: true,
            upsert: true
        });
        return content;
    };

    public async getAppointmentContent({ companyId }) {
        const result = await AppointmentContentModel.findOne(companyId);
        return result;
    };

    public async getAppointmentContentForApp({ companyId }) {
        const result = await AppointmentContentModel.find({ companyId });
        return result;
    }
}