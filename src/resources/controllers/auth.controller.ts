import { NextFunction, Router, Request, Response } from "express";
import AuthService from "../services/auth.service";
import authenticatedMiddleware from "../../middleware/auth.middleware";
import HttpException from "../../utils/exceptions/http.exception";
import { logError, logInfo } from "../../utils/logger/logger";
import Controller from "../interfaces/controller.interface";
import validationMiddleware from "../../middleware/validation.middleware";
import { ReqCreateUserDto } from "../dtos/req.create_user.dto";
import { ReqLoginUserDto } from "../dtos/req.login_user.dto";

class AuthController implements Controller {

    public path = '/auth';
    public router = Router();
    public authService: AuthService
    public logContext: string = 'AUTH CONTROLLER'

    constructor() {
        this.initRoutes();
        this.authService = new AuthService()
    }

    public initRoutes() {
        this.router.post(`${this.path}/register`, validationMiddleware(ReqCreateUserDto, "body"), this.register)
        this.router.post(`${this.path}/login`,this.loginUser)

        this.router.get(`${this.path}/user`, authenticatedMiddleware, this.getUser);
    }

    private register = async(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            logInfo('register() - incoming request', this.logContext, req.body)
            const userData: ReqCreateUserDto = req.body;
            const userResponse: any = await this.authService.register(userData);
            res.status(200).json({
                success: true,
                body: userResponse
            })
        } catch (error) {
            logError(" ", this.logContext, error)
            next(new HttpException(400, error.message));
        }
    }

    private loginUser = async(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            logInfo('loginUser() - incoming request', this.logContext, req.body)
            const userData: ReqLoginUserDto = req.body;
            let userResponse = await this.authService.login(userData);
            res.status(200).json({
                success: true,
                body: userResponse
            })
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    }

    private getUser = (
        req: Request,
        res: Response,
        next: NextFunction
      ): Response | void => {
        if (!req?.user) {
          return next(new HttpException(401, "Unauthorized"));
        }
        const { email } = req.user;
        res.status(200).json({ user: { email } });
      };



    
}

export default AuthController