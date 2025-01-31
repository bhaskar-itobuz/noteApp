import noteSchema from "../model/noteSchema.js";
import userSchema from "../model/userSchema.js";
import sessionSchema from "../model/sessionSchema.js";
import jwt from "jsonwebtoken";

function getBearerToken(req) {
  const authorizationHeader = req.headers["authorization"];

  if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
    return authorizationHeader.split(" ")[1];
  } else {
    return null;
  }
}

export const createData = async (req, res) => {
  try {
    const token = getBearerToken(req);
    // console.log(token);
    jwt.verify(token, "ourSecretKey", async function (err, decoded) {
      if (err) {
        console.log(err);
        res.send("possibly the link is invalid or expired");
      } else {
        const id = decoded.userId;
        const { title, content } = req.body;
        const ans = await userSchema.findOne({ _id: id });
        const sameTitle = await noteSchema.findOne({ title: title });
        // const notesbyId = await noteSchema.find({userId : id});
        const loginCheck = await sessionSchema.findOne({ userId: id });
        const userId = loginCheck.userId;
        if (ans && !sameTitle && loginCheck) {
          // console.log("hi");
          const add = await noteSchema.create({
            userId,
            title,
            content,
          });

          if (add) {
            res.json({
              status: 200,
              message: "sucess",
            });
          }
        } else {
          res.json({
            status: 404,
            message: "creation failed",
          });
        }
      }
    });
  } catch (error) {
    res.json({
      status: 404,
      message: " not sucess",
    });
  }
};

export const updateData = async (req, res) => {
  try {
    const token = getBearerToken(req);
    jwt.verify(token, "ourSecretKey", async function (err, decoded) {
      if (err) {
        console.log(err);
        res.send("possibly the link is invalid or expired");
      } else {
        const id = decoded.userId;
        const { noteId } = req.params;
        console.log(noteId);
        const { title, content } = req.body;
        const findId = await noteSchema.findOne({ _id: noteId });
        const ans = await userSchema.findOne({ _id: id });
        const loginCheck = await sessionSchema.findOne({ userId: id });
        console.log(findId);
        if (findId && ans && loginCheck) {
          console.log("hi");
          const user = await noteSchema.findByIdAndUpdate(noteId, {
            title,
            content,
          });
          res.json({
            status: 200,
            message: "sucess",
          });
        } else {
          res.json({
            status: 404,
            message: "not success",
          });
        }
      }
    });
  } catch (error) {
    res.json({
      status: 404,
      message: " Data Not Found",
    });
  }
};

export const deleteData = async (req, res) => {
  try {
    const token = getBearerToken(req);
    console.log(token);
    jwt.verify(token, "ourSecretKey", async function (err, decoded) {
      if (err) {
        console.log(err);
        res.send("possibly the link is invalid or expired");
      } else {
        const id = decoded.userId;
        const { noteId } = req.params;
        const findId = await noteSchema.findOne({ _id: noteId });
        const ans = await userSchema.findOne({ _id: id });
        const loginCheck = await sessionSchema.findOne({ userId: id });
        if (findId && ans && loginCheck) {
          console.log("hi");
          const user = await noteSchema.findByIdAndDelete(noteId);
          res.json({
            status: 200,
            message: "Delete sucessfully",
          });
        } else {
          res.json({
            status: 404,
            message: "not deleted can not find data",
          });
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.json({
      status: 404,
      message: " Data Not Found",
    });
  }
};

export const findAll = async (req, res) => {
  try {
    const token = getBearerToken(req);
    jwt.verify(token, "ourSecretKey", async function (err, decoded) {
      if (err) {
        console.log(err);
        res.send("possibly the link is invalid or expired");
      } else {
        const id = decoded.userId;
        const ans = await userSchema.findOne({ _id: id });
        const loginCheck = await sessionSchema.findOne({ userId: id });
        const userId = loginCheck.userId;
        console.log(userId)
        const users = await noteSchema.find({ userId: userId });
        if (ans && loginCheck && users) {
          res.json({
            status: 200,
            message: "find successfully", users,
          });
        } else {
          res.json({
            status: 404,
            message: "not find data",
          });
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.json({
      status: 404,
      message: " Data Not Found",
    });
  }
};

export const findbyId = async (req, res) => {
  try {
    const token = getBearerToken(req);
    jwt.verify(token, "ourSecretKey", async function (err, decoded) {
      if (err) {
        console.log(err);
        res.send("possibly the link is invalid or expired");
      } else {
        const id = decoded.userId;
        const { noteId } = req.params;
        const ans = await userSchema.findOne({ _id: id });
        const loginCheck = await sessionSchema.findOne({ userId: id });
        const users = await noteSchema.findOne({ _id: noteId });
        if (ans && loginCheck && users) {
          res.json({
            status: 200,
            message: "find successfully", users,
          });
        } else {
          res.json({
            status: 404,
            message: "not find data",
          });
        }
      }
    });
  } catch (error) {
    res.json({
      status: 404,
      message: " Data Not Found",
    });
  }
};

// To sort by 'email' in descending order: GET /users?sortBy=email&sortOrder=desc
export const sortbyQuery = async (req, res) => {
  try {
        const token = getBearerToken(req);
        jwt.verify(token, "ourSecretKey", async function (err, decoded) {
          if (err) {
            console.log(err);
            res.send("possibly the link is invalid or expired");
          } else {
            const id = decoded.userId;
            const ans = await userSchema.findOne({ _id: id });
            const loginCheck = await sessionSchema.findOne({ userId: id });
            if (ans && loginCheck) {
              const sortBy = req.query.sortBy || 'timestamps'; // Default to 'createdAt' if not provided
              const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1; // Set sort order based on query param
              const sortCriteria = { [sortBy]: sortOrder }; // Dynamically create sort object
              const users = await noteSchema.find().sort(sortCriteria).limit(3); // Apply sort to query
              res.json({
                status: 200,
                message: "find successfully",users,
              });
              
            } else {
              res.json({
                status: 404,
                message: "not find data",
              });
            }
          }
        });
      } catch (err) {
        res.json({
          status: 404,
          message: " Data Not Found",
        });
    }
}

