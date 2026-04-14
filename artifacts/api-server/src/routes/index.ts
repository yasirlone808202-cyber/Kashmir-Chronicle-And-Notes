import { Router, type IRouter } from "express";
import healthRouter from "./health";
import paymentRequestsRouter from "./payment-requests";
import uploadRouter from "./upload";
import authRouter from "./auth";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(paymentRequestsRouter);
router.use(uploadRouter);

export default router;
