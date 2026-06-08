import express from "express";
import patientsController from "../controllers/patientsController.js";
import registerController from "../controllers/registerController.js";
import loginController from "../controllers/loginController.js";
import recoveryController from "../controllers/recoveryController.js";
import upload from "../utils/cloudinaryConfig.js";

const router = express.Router();

//Crud de pacientes
router.route("/")
.get(patientsController.getPatients)
.post(upload.single("image"),patientsController.insertPatient)

router.route("/:id")
.put(upload.single("image"),patientsController.updatePatient)
.delete(patientsController.deletePatient)

//registro con email
router.post("/register",registerController.register)
router.post("/verify-code",registerController.verifyCode)

//login
router.post("/login",loginController.login)

//recuperacion de contraseña
router.post("/recovery-request",recoveryController.requestCode)
router.post("/recovery-verify",recoveryController.verifyCode)
router.post("/recovery-newPass",recoveryController.newPassword)

//logout
router.post ("/logout",(req, res)=>{
    res.clearCookie("authCookie");
    res.json({message:"sesion cerrada"})
});

export default router;