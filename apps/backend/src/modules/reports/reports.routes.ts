import { Router } from "express"
import { authMiddleware } from "../../middlewares/auth"
import * as reportsController from "./reports.controller"

const router = Router({ mergeParams: true })

router.use(authMiddleware)

router.post("/", reportsController.createReport)
router.get("/", reportsController.getReport)

export default router
