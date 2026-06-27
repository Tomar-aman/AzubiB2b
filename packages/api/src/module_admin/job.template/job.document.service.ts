import { type Schema } from "mongoose";
import { JobDocumentModel } from "../../models/index";

interface jobDocument {
  document: Schema.Types.ObjectId;
  job: Schema.Types.ObjectId;
}
export class JobDocumentService {
  public async addDocuments(
    documentIds: Schema.Types.ObjectId[],
    jobId: Schema.Types.ObjectId,
  ) {
    const documents: jobDocument[] = [];
    documentIds.forEach((id) => documents.push({ document: id, job: jobId }));
    await JobDocumentModel.insertMany(documents);
  }

  public async deleteDocuments(documentIds: string[]) {
    await JobDocumentModel.deleteMany({ _id: { $in: documentIds } });
  }
}
