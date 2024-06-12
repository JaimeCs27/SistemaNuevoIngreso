// main.js

import { ActivityClass, PublishVisitor, ReminderVisitor } from './visitorPrueba.js';
import { NotificationCenter, Student } from './observer.js'

// Instanciar el centro de notificaciones
const notificationCenter = new NotificationCenter();

// Crear estudiantes y añadirlos como observadores
const student1 = new Student('Estudiante 1');
const student2 = new Student('Estudiante 2');
notificationCenter.addObserver(student1);
notificationCenter.addObserver(student2);

// Asignar el centro de notificaciones a los visitantes
global.NotificationCenter = notificationCenter; // Hacer disponible el centro de notificaciones globalmente

// Crear actividad
const activityData = {
    _id: '6645d467c831d75fff379134',
    nombre: 'Orientacion: Nuevos Ingresos',
    estado: 'Planeada',
    semana: '1',
    tipo: 'Motivacion',
    afiche: '',
    fecha: '2025-02-01T00:00:00.000Z',
    hora: '08:00',
    modalidad: 'Presencial',
    enlaceReunion: '',
    responsables: [],
    recordatorios: [],
    evidencias: [],
    comentarios: [],
    createdAt: '2024-05-16T09:39:51.542Z',
    updatedAt: '2024-05-20T19:43:18.350Z'
};

const activity = new ActivityClass(activityData);

// Crear visitantes con la fecha del sistema actual
const systemDate = new Date('2025-01-31T00:00:00.000Z'); // Un día antes de la fecha de la actividad
const publishVisitor = new PublishVisitor(systemDate);
const reminderVisitor = new ReminderVisitor(systemDate);

// Aceptar visitantes
activity.accept(publishVisitor);
activity.accept(reminderVisitor);
