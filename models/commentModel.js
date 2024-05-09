import mongoose from "mongoose";
import { response } from "../models/responseModel.js";

const commentSchema = mongoose.Schema(
  {
    comentario: {
      type: String,
      required: true,
    },
    profesorEmisor: {
      type: String,
      required: true,
    },
    fecha: {
      type: Date,
      required: true,
    },
    respuestas:[
      {
        respuesta:  {
           type: mongoose.Schema.Types.ObjectId,
           ref: response
         },
      }
    ] 
  },
  {
    timestamps: true,
  }
);

export const comment = mongoose.model("comments", commentSchema);