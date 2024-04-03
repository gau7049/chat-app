import express from "express"
import { login, signUp, logout } from "../controller/auth.controllers.js"

const router = express.Router()

router.post("/login", login)
router.post("/signup", signUp)
router.post("/logout", logout)

export default router