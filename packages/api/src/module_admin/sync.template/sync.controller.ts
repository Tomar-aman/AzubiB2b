import { type Request, type Response } from "express";
import { SyncService } from "./sync.service";
import logger from "../../utils/logger";

class SyncController {
  private readonly syncService: SyncService;

  constructor() {
    this.syncService = new SyncService();
  }

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
