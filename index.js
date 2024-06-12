import express from "express";
import { PORT, mongo } from "./config.js";
import session from "express-session";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";
import AsistenteAdministrativoRoutes from "./routes/AsistenteAdministrativoRoutes.js";
import ProfesorGuiaCoordinadorRoutes from "./routes/ProfesorGuiaCoordinadorRoutes.js";
import cors from "cors";
import { NotificationCenter, Student } from './src/observer.js'

const notificationCenter = new NotificationCenter();
const student1 = new Student('Estudiante 1');
const student2 = new Student('Estudiante 2');
notificationCenter.addObserver(student1);
notificationCenter.addObserver(student2);
global.NotificationCenter = notificationCenter

const app = express();

app.use(express.json({limit: '16mb'}))

app.use(express.json());

//Middleware for handling CORS Policy
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  // Permitir solicitudes OPTIONS para todos los métodos
  if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
  }
  next();
});


app.get("/", (request, response) => {
  console.log(request);
  return response.status(234).send("AAAAAAAAA");
});

app.use("/users", userRoutes);
app.use("/AsistenteAdministrativo", AsistenteAdministrativoRoutes);
app.use("/ProfesorGuiaCoordinador", ProfesorGuiaCoordinadorRoutes);

mongoose
  .connect(mongo)
  .then(() => {
    console.log("App connected to the database");
    app.listen(PORT, () => {
      console.log(`App listening in port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
