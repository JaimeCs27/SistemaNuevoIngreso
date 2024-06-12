// visitor.js
import { Activity } from "../models/activityModel.js";
import { NotificationCenter } from "./observer.js";

class ActivityClass {
    constructor(data) {
        this._id = data._id;
        this.nombre = data.nombre;
        this.estado = data.estado;
        this.semana = data.semana;
        this.tipo = data.tipo;
        this.afiche = data.afiche;
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
        // Lógica para determinar si la actividad debe publicarse
        if (this.systemDate >= activity.fecha && activity.estado !== 'Publicada') {
            const result = await Activity.findOneAndUpdate({_id: activity._id}, {
                $set : {estado: "Notificada"}
            },{ new : true})

            console.log(`Actividad ${result.nombre} ha sido publicada.`);
            // Llamar al centro de notificaciones
            NotificationCenter.notifyObservers(result, 'publicacion');
        }
    }
}

class ReminderVisitor {
    constructor(systemDate) {
        this.systemDate = systemDate;
    }

    visit(activity) {
        // Lógica para determinar si se debe generar un recordatorio
        const reminderDate = new Date(activity.fecha);
        reminderDate.setDate(reminderDate.getDate() - 1); // Un día antes de la fecha de la actividad
        if (this.systemDate >= reminderDate) {
            // Llamar al centro de notificaciones
            activity.recordatorios.map((rec)=>{
                const dateRec = new Date(rec)
                if(dateRec === this.systemDate)
                    NotificationCenter.notifyObservers(activity, 'recordatorio');

            })
        }
    }
}

// Exportar las clases
export { ActivityClass, PublishVisitor, ReminderVisitor };
