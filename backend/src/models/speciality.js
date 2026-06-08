import {Schema, model} from 'mongoose';
const especialitySchema = new Schema({
    especialtyname: {type: String},
    description: {type: String}, 
    isAvailable: {type: Boolean, default: false},

},{timestamps: true});
export default model("especiality", especialitySchema);