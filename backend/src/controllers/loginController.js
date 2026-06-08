import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import patientsModel from "../models/patients.js";
import { config } from "../../config.js";

const loginController = {};

loginController.login = async (req, res) =>{
    try{
        const{email,password}= req.body;
        //Buscar pasciente
        const patient = await patientsModel.findOne({email});
        if(!patient){
            return res.status(400).json({messge:"Paciente no encontrado"});
        }
        //verificar bloqueo
        if(patient.timeOut && patient.timeOut > Date.now()){
            return res.status(403).json({message:"Cuenta bloqueada por intentos fallidos"});
        }
        //verifica contraseña
        const isValid = await bcrypt.compare(password,patient.password);
        if(!isValid){
            if(patient.loginAttemps >= 5){
                patient.timeOut = Date.now()+ 5 * 60 * 1000;
                patient.loginAttemps= 0;
                await patient.save();
                return res.status (403).json({message:"Cuenta bloqueada por 5 minutos"})
            }
            await patient.save();
            return res.status(401).json({message:"Contraseña incorrecta"})
        }
        //Resetear intentos
        patient.loginAttemps = 0;
        patient.timeOut = null;
        await patient.save();

        //generar token
        const token = jsonwebtoken.sign(
            {id: patient._id, email: patient.email,type:"patient"},
            config.JWT.secret,
            {expiresIn:"7d"}
        );
        res.cookie("authCookie",token);
        return res.status(200).json({message:"Login exitoso",token})

    }catch(error){
        console.log (error);
        return res.status().json({message:"Error en login"});
    }
};

export default loginController;