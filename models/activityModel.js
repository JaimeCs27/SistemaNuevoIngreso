import mongoose from "mongoose";
import {user} from '../models/userModel.js'


const activitySchema = mongoose.Schema(
  { 
    nombre: {
        type: String,
        required: true,
    },
    estado: {
        type: String,
        required: true,
    },
    semana: {
      type: String,
      required: true,
    },
    tipo: {
      type: String,
      required: true,
    },
    afiche: {
        type: String,
        required: false,
    },
    fechaPublicacion: {
      type: Date,
      required: false,
    },
    fecha: {
      type: Date,
      required: false,
    },
    hora: {
      type: String,
      required: true,
    },
    modalidad: {
      type: String,
      required: true,
    },
    enlaceReunion: {
      type: String,
      required: false,
    },
    responsables: [
      {
        profesor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: user
        },
      }
    ],
    recordatorios: {
      type: [Date],
      required: false,
    },
    evidencias: {
      type: [String],
      require: false,
    },
    comentarios : [
      {
        comentario: {
          type: String,
          required: true
        },
        profesor: {
            type: String,
            required: true
        },
        fecha: {
          type: Date,
          required: true
        },
        respuestas: [
          {
            respuesta: {
              type: String,
            },
            profesor: {
              type: String,
              required: true
            },
            fecha: {
              type: Date,
              required: true
            },
          }
        ]
    }
    ]
  },
  {
    timestamps: true,
  }
);

export const Activity = mongoose.model("activities", activitySchema);