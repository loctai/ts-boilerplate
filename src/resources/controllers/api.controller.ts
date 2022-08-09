import { NextFunction, Router, Request, Response } from "express";
import HttpException from "../../utils/exceptions/http.exception";
import { logInfo } from "../../utils/logger/logger";
import Controller from "../interfaces/controller.interface";

class ApiController implements Controller {
    public path = '/';
    public router = Router();
    public logContext: string = 'API CONTROLLER'
    constructor() {
        this.initRoutes();
    }
    public initRoutes() {

        this.router.get(`${this.path}`, this.welcome);

    }
    private welcome = async(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            logInfo('welcome() - welcome request', this.logContext, req.body)
            res.status(200).send({
                success: true,
                message: 'Welcome'
            })
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    }
}

export default ApiController;