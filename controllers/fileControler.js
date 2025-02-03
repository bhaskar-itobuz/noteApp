
import multer from 'multer';
import path from 'path';
import userSchema from '../model/userSchema.js'; // Adjust path based on project structure

// Configure multer storage
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads'); // Save files in 'uploads' directory
  },
  filename: (req, file, cb) => {
    const uniqueFilename = file.fieldname + '_' + Date.now() + path.extname(file.originalname);
    cb(null, uniqueFilename);
  }
});

// Multer file upload settings

export const upload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 1000000 // 1 MB limit
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg)$/)) {
      return cb(new Error('Please upload an image (PNG or JPG)'));
    }
    cb(null, true);
  }
});

// Middleware to check if user is verified
export const checkUserVerification = async (req, res, next) => {
  try {
    let userId = req.body.userId || req.query.userId;
    console.log(userId);
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const user = await userSchema.findById(userId); // Fetch user from database

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.verify) {
      return res.status(403).json({ error: 'User is not verified. Cannot upload files.' });
    }

    req.user = user; // Store user in request object for later use
    next();
  } catch (error) {
    console.error('Error verifying user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

