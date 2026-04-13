import { Router, type IRouter } from "express";
import healthRouter from "./health";
import paymentRequestsRouter from "./payment-requests";
import uploadRouter from "./upload";

const router: IRouter = Router();

router.use(healthRouter);
router.use(paymentRequestsRouter);
router.use(uploadRouter);

export default router;
