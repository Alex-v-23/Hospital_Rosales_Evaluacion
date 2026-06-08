import {Schema, model} from 'mongoose';
const patientSchema = new Schema({
    name: {type: String},
    lastname: {type: String},
    birthdate: {type: Date},
    email: {type: String, required: true},
    password: {type: String, required: true},
    phone: {type: String},
    isVerified: {type: Boolean, default: false},
    loginAttempts: {type: Number, default: 0},
    timeOut: {type: Date},
    image: {type: String},
    public_id: {type: String}

},{timestamps: true});
export default model("Patient", patientSchema);