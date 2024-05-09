import express from "express";
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
        const result = await Activity.findByIdAndUpdate(id,{
            $set: {
                nombre: req.body.nombreActividad,
                estado: req.body.estado,
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