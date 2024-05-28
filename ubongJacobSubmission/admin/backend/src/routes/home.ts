import { Request, Response, Router } from "express";
import { APP_NAME } from "../startup/config";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send(`Welcome to ${APP_NAME} home route.`);
});

export { router as homeRouter };
