// visitor.js
import { Activity } from "../models/activityModel.js";


class ActivityClass {
    constructor(data) {
        this._id = data._id;
        this.nombre = data.nombre;
        this.estado = data.estado;
        this.semana = data.semana;
        this.tipo = data.tipo;
        this.afiche = data.afiche;
        this.fechaPublicacion = data.fechaPublicacion
        this.fecha = new Date(data.fecha);
        this.hora = data.hora;
        this.recordatorios = data.recordatorios;

    }

    accept(visitor) {
        visitor.visit(this);
    }
}

class PublishVisitor {
    constructor(systemDate) {
        this.systemDate = systemDate;
    }

    async visit(activity) {
        console.log("publish")
        console.log(activity.nombre)
        const published = new Date(activity.fechaPublicacion)
        console.log(published)
        console.log(this.systemDate)
        console.log(this.systemDate >= published && activity.estado !== 'Publicada')
        // Lógica para determinar si la actividad debe publicarse
        if (this.systemDate >= published && activity.estado !== 'Publicada') {
            
            const result = await Activity.findOneAndUpdate({_id: activity._id}, {
                $set : {estado: "Notificada"}
            },{ new : true})
            console.log(`Actividad ${result.nombre} ha sido publicada.`);
            // Llamar al centro de notificaciones
            NotificationCenter.notifyObservers(result, 'publicacion', this.systemDate);
        }
    }
}

class ReminderVisitor {
    constructor(systemDate) {
        this.systemDate = systemDate;
    }

    visit(activity) {
        console.log("reminder")
        // Lógica para determinar si se debe generar un recordatorio
        console.log(activity.nombre)
        const reminderDate = new Date(activity.fechaPublicacion);
        reminderDate.setDate(reminderDate.getDate() - 1); // Un día antes de la fecha de la actividad
        if (this.systemDate >= reminderDate) {
            // Llamar al centro de notificaciones
            activity.recordatorios.map((rec)=>{
                
                const dateRec = new Date(rec)
                console.log(dateRec)
                console.log(this.systemDate)
                if(dateRec.getTime() === this.systemDate.getTime())
                    NotificationCenter.notifyObservers(activity, 'recordatorio', this.systemDate);

            })
        }
    }
}

// Exportar las clases
export { ActivityClass, PublishVisitor, ReminderVisitor };
