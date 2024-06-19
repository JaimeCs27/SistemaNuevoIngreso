import express from "express";
import { user } from "../models/userModel.js";
import { team } from "../models/teamModel.js";
import { consecutive } from "../models/consecutiveModel.js";
import { student } from "../models/studentModel.js";

const router = express.Router();

router.get("/", (req, res) => {
  return res.status(200);
});

router.get("/ListaEstudiantes/:campus", async (req, res) => {
  const campus = req.params.campus;
  console.log(campus);
  try {
    const result = await student.find({ campus: campus });
    res.send(result);
  } catch (error) {
    console.log(error);
  }
});

router.post("/subirArchivo", (req, res) => {
  const data = req.body.data;
  console.log(data);
  try {
    data.forEach(async (element) => {
      const studentFind = await student.find({ carne: element.Carne });
      if (!studentFind.length) {
        await student.create({
          carne: element.Carne,
          name: element.Nombre,
          secondName: element.SegundoNombre,
          lastName: element.Apellido,
          secondLastName: element.SegundoApellido,
          email: element.Correo,
          phoneNumber: element.Telefono,
          campus: element.Campus,
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/VerDetallesEstudiante/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await student.findById(id);
    if (!result) return res.send({ status: "User Not Found" });
    else res.send(result);
  } catch (error) {
    console.log(error);
  }
});

router.get("/VerDetalles/:id", async (req, res) => {
  const param = req.params.id;
  let profe = {};
  try {
    profe = await user.findById(param);
  } catch (error) {
    console.log(error);
  }

  res.send(profe);
});

router.get("/ListaProfesores", async (req, res) => {
  const users = await user.find({
    campus: req.query.campus,
    isAdministrative: false,
  });
  res.json(users);
});

router.get("/ListaProfesores/:Profesor", async (req, res) => {
  const nombre = req.params.Profesor;
  const regex = new RegExp(nombre, "i"); // "i" para case insensitive
  const profes = await user.find({ name: regex, campus: req.query.campus });
  res.json(profes);
});

router.post("/AsignarRepresentante", async (req, res) => {
  let profe = {
    campus: req.body.campus,
    id: req.body.selection,
    isCoordinator: false,
  };
  let prof = {};
  let stat = "";
  try {
    let result = await team.find({ "profesor.campus": req.body.campus });
    if (!result.length) {
      result = await team.create({ profesor: profe });
      prof = await user.findById(result.profesor.id);
      stat = "Created";
    } else {
      prof = await user.findById(result[0].profesor.id);
      stat = "Not Added";
    }
  } catch (error) {
    console.log(error);
    stat = "Error";
  }
  res.send({ profe: prof, status: stat });
});

router.post("/AsignarCoordinador", async (req, res) => {
  let profe = {};
  try {
    let profs = await team.find({});
    for (let element of profs) {
      let prof = await user.findById(element.profesor.id);
      if (prof.isCoord) {
        prof = await user.findByIdAndUpdate(prof._id, {
          $set: { isCoord: false },
        });
        break;
      }
    }
    profe = await user.findByIdAndUpdate(req.body.coordSelection, {
      $set: { isCoord: true },
    });
  } catch (error) {}
  res.send(profe);
});

router.get("/EquipoTrabajo", async (req, res) => {
  let profs = await team.find({});
  let result = [];
  for (let element of profs) {
    let prof = await user.findById(element.profesor.id); // Busca cada profesor por ID
    if (prof) {
      result.push(prof); // Añade el profesor encontrado al array de resultados
    }
  }
  res.send(result);
});

router.post("/RepresentanteSede", async (req, res) => {
  const prof = await team.find({ "profesor.campus": req.body.campus });
  let result = {};
  if (prof[0]) {
    result = await user.findById(prof[0].profesor.id);
  }
  res.send(result);
});

router.post("/DarDeBaja", async (req, res) => {
  const prof = await team.findOneAndDelete({
    "profesor.campus": req.body.campus,
  });
  if (prof) {
    res.send("Success");
  } else {
    res.send("Not deleted");
  }
});

router.post("/AgregarProfesor", async (req, res) => {
  const listOfConsecutive = await consecutive.find({});
  let number = 0;
  let acronim;
  if (req.body.campus === "Cartago") {
    number = listOfConsecutive[0].cartago;
    await consecutive.findOneAndUpdate(
      {},
      {
        $set: { cartago: number + 1 },
      }
    );
    acronim = "CA-";
  } else if (req.body.campus === "Limon") {
    number = listOfConsecutive[0].limon;
    await consecutive.findOneAndUpdate(
      {},
      {
        $set: { limon: number + 1 },
      }
    );
    acronim = "LI-";
  } else if (req.body.campus === "Alajuela") {
    number = listOfConsecutive[0].alajuela;
    await consecutive.findOneAndUpdate(
      {},
      {
        $set: { alajuela: number + 1 },
      }
    );
    acronim = "AL-";
  } else if (req.body.campus === "San Carlos") {
    number = listOfConsecutive[0].sancarlos;
    await consecutive.findOneAndUpdate(
      {},
      {
        $set: { sancarlos: number + 1 },
      }
    );
    acronim = "SC-";
  } else if (req.body.campus === "San José") {
    number = listOfConsecutive[0].sanjose;
    await consecutive.findOneAndUpdate(
      {},
      {
        $set: { sanjose: number + 1 },
      }
    );
    acronim = "SJ-";
  }

  const newUser = {
    username: req.body.email,
    password: "1234",
    name: req.body.name,
    secondName: req.body.secondName,
    lastName: req.body.lastName,
    secondLastName: req.body.secondLastName,
    officePhone: req.body.officePhone,
    phoneNumber: req.body.phoneNumber,
    campus: req.body.campus,
    isAdministrative: false,
    teacherID: `${acronim}${number}`,
    profilePic: req.body.profilePic,
    isCoord: false,
  };
  try {
    await user.create(newUser);
    res.sendStatus(201);
  } catch (error) {
    res.send({ status: "error" });
  }
});

router.post("/EditarEstudiante/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const result = await student.findByIdAndUpdate(
      id,
      {
        $set: {
          name: req.body.name,
          secondName: req.body.secondName,
          lastName: req.body.lastName,
          secondLastName: req.body.secondLastName,
          username: req.body.email,
          phoneNumber: req.body.phoneNumber,
        },
      },
      { new: true }
    );
    console.log(result);
    res.send(result);
  } catch (error) {
    res.send({ status: "error" });
  }
});

router.post("/EditarProfesor/:Profesor", async (req, res) => {
  const Id = req.params.Profesor;
  try {
    const result = await user.findByIdAndUpdate(
      Id,
      {
        $set: {
          name: req.body.name,
          secondName: req.body.secondName,
          lastName: req.body.lastName,
          secondLastName: req.body.secondLastName,
          username: req.body.email,
          officePhone: req.body.officePhone,
          phoneNumber: req.body.phoneNumber,
          profilePic: req.body.profilePic,
        },
      },
      { new: true }
    );
    console.log(result);
    res.send(result);
  } catch (error) {
    res.send({ status: "error" });
  }
});

export default router;
