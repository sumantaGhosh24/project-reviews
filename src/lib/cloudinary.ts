import cloudinary from "cloudinary";
import path from "path";
import os from "os";
import fs from "fs/promises";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function savePhotosToLocal(files: File[]) {
  const multipleBuffersPromise = files.map((file) =>
    file.arrayBuffer().then((data) => {
      const buffer = Buffer.from(data);
      const name = crypto.randomUUID();
      const ext = file.type.split("/")[1];
      const tempDir = os.tmpdir();
      const uploadDir = path.join(tempDir, `/${name}.${ext}`);
      fs.writeFile(uploadDir, buffer);
      return {filepath: uploadDir};
    })
  );
  return await Promise.all(multipleBuffersPromise);
}

export async function uploadToCloudinary(files: File[]) {
  const newFiles = await savePhotosToLocal(files);
  const multiplePhotosPromise = newFiles.map((file) =>
    cloudinary.v2.uploader.upload(file.filepath, {
      folder: "nextjs",
    })
  );
  const results = await Promise.all(multiplePhotosPromise);
  newFiles.map((file) => fs.unlink(file.filepath));
  return results;
}

export async function destroyFromCloudinary(publicId: string) {
  if (publicId) return await cloudinary.v2.uploader.destroy(publicId);
}
