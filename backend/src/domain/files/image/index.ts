import multer, { FileFilterCallback, MulterError, diskStorage } from "multer";
import { pathToImageFolder } from "../../../globalconfig";
import { Request, Response } from "express";
import path from "path";

const MAX_FILE_SIZE_MB = 1;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1000000;

function fileFilter(
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) {
  const ext = path.extname(file.originalname);
  // Only allow images
  if (ext === ".png" || ext === ".jpg" || ext === ".jpeg" || ext === ".webp") {
    cb(null, true);
    return;
  }
  cb(null, false);
}

function destination(
  _req: Request,
  _file: Express.Multer.File,
  cb: (error: Error | null, destination: string) => void
) {
  cb(null, pathToImageFolder);
}

function filename(
  _req: Request,
  file: Express.Multer.File,
  cb: (error: Error | null, filename: string) => void
) {
  const ext = path.extname(file.originalname);
  if (!ext) {
    throw new Error("Failed to find file extension");
  }
  cb(null, `${crypto.randomUUID()}${ext}`);
}

const multerInstance = multer({
  fileFilter,
  storage: diskStorage({
    destination,
    filename,
  }),
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
  },
});

async function uploadImage(req: Request, res: Response) {
  multerInstance.single("image")(req, res, (err) => {
    if (err) {
      handleUploadError(res, err);
      return;
    }

    const file = req.file;
    if (!file) {
      res.status(400).send("No file received or invalid file type");
      return;
    }

    // TODO: Add image to database

    res.sendStatus(201);
    return;
  });
}

function handleUploadError(res: Response, err: unknown) {
  if (err instanceof MulterError) {
    const message = getMulterErrorMessage(err.code);
    if (message) {
      res.status(400).send(message);
      return;
    }
  }
  res.status(500).send("Failed to upload image");
  return;
}

function getMulterErrorMessage(code: multer.ErrorCode) {
  switch (code) {
    case "LIMIT_FILE_SIZE":
      return `Image size is too large, the maximum size is ${MAX_FILE_SIZE_MB} megabyte`;
    default:
      console.log(`Received unhandled multer error code "${code}"`);
      return "";
  }
}

export default { uploadImage };
