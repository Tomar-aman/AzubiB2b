import Joi from "joi";

// Joi schema for creating a job
export const createJobSchema = Joi.object({
  newCity: Joi.any().required(),
  industryName: Joi.string().required(),
  company: Joi.string().required(),
  jobTitle: Joi.string().required(),
  email: Joi.string().email().required(),
  additionalEmail: Joi.optional(),
  address: Joi.string().required(),
  mapUrl: Joi.string().required(),
  zipCode: Joi.string().required(),
  jobDescription: Joi.string().required(),
  attachments: Joi.array(),
  status: Joi.boolean().default(false),
});
