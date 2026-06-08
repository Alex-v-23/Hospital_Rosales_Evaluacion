import patientsModel from '../models/patients.js';
import { v2 as cloudinary } from 'cloudinary';

const patientsController = {};

//Select
patientsController.getPatients = async (req, res) => {
    try {
        const patients = await patientsModel.find();
        res.status(200).json(patients);
    }catch(error){
        res.status(500).json({message:"Error al obtener los pacientes"});
    }
};

//Insert con cloudinary
patientsController.insertPatient = async (req, res) => {
       try {
            const { name, lastName, birthdate, email, password, phone} = req.body;
            const newPatient = new patientsModel({
                name,
                lastName,
                birthdate,
                email,
                password,
                phone,
                image: req.file ? req.file.path: null,
                public_id: req.file ? req.filename: null
            });
            await newPatient.save();
            res.status(200).json({message: "Paciente Guardado"});
       }catch(error){
         res.status(500).json({message:"Error al guardar los pacientes"});
       }    
};

//Update con cloudinary
patientsController.updatePatient = async (req, res) => {
       try {
            const { name, lastName, birthdate, email, phone} = req.body;
            const patient = await patientsModel.findById(req.params.id);
            const updatedData = {name,lastName, birthdate, email, phone};
            if(req.file){
                if(patient.public_id){
                    await cloudinary.uploader.destroy(patient.public_id);
                }
                updatedData.image = req.file.path;
                updatedData.public_id = req.file.filename;
            }
            await patientsModel.findByIdAndUpdate(req.params.id,updatedData,{new: true});
            res.status(200).json({message: "Paciente Actualizado"});
       }catch(error){
         res.status(500).json({message:"Error al Actualizar los pacientes"});
       }    
};

//Eliminar con cloudinary
patientsController.deletePatient = async (req, res) => {
       try {
        const patient = await patientsModel.findById(req.params.id);
        if(patient.public_id){
            await cloudinary.uploader.destroy(patient.public_id);
        }
        await patientsModel.findByIdAndDelete(req.params.id);
        res.status(200).json({message:"Paciente Eliminado"});
       }catch(error){
         res.status(500).json({message:"Error al Eliminar los pacientes"});
       }    
};

export default patientsController;