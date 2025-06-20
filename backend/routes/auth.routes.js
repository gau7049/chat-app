import express from "express"
import { login, signUp, logout, validateEmail } from "../controller/auth.controllers.js"

const router = express.Router()

router.post("/login", login)
router.post("/signup", signUp)
router.post("/logout", logout)
router.post("/validate-email", validateEmail)

export default router