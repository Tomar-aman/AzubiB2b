import { type Request, type Response } from "express";
import { SyncService } from "./sync.service";
import logger from "../../utils/logger";
import { UploadImage } from "../../utils/uploadImage";

class SyncController {
  private readonly syncService: SyncService;
  private readonly uploadImage: UploadImage;

  constructor() {
    this.syncService = new SyncService();
    this.uploadImage = new UploadImage();
  }

  /**
   * Uploads one or more files (images or documents) for a Fachzubi company/job
   * edit and returns their absolute URLs so the superadmin UI can attach them.
   * Files may be sent under any field name (express-fileupload collects all).
   */
  public uploadFachzubiFiles = async (req: Request, res: Response) => {
    try {
      const type =
        (req.query.type as string) || (req.body?.type as string) || "image";
      const folder =
        type === "document" ? "/public/fachzubi-docs" : "/public/fachzubi-images";

      const filesObj: any = req.files || {};
      const collected: any[] = [];
      for (const key of Object.keys(filesObj)) {
        const val = filesObj[key];
        if (Array.isArray(val)) collected.push(...val);
        else if (val) collected.push(val);
      }
      if (!collected.length) {
        res.status(400).json({ message: "No files uploaded" });
        return;
      }

      const base = (process.env.BACKEND_URL || "").replace(/\/$/, "");
      const uploaded: Array<{ file: string; fileName: string; type: string }> = [];
      for (const file of collected) {
        const relPath = await this.uploadImage.uploadImage(file, folder);
        const rel = String(relPath).startsWith("/")
          ? String(relPath)
          : `/${relPath}`;
        uploaded.push({
          file: base ? `${base}${rel}` : rel,
          fileName: file.name,
          type: file.mimetype,
        });
      }

      res.status(200).json({ message: "Files uploaded successfully", files: uploaded });
    } catch (error) {
      logger.error("sync:uploadFachzubiFiles", error);
      res.status(500).json({ message: "Failed to upload files", error });
    }
  };

  public upsertCompany = async (req: Request, res: Response) => {
    try {
      const company = await this.syncService.upsertCompany(req.body);
      res.status(200).json({ message: "Company synced successfully", company });
    } catch (error) {
      logger.error("sync:upsertCompany", error);
      res.status(500).json({ message: "Failed to sync company", error });
    }
  };

  public upsertJob = async (req: Request, res: Response) => {
    try {
      const job = await this.syncService.upsertJob(req.body);
      res.status(200).json({ message: "Job synced successfully", job });
    } catch (error) {
      logger.error("sync:upsertJob", error);
      res.status(500).json({ message: "Failed to sync job", error });
    }
  };

  public toggleCompanyStatus = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const company = await this.syncService.toggleCompanyStatus(id);
      if (!company) {
        res.status(404).json({ message: "Company not found" });
        return;
      }
      res.status(200).json({ message: "Status updated", status: company.status });
    } catch (error) {
      logger.error("sync:toggleCompanyStatus", error);
      res.status(500).json({ message: "Failed to update status", error });
    }
  };

  public deleteCompany = async (req: Request, res: Response) => {
    try {
      const { fachzubiId } = req.params;
      await this.syncService.deleteCompany(fachzubiId);
      res.status(200).json({ message: "Company deleted successfully" });
    } catch (error) {
      logger.error("sync:deleteCompany", error);
      res.status(500).json({ message: "Failed to delete company", error });
    }
  };

  public updateFachzubiCompany = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const company = await this.syncService.updateFachzubiCompanyById(
        id,
        req.body,
      );
      if (!company) {
        res.status(404).json({ message: "Company not found" });
        return;
      }
      res.status(200).json({ message: "Company updated successfully", company });
    } catch (error) {
      logger.error("sync:updateFachzubiCompany", error);
      res.status(500).json({ message: "Failed to update company", error });
    }
  };

  public deleteFachzubiCompanyById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await this.syncService.deleteFachzubiCompanyById(id);
      if (!result) {
        res.status(404).json({ message: "Company not found" });
        return;
      }
      res.status(200).json({ message: "Company deleted successfully" });
    } catch (error) {
      logger.error("sync:deleteFachzubiCompanyById", error);
      res.status(500).json({ message: "Failed to delete company", error });
    }
  };

  public getFachzubiCompanies = async (req: Request, res: Response) => {
    try {
      const page = Number(req.query.page) || 1;
      const recordPerPage = Number(req.query.recordPerPage) || 10;
      const result = await this.syncService.getFachzubiCompanies(
        page,
        recordPerPage,
      );
      res.status(200).json({ message: "Fachzubi companies retrieved", ...result });
    } catch (error) {
      logger.error("sync:getFachzubiCompanies", error);
      res.status(500).json({ message: "Failed to retrieve companies", error });
    }
  };

  public deleteJob = async (req: Request, res: Response) => {
    try {
      const { fachzubiId } = req.params;
      await this.syncService.deleteJob(fachzubiId);
      res.status(200).json({ message: "Job deleted successfully" });
    } catch (error) {
      logger.error("sync:deleteJob", error);
      res.status(500).json({ message: "Failed to delete job", error });
    }
  };

  public toggleJobStatus = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const job = await this.syncService.toggleJobStatus(id);
      if (!job) {
        res.status(404).json({ message: "Job not found" });
        return;
      }
      res.status(200).json({ message: "Status updated", status: job.status });
    } catch (error) {
      logger.error("sync:toggleJobStatus", error);
      res.status(500).json({ message: "Failed to update status", error });
    }
  };

  public updateFachzubiJob = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const job = await this.syncService.updateFachzubiJobById(id, req.body);
      if (!job) {
        res.status(404).json({ message: "Job not found" });
        return;
      }
      res.status(200).json({ message: "Job updated successfully", job });
    } catch (error) {
      logger.error("sync:updateFachzubiJob", error);
      res.status(500).json({ message: "Failed to update job", error });
    }
  };

  public deleteFachzubiJobById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await this.syncService.deleteFachzubiJobById(id);
      if (!result) {
        res.status(404).json({ message: "Job not found" });
        return;
      }
      res.status(200).json({ message: "Job deleted successfully" });
    } catch (error) {
      logger.error("sync:deleteFachzubiJobById", error);
      res.status(500).json({ message: "Failed to delete job", error });
    }
  };

  public getFachzubiJobById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const job = await this.syncService.getFachzubiJobById(id);
      if (!job) {
        res.status(404).json({ message: "Job not found" });
        return;
      }
      res.status(200).json({ message: "Fachzubi job retrieved", job });
    } catch (error) {
      logger.error("sync:getFachzubiJobById", error);
      res.status(500).json({ message: "Failed to retrieve job", error });
    }
  };

  public getFachzubiCompanyById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const company = await this.syncService.getFachzubiCompanyById(id);
      if (!company) {
        res.status(404).json({ message: "Company not found" });
        return;
      }
      res.status(200).json({ message: "Fachzubi company retrieved", company });
    } catch (error) {
      logger.error("sync:getFachzubiCompanyById", error);
      res.status(500).json({ message: "Failed to retrieve company", error });
    }
  };

  public getFachzubiJobs = async (req: Request, res: Response) => {
    try {
      const page = Number(req.query.page) || 1;
      const recordPerPage = Number(req.query.recordPerPage) || 10;
      const result = await this.syncService.getFachzubiJobs(page, recordPerPage);
      res.status(200).json({ message: "Fachzubi jobs retrieved", ...result });
    } catch (error) {
      logger.error("sync:getFachzubiJobs", error);
      res.status(500).json({ message: "Failed to retrieve jobs", error });
    }
  };
}

export default SyncController;
