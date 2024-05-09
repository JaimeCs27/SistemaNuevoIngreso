import mongoose from "mongoose";


const consecutiveSchema = mongoose.Schema(
  {
    sanjose: {
      type: Number,
      required: true,
      default: 0
    },
    cartago: {
      type: Number,
      required: true,
      default: 0
    },
    alajuela: {
      type: Number,
      required: true,
      default: 0
    },
    limon: {
      type: Number,
      required: false,
      default: 0
    },
    sancarlos: {
      type: Number,
      required: true,
      default: 0
    },
  },
  {
    timestamps: true,
  }
);

export const consecutive = mongoose.model("consecutive", consecutiveSchema);
