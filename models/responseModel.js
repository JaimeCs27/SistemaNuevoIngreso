import mongoose from "mongoose";

const responseSchema = mongoose.Schema(
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
  },
  {
    timestamps: true,
  }
);

export const response = mongoose.model("responses", responseSchema);