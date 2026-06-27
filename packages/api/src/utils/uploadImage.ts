import path from "path";
import logger from "./logger";
import fs from "fs";

export class UploadImage {
  public uploadImage = async (
    files: any,
    basePath: string,
    isObj?: boolean,
  ) => {
    try {
      basePath = basePath.trim();
      const fileExt = files.name.split(".").pop(); // Get the file extension
      const fileName = `${Date.now()}.${fileExt}`; // Generate a unique file name
      const fileType = files.mimetype; // Get the MIME type

      // Resolve the full path for the base directory
      const uploadDir = path.join(process.cwd(), basePath);

      // Ensure the directory exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Full path to save the file
      const filePath = path.join(uploadDir, fileName);

      // Move the file
      await new Promise<void>((resolve, reject) => {
        files.mv(filePath, (err: any) => {
          if (err) {
            logger.error("upload error", err);
            reject(new Error("Error while uploading image"));
          }
          resolve();
        });
      });

      const image = path.join(basePath, fileName).replace(/\\/g, "/"); // Relative path for response
      const icon = {
        path: image, // Path to the file
        filetype: fileType, // Type of the file, e.g., "image", "pdf"
      };

      return isObj ? icon : image;
    } catch (err) {
      logger.error(err);
      throw new Error("Error while uploading image");
    }
  };
}
