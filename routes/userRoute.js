import express from 'express';
import { createData, verifyData ,checkLogin,generateAccestoken, logout} from '../controllers/userController.js';
import {upload} from '../controllers/fileControler.js';
// import checkUserVerification from '../controllers/fileControler.js';
import {checkUserVerification} from '../controllers/fileControler.js';
import { validateData } from '../middleware/validateData.js';
import { seedDatabase } from '../seeds/userseedData.js';
import { userRegistrationSchema, userLoginSchema } from '../validator/userValidation.js';

const route = express.Router();

route.post('/create', validateData(userRegistrationSchema),createData);
route.get('/verify/:token',verifyData);
route.post('/check',validateData(userLoginSchema),checkLogin);
route.get('/createToken',generateAccestoken);
route.get('/logout',logout);
// Route for file upload
route.post('/upload', checkUserVerification, upload.single('file'), async (req, res) => {
  try {
    console.log("Uploaded File:", req.file);
    if (!req.file) {
      return res.status(400).json({ error: 'File upload failed' });
    }

    // Update userSchema with filename
    req.user.fileName = req.file.filename;
    await req.user.save(); // Save changes to the user document

    res.status(200).json({
      message: 'File uploaded successfully',
      file: req.file,
      user: {
        userId: req.user._id,
        fileName: req.user.fileName
      }
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


route.post('/seedUser',seedDatabase);

export default route;