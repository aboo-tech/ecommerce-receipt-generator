import { v2 as cloudinary } from "cloudinary";
import { api_key, api_secret, cloud_name } from "../config/system.variable";

cloudinary.config({
  cloud_name: cloud_name,
  api_key: api_key,
  api_secret: api_secret,
});
export const uploadCloudinary = async (
  pdfBuffer: Buffer,
  receiptId: string,
): Promise<string> => {
  try {
    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          folder: "receipts",
          public_id: `receipt${receiptId}`,
          format: "pdf",
          overwrite: true,
        },

        (error, result) => {
          if (error) return reject(error);
          if (!result)
            return reject(new Error("No secure_url from Cloudinary"));

          resolve(result);
        },
      );
      uploadStream.end(pdfBuffer);
    });
    if (!result?.secure_url) {
      throw new Error("No secure_url from cloudinary");
    }
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    throw error; 
  }
};
