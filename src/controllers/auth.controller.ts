import { Response } from "express";
import { asyncWrapper } from "../midddleware/asyncWrapper";
import { IRequest } from "../midddleware/auth.middleware";
import { UserService } from "../services/user.services";

export class AuthController {
  static preRegister = asyncWrapper(async (req: IRequest, res: Response) => {
    const user = req.body;
    const response = await UserService.preRegister(user);
    res.status(200).json({ success: true, payload: response });
  });

  static register = asyncWrapper(async (req: IRequest, res: Response) => {
    const user = req.body;
    const response = await UserService.register(user);
    res.status(201).json({ success: true, payload: response });
  });

  static login = asyncWrapper(async (req: IRequest, res: Response) => {
    const { email, password } = req.body;
    const response = await UserService.login(email, password);
    res.status(200).json({ success: true, payload: response });
  });
}
