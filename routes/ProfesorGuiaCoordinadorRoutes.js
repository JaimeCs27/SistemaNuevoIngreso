import express from "express";
import ExcelJS from 'exceljs';
import { user } from "../models/userModel.js";
import { team } from "../models/teamModel.js";
import { consecutive } from "../models/consecutiveModel.js";
import { student } from "../models/studentModel.js";
const router = express.Router();
import { Activity } from "../models/activityModel.js";

router.post('/CrearActividad', async (req,response) => {
    try{
        const newActivity = {
            nombre: req.body.nombre,
            estado: req.body.estado,
            semana: req.body.semana,
            tipo: req.body.tipo,
            afiche: req.body.afiche,
            fechaPublicacion: req.body.fechaPublicacion,
            fecha: req.body.fecha,
            hora: req.body.hora,
            modalidad: req.body.modalidad,
            enlaceReunion: req.body.enlaceReunion,
            responsables: req.body.responsables,
            recordatorios: req.body.recordatorios,
            evidencias: req.body.evidencias,
            comentarios: req.body.comentarios,
        };

        const activity = await Activity.create(newActivity);

        return response.status(201).send(activity);

    } catch (error){
        console.log(error.message);
        response.status(500).send({message: error.message});
    }

})

router.post('/ResponderComentario/:id', async (req, res)=> {
    const profe = req.body.user
    const id = req.params.id
    const fecha = req.body.date
    const comment = req.body.idComentario
    const respuesta = req.body.respuesta

    const resp = {
        respuesta: respuesta,
        profesor: `${profe.name} ${profe.lastName} ${profe.secondLastName}`,
        fecha: fecha
    }

    try {
        const result = await Activity.findOneAndUpdate(
            { _id: id, "comentarios._id": comment },
            { 
                $push: { "comentarios.$.respuestas": resp }
            },
            { new: true }
        );
        console.log(result);
        res.send(result.comentarios);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error actualizando el comentario.");
    }
})


router.get('/ListaActividades', async (req, res) =>{
    try {
        const result = await Activity.find({})
        res.send(result)
    } catch (error) {
        
    }
})

router.post('/ComentarActividad/:id', async (req, res)=>{
    const id = req.params.id
    console.log('user')
    console.log(req.body.user)

    const comment = {
        comentario : req.body.comment,
        profesor: `${req.body.user.name} ${req.body.user.lastName} ${req.body.user.secondLastName}`,
        fecha: req.body.date,
        respuestas : []
    }
    console.log('comentario: ')
    console.log(comment)
    try{
        const activity = await Activity.findByIdAndUpdate(
            id,
            { $push: { comentarios: comment } },
            { new: true }  // Esto asegura que se devuelva el documento actualizado
        );

        console.log('actividad con el comentario: ')
        console.log(activity)
        res.send(activity.comentarios)
    } catch (error) {
        
    }
})

router.post('/ModificarActividad/:id', async (req,response) => {
    const id = req.params.id
    try{
        if(req.body.estadoA === "Cancelada"){
            await Activity.findByIdAndUpdate(id,{
                $set: {fechaCancelacion: new Date()}
            })
        }
        const result = await Activity.findByIdAndUpdate(id,{
            $set: {
                nombre: req.body.nombreActividad,
                estado: req.body.estadoA,
                justificacion: req.body.justificacion,
                semana: req.body.semana,
                tipo: req.body.tipo,
                afiche: req.body.afiche,
                fecha: req.body.fecha,
                hora: req.body.hora,
                modalidad: req.body.modalidad,
                responsables: req.body.responsables,
                recordatorios: req.body.recordatorios,
                evidencias: req.body.evidencias,
            }
        }, {new: true});
        response.send(result)
    } catch (error){
        console.log(error.message);
        response.status(500).send({message: error.message});
    }

})


router.get("/ListaProfesores", async (req, res) => {
    const users = await user.find({
      isAdministrative: false,
    });
    res.json(users);
  });

router.get("/ListaProfesores/:Profesor", async (req, res) => {
    const nombre = req.params.Profesor;
    const regex = new RegExp(nombre, "i"); // "i" para case insensitive
    const profes = await user.find({ name: regex, isAdministrative: false,});
    res.json(profes);
  });

  router.post('/RecuperarProfesor', async (req,res) => {
    const id = req.body.selection
    try {
        const result = await user.findById(id)
        res.send(result)
    } catch (error) {
        console.log(error)
    }
  })

router.get('/generarInformeCampus/:Campus', async (req, res) => {
    try {
        const nombreCampus = req.params.Campus;
        const students = await student.find({ campus: nombreCampus}).sort('campus');
        const workbook = new ExcelJS.Workbook();

        const worksheet = workbook.addWorksheet(nombreCampus);

        worksheet.columns = [
            { header: 'Carne', key: 'carne', width: 10 },
            { header: 'Primer Nombre', key: 'name', width: 15 },
            { header: 'Segundo Nombre', key: 'secondName', width: 15 },
            { header: 'Primer Apellido', key: 'lastName', width: 15 },
            { header: 'Segundo Apellido', key: 'secondLastName', width: 15 },
            { header: 'Email', key: 'email', width: 25 },
            { header: 'Numero de Telefono', key: 'phoneNumber', width: 25 },
            { header: 'Campus', key: 'campus', width: 15 },
        ];

        worksheet.getRow(1).font = { bold: true };

        students.forEach(student => {
            worksheet.addRow([student.carne, student.name, student.secondName, student.lastName, student.secondLastName, student.email, 
                student.phoneNumber, student.campus]);
        });

        const buffer = await workbook.xlsx.writeBuffer();
        res.setHeader('Content-Type', 'appplication/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8');
        res.setHeader('Content-Disposition', 'attachment; filename="informeEstudiantes.xlsx"');
        res.send(buffer);


    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to generate Excel file');
        
    }
});

router.get('/generarInformeAllCampus', async (req, res) => {
    try {
        const students = await student.find({}).sort('campus');

        const campusGroups = students.reduce((acc, student) => {
            if (!acc[student.campus]) {
                acc[student.campus] = [];
            }
            acc[student.campus].push(student);
            return acc;
        }, {});

        const workbook = new ExcelJS.Workbook();

        for (let campus in campusGroups) {
            const worksheet = workbook.addWorksheet(campus); 

            worksheet.columns = [
                { header: 'Carne', key: 'carne', width: 10 },
                { header: 'Primer Nombre', key: 'name', width: 15 },
                { header: 'Segundo Nombre', key: 'secondName', width: 15 },
                { header: 'Primer Apellido', key: 'lastName', width: 15 },
                { header: 'Segundo Apellido', key: 'secondLastName', width: 15 },
                { header: 'Email', key: 'email', width: 25 },
                { header: 'Numero de Telefono', key: 'phoneNumber', width: 25 },
                { header: 'Campus', key: 'campus', width: 15 },
            ];

            worksheet.getRow(1).font = { bold: true };

            campusGroups[campus].forEach(student => {
                worksheet.addRow({
                    carne: student.carne,
                    name: student.name,
                    secondName: student.secondName,
                    lastName: student.lastName,
                    secondLastName: student.secondLastName,
                    email: student.email,
                    phoneNumber: student.phoneNumber,
                    campus: student.campus
                });
            });
        }

        const buffer = await workbook.xlsx.writeBuffer();
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8');
        res.setHeader('Content-Disposition', 'attachment; filename="informeEstudiantes.xlsx"');
        res.send(buffer);
    } catch (error) {
        console.error('Failed to generate Excel file:', error);
        res.status(500).send('Failed to generate Excel file');
    }
});

  router.get(`/Actividad/:id`, async (req,res) => {
    const id = req.params.id
    try {
        const result = await Activity.findById(id)
        res.send(result)
    } catch (error) {
        console.log(error) 
    }
  })
  
router.post('/Responsables',async (req, res)=>{
    const list = req.body.listId
    let result = []
    for (let element of list.list) {
        const aux = await user.findById(element._id)
        result.push(aux)   
    }
    res.send(result)
})

router.get('/Responsables/:id', async (req,res) =>{
    const id = req.params.id
    try {
        const result = await Activity.findById(id)
        res.send(result.responsables)
    } catch (error) {
        console.log(error) 

}})


export default router;
