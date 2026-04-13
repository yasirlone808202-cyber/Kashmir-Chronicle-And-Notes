import { Router, type IRouter } from "express";
import healthRouter from "./health";
import paymentRequestsRouter from "./payment-requests";

const router: IRouter = Router();

router.use(healthRouter);
router.use(paymentRequestsRouter);

export default router;
