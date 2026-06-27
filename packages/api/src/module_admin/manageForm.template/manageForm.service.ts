import { type ContactForm } from "../../models/contactForm";
import { ContactFormModel } from "../../models";

export class ContactFormService {
  public async add(data: ContactForm) {
    const form = await ContactFormModel.create(data);
    return form;
  }
}
