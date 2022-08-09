import HttpException from '../utils/exceptions/http.exception';
import token from '../utils/token';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../resources/models/user.model';
import { logInfo } from '../utils/logger/logger';


async function authenticatedMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<Response | void> {
    const bearer = req.headers.authorization;
    if (!bearer || !bearer.startsWith('Bearer ')) {
        return next(new HttpException(401, 'Unauthorised'));
    }
    const accessToken = bearer.split('Bearer ')[1].trim();
    logInfo('accesToken', 'auth', accessToken)
    try {
        const payload = await token.verifyToken(
            accessToken
        );

        if (payload instanceof jwt.JsonWebTokenError) {
            return next(new HttpException(401, 'Unauthorised'));
        }


        const user = await UserModel.findById(payload.id)
            .select("-password")
            .exec();
    
        logInfo('user from auth middleware', 'AUTH MIDDLEWARE', user)
        if (!user) {
            return next(new HttpException(401, 'Unauthorised'));
        }

        req.user = user

        return next();
    } catch (error) {
        return next(new HttpException(401, 'Unauthorised'));
    }
}

export default authenticatedMiddleware;
