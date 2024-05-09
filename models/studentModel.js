import mongoose from "mongoose";

const studentSchema = mongoose.Schema(
    {
        carne: {
            type: String,
            required: true 
        },
        name: {
            type: String,
            required: true 
        },
        secondName: {
            type: String,
            required: false 
        },
        lastName: {
            type: String,
            required: true 
        },
        secondLastName: {
            type: String,
            required: true 
        },
        email: {
            type: String,
            required: true 
        },
        phoneNumber: {
            type: String,
            required: true 
        },
        campus: {
            type: String,
            required: true 
        },
    },
    {
        timestamps: true,
    }
)

export const student = mongoose.model("students", studentSchema);