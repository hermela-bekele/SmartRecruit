import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

// Create uploads directory with absolute path
const uploadsDir = join(process.cwd(), 'uploads');
if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir, { recursive: true });
}

export const multerConfig = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      // Ensure directory exists before saving
      if (!existsSync(uploadsDir)) {
        try {
          mkdirSync(uploadsDir, { recursive: true });
          cb(null, uploadsDir);
        } catch (error) {
          cb(error as Error, '');
        }
      } else {
        cb(null, uploadsDir);
      }
    },
    filename: (req, file, cb) => {
      try {
        // Create unique file name
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = extname(file.originalname);
        const filename = `${uniqueSuffix}${ext}`;
        console.log('Generated filename:', filename);
        cb(null, filename);
      } catch (error) {
        console.error('Error generating filename:', error);
        cb(error as Error, '');
      }
    },
  }),
  fileFilter: (req: any, file: Express.Multer.File, cb: Function) => {
    try {
      // Allow only specific file types
      if (!file.originalname.match(/\.(pdf|doc|docx)$/)) {
        return cb(
          new Error('Only PDF, DOC, and DOCX files are allowed!'),
          false,
        );
      }
      cb(null, true);
    } catch (error) {
      console.error('Error in file filter:', error);
      cb(error as Error, false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
};
