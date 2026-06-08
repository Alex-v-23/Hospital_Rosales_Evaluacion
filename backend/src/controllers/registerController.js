import nodemailer from "nodemailer";
import crypto from "crypto";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcryptjs";
import patientsModel from "../models/patients.js";
import { config } from "../../config.js";

const registerController = {};

// registro- Enviar codigo por email
registerController.register = async (req, res) =>{
    try{
        const {name, lastName, birthdate, email, password, phone} = req.body;
        //verifica si ya existe
        const existsPatient = await patientsModel.findOne({email});
        if(existsPatient){
            return res.status(400).json({message:"El paciente ya existe"})
        }
        //Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password,10);
        //Generar codigo aleatorio
        const verificationCode = crypto.randomBytes(3).toString("hex");
        //Guardar datos en token
        const token = jsonwebtoken.sign(
            {name,lastName,birthdate,email,password: hashedPassword,phone,verificationCode},
            config.JWT.secret,
            {expiresIn: "15m"}
        );
        res.cookie ("registerCookie",token,{maxAge: 15 * 60 * 1000});
        //Configurar email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth:{
                user: config.email.user_email,
                pass: config.email.user_password
            }
        });

        const mailOptions ={
            from: config.email.user_email,
            to: email,
            subjet: "Verifica tu cuenta",
            html:`<h1>Bienvenido al hospital rosales</h1>
            <p>Tu codigo de verificacion es: <strong>${verificationCode}</strong></p>
            <p>Este codigo expira en 15 minutos</p>`
        };
        await transporter.sendMail(mailOptions);
        return res.status(200).json({message:"Codigo enviado al correo"});
    }catch(error){
        console.log(error)
        return res.status(500).json({message:"Error en el registro"});
    }
};

//verifica codigo
registerController.verifyCode = async (req, res) =>{
    try{
        const {code} = req.body;
        const token = req.cookies.registerCookie;
        if(!token){
            return res.status(400).json({message:"No hay registro en proceso"})
        }
        const decoded = jsonwebtoken.verify(token,config.JWT.secret);
        if(code !== decoded.verificationCode){
            return res.status(400).json({message:"Codigo incorrecto"});
        }
        //Guardar en la base de datos
        const newPatient = new patientsModel({
            name:decoded.name,
            lastName:decoded.lastName,
            birthdate:decoded.birthdate,
            email: decoded.email,
            password:decoded.password,
            phone:decoded.phone,
            isVerified:true
        });
        await newPatient.save();
        res.clearCookie("registerCookie");
        return res.status(200).json({message:"Paciente registrado exitosamente"})
    }catch(error){
        console.log(error);
        return res.status(500).json({message:""})
    }
};

export default registerController;