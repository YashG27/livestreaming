import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";

export const sessionRouter = Router();

sessionRouter.get('/getToken',authMiddleware, async (req, res) => {

})

sessionRouter.post('createSession', authMiddleware, async (req, res) => {

}) 