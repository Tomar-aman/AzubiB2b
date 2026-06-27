/* eslint-disable @typescript-eslint/ban-ts-comment */
import { type Request, type Response } from "express";
import logger from "../../utils/logger";
import { JobService } from "./job.service";
import mongoose from "mongoose";
import { CompanyModel, JobModel } from "../../models";
import { UploadImage } from "../../utils/uploadImage";

class JobController {
  private readonly jobService: JobService;
  private readonly uploadImage: UploadImage;

  constructor() {
    this.jobService = new JobService();
    this.uploadImage = new UploadImage();
  }

  public addJob = async (req: Request, res: Response) => {
    try {
      // const companyId = (req as any).admin.id;
      const payload = req.body;
      const companyId = req.body.companyId
      // payload.companyId = companyId;
      const company: any = await CompanyModel.findOne({ _id: companyId });
      const companyEmail = company.email;
      payload.email = companyEmail;

      const files: any = Array.isArray(req.files?.["jobImages[]"])
        ? req.files?.["jobImages[]"]
        : req.files?.["jobImages[]"]
          ? [req.files?.["jobImages[]"]]
          : [];

      const attachementFiles: any = Array.isArray(req.files?.["attachement[]"])
        ? req.files?.["attachement[]"]
        : req.files?.["attachement[]"]
          ? [req.files?.["attachement[]"]]
          : [];

      const jobs: any[] = [];
      const attachements: any[] = [];

      for (const file of files) {
        const uploadedFile = await this.uploadImage.uploadImage(
          file,
          "/public/jobImages"
        );
        jobs.push({
          file: uploadedFile
        });
      }

      for (const file of attachementFiles) {
        const uploadedFile = await this.uploadImage.uploadImage(
          file,
          "/public/job-attachment/"
        );

        attachements.push({
          file: uploadedFile
        });
      }

      if (jobs.length > 0) {
        payload.jobImages = jobs;
      }

      if (attachements.length > 0) {
        payload.attachement = attachements;
      }

      let additionalData: any = [];
      if (req.body.additionalData) {
        try {
          additionalData =
            typeof req.body.additionalData === "string"
              ? JSON.parse(req.body.additionalData)
              : req.body.additionalData;
        } catch (err) {
          throw new Error("Invalid additionalData format");
        }
      }

      payload.additionalData = additionalData;
      for (let i = 0; req.body[`additionalData[${i}][file]`]; i++) {
        if (typeof req.body[`additionalData[${i}][file]`] === "string") {
          additionalData.push({
            id:
              req.body[`additionalData[${i}][id]`] || additionalData.length + 1,
            text: req.body[`additionalData[${i}][text]`],
            file: req.body[`additionalData[${i}][file]`],
          });
        }
      }

      payload.additionalData = additionalData;

      if (req.body.city) {
        let cityArray: string[] = [];

        try {
          if (typeof req.body.city === "string") {
            if (req.body.city.startsWith("[")) {
              cityArray = JSON.parse(req.body.city);
            } else {
              cityArray = req.body.city.split(",");
            }
          } else {
            cityArray = req.body.city;
          }
        } catch (err) {
          throw new Error("Invalid city format");
        }

        if (!Array.isArray(cityArray)) {
          throw new Error("City must be an array of ObjectIds");
        }
        payload.city = cityArray.map((cityId: string) => {
          if (!mongoose.Types.ObjectId.isValid(cityId)) {
            throw new Error(`Invalid city ID: ${cityId}`);
          }
          return new mongoose.Types.ObjectId(cityId);
        });
      }
      if (req.body.videoLink) {
        payload.videoLink = req.body.videoLink;
      }
      if (req.body.embeddedCode) {
        payload.embeddedCode = req.body.embeddedCode;
      }

      const newJob = await this.jobService.addJob(payload);
      res.sendCreated201Response("Job added successfully", newJob);
    } catch (error) {
      logger.error("addJob", error);
      res.sendErrorResponse("Error adding job", error);
    }
  };

  public deleteJobById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const job = await JobModel.findById(id, { new: true });
      if (!job) {
        throw new Error("Job not found");
      }

      await job.deleteJob();
      res.sendSuccess200Response("Job marked as deleted successfully", { job });
    } catch (error) {
      logger.error("deleteJobById", error);
      res.sendErrorResponse("Error deleting job", error);
    }
  };

  public deleteJobImagesById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { type, fileUrl } = req.query;

      if (!type || !fileUrl) {
        throw new Error("type and fileId are required");
      }

      const job = await JobModel.findById(id);
      if (!job) {
        throw new Error("Job not found");
      }

      let fieldName = "";
      if (type === "image") fieldName = "jobImages";
      else if (type === "attachement") fieldName = "attachement";
      else throw new Error("Invalid type");

      const exists = job[fieldName].some(
        (item: any) => item.file.toString() === fileUrl.toString()
      );

      if (!exists) {
        throw new Error("File not found in job");
      }

      job[fieldName] = job[fieldName].filter(
        (item: any) => item.file.toString() !== fileUrl.toString()
      );

      await job.save();

      res.sendSuccess200Response("Image deleted successfully", { job });
    } catch (error) {
      logger.error("deleteJobById", error);
      res.sendErrorResponse("Error deleting job", error);
    }
  };

  public getDeletedJobs = async (req: Request, res: Response) => {
    try {
      const { searchValue, recordPerPage } = req.query;

      const deletedJobs = await this.jobService.getDeletedJobs({
        searchValue,
        recordPerPage: Number(recordPerPage),
      });

      res.sendSuccess200Response("Retrived deleted job", deletedJobs);
    } catch (error) {
      logger.error("getDeletedJobs", error);
      res.sendErrorResponse("Error retriveing deleted jobs", error);
    }
  };

  public restoreJobById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const job = await JobModel.findByIdAndUpdate(
        id,
        { $set: { isDeleted: false, deletedAt: null } },
        { new: true },
      );

      res.sendSuccess200Response("Job marked as restored successfully", {
        job,
      });
    } catch (error) {
      logger.error("restoreJobById", error);
      res.sendErrorResponse("Error restoring job", error);
    }
  };

  public updateStatus = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updatedJob = await this.jobService.updateStatus(id);

      if (!updatedJob) {
        res.sendNotFound404Response("Job not found", null);
        return;
      }

      const message = updatedJob.status ? "Active" : "Inactive";

      res.sendSuccess200Response(message, updatedJob);
    } catch (error) {
      logger.error("restoreJobById", error);
      res.sendErrorResponse("Error restoring job", error);
    }
  };

  public updateJobById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { existingJobImages, existingAttachments, ...otherFields } = req.body;

      let jobImages: any[] = [];
      if (existingJobImages) {
        try {
          const parsed = JSON.parse(existingJobImages);
          if (Array.isArray(parsed)) {
            jobImages = parsed;
          }
        } catch (e) {
          console.log("Could not parse existingJobImages");
        }
      }

      if (req.body.jobImages && Array.isArray(req.body.jobImages)) {
        for (const img of req.body.jobImages) {
          if (
            !img._id &&
            typeof img.file === "string" &&
            img.file.startsWith("data:")
          ) {
            const base64Data = img.file;
            const uploaded = await this.uploadImage.uploadImage(
              base64Data,
              "/public/jobImages"
            );
            jobImages.push({
              _id: null,
              file: uploaded,
            });
          }
        }
      }
      const uploadedJobImageFiles = Array.isArray(req.files?.["jobImages[]"])
        ? req.files?.["jobImages[]"]
        : req.files?.["jobImages[]"]
          ? [req.files?.["jobImages[]"]]
          : [];

      for (const file of uploadedJobImageFiles) {
        const uploadedFile = await this.uploadImage.uploadImage(
          file,
          "/public/jobImages"
        );
        jobImages.push({ file: uploadedFile });
      }

      otherFields.jobImages = jobImages;

      let attachements: any[] = [];
      if (existingAttachments) {
        try {
          const parsed = JSON.parse(existingAttachments);
          if (Array.isArray(parsed)) {
            attachements = parsed;
          }
        } catch (e) {
          console.log("Could not parse existingAttachments");
        }
      }

      if (req.body.attachement && Array.isArray(req.body.attachement)) {
        for (const att of req.body.attachement) {
          if (
            !att._id &&
            typeof att.file === "string" &&
            att.file.startsWith("data:")
          ) {
            const uploaded = await this.uploadImage.uploadImage(
              att.file,
              "/public/job-attachment/"
            );
            attachements.push({
              _id: null,
              file: uploaded,
            });
          }
        }
      }

      const uploadedAttachmentFiles = Array.isArray(req.files?.["attachement[]"])
        ? req.files?.["attachement[]"]
        : req.files?.["attachement[]"]
          ? [req.files?.["attachement[]"]]
          : [];

      for (const file of uploadedAttachmentFiles) {
        const uploadedFile = await this.uploadImage.uploadImage(
          file,
          "/public/job-attachment/"
        );
        attachements.push({ file: uploadedFile });
      }

      if (attachements.length > 0) {
        otherFields.attachement = attachements;
      }

      if (otherFields.city) {
        let cityArray;
        // eslint-disable-next-line prefer-const
        cityArray =
          typeof otherFields.city === "string"
            ? JSON.parse(otherFields.city)
            : otherFields.city;

        // Validate the data type
        if (!Array.isArray(cityArray)) {
          throw new Error("City must be an array of ObjectIds");
        }

        otherFields.city = cityArray.map((cityId: string) => {
          if (!mongoose.Types.ObjectId.isValid(cityId)) {
            throw new Error(`Invalid city ID: ${cityId}`);
          }
          return new mongoose.Types.ObjectId(cityId);
        });
      }
      // Handle `additionalData`
      let additionalData: any[] = [];

      if (req.body.additionalData) {
        try {
          additionalData =
            typeof req.body.additionalData === "string"
              ? JSON.parse(req.body.additionalData)
              : req.body.additionalData;

          if (!Array.isArray(additionalData)) {
            throw new Error("additionalData must be an array");
          }
        } catch (error) {
          throw new Error("Invalid additionalData format");
        }
      }

      otherFields.additionalData = additionalData;
      const job = await this.jobService.updateJobById(id, otherFields);
      res.sendSuccess200Response("Job updated successfully", job);
    } catch (error) {
      logger.error("updateJobById", error);
      res.sendErrorResponse("Error updating job", error);
    }
  };

  public getAllJobs = async (req: Request, res: Response) => {
    try {
      const { startDate, endDate, searchValue, recordPerPage, companyId, userId } = req.query;

      const jobs = await this.jobService.getAllJobs({
        startDate,
        endDate,
        searchValue,
        recordPerPage: Number(recordPerPage),
        companyId,
        userId,
      });

      res.sendSuccess200Response("Jobs retrieved successfully", jobs);
    } catch (error) {
      logger.error("getAllJobs", error);
      res.sendErrorResponse("Error retrieving jobs", error);
    }
  };

  public getJobById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const job = await this.jobService.getJobById(id);

      if (!job) {
        res.sendNotFound404Response("Job not found", null);
        return;
      }

      res.sendSuccess200Response("Job retrieved successfully", job);
    } catch (error) {
      logger.error("getJobById", error);
      res.sendErrorResponse("Error retrieving job", error);
    }
  };

  // For app
  public getAllJobsForApp = async (req: Request, res: Response) => {
    try {
      const {
        searchValue,
        industry,
        recordPerPage,
        selectedCities,
        jobType,
        companyId,
      } = req.query;

      const jobs = await this.jobService.getAllJobsForApp({
        searchValue,
        industry: industry ? JSON.parse(industry as any) : "",
        recordPerPage: Number(recordPerPage),
        selectedCities: selectedCities ? JSON.parse(selectedCities as any) : "",
        jobType: jobType ? JSON.parse(jobType as any) : "",
        companyId,
      });

      res.sendSuccess200Response("Jobs retrieved successfully", jobs);
    } catch (error) {
      logger.error("getAllJobs", error);
      res.sendErrorResponse("Error retrieving jobs", error);
    }
  };

  public getJobByIdForApp = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const job = await this.jobService.getJobByIdForApp(id);
      if (!job) {
        res.sendNotFound404Response("Job not found", null);
        return;
      }

      res.sendSuccess200Response("Job retrieved successfully", job);
    } catch (error) {
      logger.error("getJobById", error);
      res.sendErrorResponse("Error retriveing job", error);
    }
  };

}
export default JobController;
