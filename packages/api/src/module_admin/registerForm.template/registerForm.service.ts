import ObjectIdConverter from "../../utils/objectIdConvertor";
import { RegisterFormModel } from "../../models";
import { type RegisterForm } from "../../models/registerForm";

export class RegisterFormService {
  private readonly objectIdConverter: ObjectIdConverter;
  constructor() {
    this.objectIdConverter = new ObjectIdConverter();
  }

  public async add(data: RegisterForm) {
    const form = await RegisterFormModel.create(data);
    return form;
  }

  public async getAllForApp({ searchValue, recordPerPage, companyId }) {
    recordPerPage = recordPerPage ?? 10;
    recordPerPage = recordPerPage > 0 ? recordPerPage : 10;
    const objectId = this.objectIdConverter.convertToObjectId(companyId);

    const pipeline: any[] = [
      {
        $match: {
          isDeleted: false,
          companyId: objectId,
        },
      },
    ].filter(Boolean);

    if (searchValue) {
      pipeline.push({
        $match: {
          name: { $regex: new RegExp(searchValue, "i") },
        },
      });
    }

    const forms = await RegisterFormModel.aggregate(pipeline).exec();
    return forms;
  }
}
