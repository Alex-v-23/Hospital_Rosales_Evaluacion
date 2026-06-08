import crypto from "crypto";
import nodemailer from "nodemailer";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";
import patientsModel from "../models/patients.js";
import { config } from "../../config.js";

const recoveryController = {};

//solicitar codigo de recuperacion
recoveryController.requestCode = async (req, res) =>{
    try{
        const {email} = req.body;
        const patient = await patientsModel.findOne({email});
        if(!patient){
            return res.status(404).json({message:"Paciente no encontrado"})
        }
        const code = crypto.randomBytes(3).toString("hex");
        const token = jsonwebtoken.sign(
            {email,code,verified: false},
            config.JWT.secret,
            {expiresIn:"15m"}
        );
        res.cookie("recoveryCookie",token,{maxAge:15 * 60 * 1000});

        //enviar por email
        const transporter = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:config.email.user_email,
                pass:config.email.user_password
            }
        });
        const mailOptions ={
            from:config.email.user_email,
            to:email,
            subject:"Recuperacion de contraseña",
            html: `<h1>Recupera tu contraseña</h1>
            <p>Tu codigo de recuperacion es:<strong>${code}</strong></p>
            <p>Expira en 15 minutos</p>`
        };
        await transporter.sendMail(mailOptions);
        return res.status(200).json({message:"Codigo enviado"})
    }catch(error){
        console.log(error);
        return res.status(500).json({message:"Error al enviar codigo"});
    }
};

//verificar codigo
recoveryController.verifyCode = async (req, res) =>{
    try{
        const{code}= req.body;
        const token = req.cookies.recoveryCookie;
        const decoded = jsonwebtoken.verify(token,config.JWT.secret);
        if(code!== decoded.code){
            return res.status(400).json({message:"Codigo incorrecto"});
        }
        const newToken = jsonwebtoken.sign(
            {email:decoded.email,verified:true},
            config.JWT.secret,
            {expiresIn:"15m"}
        );
        res.cookie("recoveryCookie",newToken);
        return res.status(200).json({message:"Codigo verificado"}); 
    }catch(error){
        console.log(error)
        return res.status(500).json({messge:"Error al verificar"});
    }
};

//nueva contraseña
recoveryController.newPassword = async (req, res) =>{
    try{
        const{newPassword,confirmPassword}= req.body;
        if(newPassword !== confirmPassword){
            return res.status(400).json({message:"Las contraseñas no coinciden"});
        }
        const token = req.cookies.recoveryCookie;
        const decoded = jsonwebtoken.verify(token,config.JWT.secret);
        if(!decoded.verified){
            return res.status(400).json({message:"Codigo no verificado"})
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await patientsModel.findOneAndUpdate(
            {email:decoded.email},
            {password:hashedPassword}
        );
        res.clearCookie("recoveryCookie");
        return res.status(200).json({message:"Contraseña actualizada."})
    }catch(error){
        console.log(error)
        return res.status(500).json({message:"Error al Actualizar contraseña"})
    }
};

export default recoveryController;