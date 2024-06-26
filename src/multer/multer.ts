import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const allowed = [".png .jpg .jpeg"];
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("only .png .jpg .jpeg files are allowed."));
    }
  },
});
