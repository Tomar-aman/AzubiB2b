import Joi from "joi";

export const createCompanyBodyValidator = Joi.object({
  companyname: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
