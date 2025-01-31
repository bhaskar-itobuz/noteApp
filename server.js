import express from "express";
import routes from '../backend/routes/userRoute.js'
import routeNote from "./routes/noteRoute.js";
import dotenv from 'dotenv/config'
import {dbConnection} from '../backend/config/dbConnection.js'

const app = express();
const port = process.env.port; 

app.use(express.json())
app.use("/note", routes)
app.use("/noteop",routeNote)

app.listen(port, () => {
  console.log(`Server running at port ${port}`)
})

dbConnection()