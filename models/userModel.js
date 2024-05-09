import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    secondName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: true,
    },
    secondLastName: {
      type: String,
      required: true,
    },
    officePhone: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    campus: {
      type: String,
      required: true,
    },
    isAdministrative: {
      type: Boolean,
      require: true,
    },
    teacherID: {
      type: String,
      require: false,
    },
    profilePic: {
      type: String,
      require: true,
    },
    isCoord: {
      type: Boolean,
      require: false,
    },
  },
  {
    timestamps: true,
  }
);

export const user = mongoose.model("users", userSchema);
