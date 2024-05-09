import mongoose from "mongoose";

const teamSchema = mongoose.Schema({
  profesor: {
    campus: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
});

export const team = mongoose.model("teamAdmin", teamSchema);
