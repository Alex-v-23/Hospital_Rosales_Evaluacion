import patientsModel from '../models/medicalAppointments.js';
import { v2 as cloudinary } from 'cloudinary';

const medicalAppointmentsController = {};

//Select
patientsController.getMedicalAppointments = async (req, res) => {
    try {
        const patients = await patientsModel.find();
        res.status(200).json(patients);
    }catch(error){
        res.status(500).json({message:"Error al obtener las citas"});
    }
};

//Insert con cloudinary
patientsController.insertMedicalAppointments = async (req, res) => {
       try {
            const { patient_id,especiality_id,appointmentDate,reason,status,observation} = req.body;
            const newPatient = new patientsModel({
                patient_id,especiality_id,appointmentDate,reason,status,observation
            });
            await newPatient.save();
            res.status(200).json({message: "cita Guardado"});
       }catch(error){
         res.status(500).json({message:"Error al guardar los cita"});
       }    
};

//Update con cloudinary
patientsController.updateMedicalAppointments = async (req, res) => {
       try {
            const { patient_id,especiality_id,appointmentDate,reason,status,observation} = req.body;
            const patient = await patientsModel.findById(req.params.id);
            const updatedData = {patient_id,especiality_id,appointmentDate,reason,status,observation};
            await patientsModel.findByIdAndUpdate(req.params.id,updatedData,{new: true});
            res.status(200).json({message: "cita Actualizado"});
       }catch(error){
         res.status(500).json({message:"Error al Actualizar cita"});
       }    
};

//Eliminar con cloudinary
patientsController.deleteMedicalAppointments = async (req, res) => {
       try {
        const patient = await patientsModel.findById(req.params.id);
        if(patient.public_id){
            await cloudinary.uploader.destroy(patient.public_id);
        }
        await patientsModel.findByIdAndDelete(req.params.id);
        res.status(200).json({message:"cita Eliminado"});
       }catch(error){
         res.status(500).json({message:"Error al Eliminar cita"});
       }    
};

export default especialityController;