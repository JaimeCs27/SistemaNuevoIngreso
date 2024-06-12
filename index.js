import express from "express";
import { PORT, mongo } from "./config.js";
import session from "express-session";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";
import AsistenteAdministrativoRoutes from "./routes/AsistenteAdministrativoRoutes.js";
import ProfesorGuiaCoordinadorRoutes from "./routes/ProfesorGuiaCoordinadorRoutes.js";
import cors from "cors";

const app = express();

app.use(express.json({limit: '16mb'}))

app.use(express.json());

//Middleware for handling CORS Policy
app.use(cors());


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
