import patientsModel from '../models/speciality.js';
import { v2 as cloudinary } from 'cloudinary';

const especialityController = {};

//Select
patientsController.getEspeciality = async (req, res) => {
    try {
        const patients = await patientsModel.find();
        res.status(200).json(patients);
    }catch(error){
        res.status(500).json({message:"Error al obtener los especialidad"});
    }
};

//Insert con cloudinary
patientsController.insertEspeciality = async (req, res) => {
       try {
            const { especialityname, description} = req.body;
            const newPatient = new patientsModel({
                especialityname,
                description
            });
            await newPatient.save();
            res.status(200).json({message: "especialidad Guardado"});
       }catch(error){
         res.status(500).json({message:"Error al guardar los especialidad"});
       }    
};

//Update con cloudinary
patientsController.updateEspeciality = async (req, res) => {
       try {
            const { especialityname, description} = req.body;
            const patient = await patientsModel.findById(req.params.id);
            const updatedData = {especialityname,description};
            await patientsModel.findByIdAndUpdate(req.params.id,updatedData,{new: true});
            res.status(200).json({message: "Especialidad Actualizado"});
       }catch(error){
         res.status(500).json({message:"Error al Actualizar los especialidad"});
       }    
};

//Eliminar con cloudinary
patientsController.deleteEspeciality = async (req, res) => {
       try {
        const patient = await patientsModel.findById(req.params.id);
        if(patient.public_id){
            await cloudinary.uploader.destroy(patient.public_id);
        }
        await patientsModel.findByIdAndDelete(req.params.id);
        res.status(200).json({message:"especialidad Eliminado"});
       }catch(error){
         res.status(500).json({message:"Error al Eliminar especialidad"});
       }    
};

export default especialityController;