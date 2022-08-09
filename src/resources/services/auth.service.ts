

import User from "../models/user.model"
import IUser from "../interfaces/user.interface";
import { ReqCreateUserDto } from "../dtos/req.create_user.dto";
import { ReqLoginUserDto } from "../dtos/req.login_user.dto";
import {MailerService} from "./mail.service";
import { AppConfig } from "../../constants/app.config";
import OTPService from "./otp.service";
import { VERIFICATION_TYPES } from "../models/otp.model";
import { logError, logInfo } from "../../utils/logger/logger";
import token from "../../utils/token";
import LoginDto from "../dtos/login.dto";

class AuthService {
    public logContext: string = 'AUTH SERVICE';
    public otpService = new OTPService();
    constructor() { }

    public async register(userData: ReqCreateUserDto): Promise<any> {
        try {
            const user: IUser = await User.create({
                email: userData.email.trim().toLowerCase(),
                password: userData.password,
              });
            let otpData = await this.otpService.createOTP(VERIFICATION_TYPES.EMAIL_VERIFICATION, userData.email.trim().toLowerCase())
            if(!otpData.ok) throw new Error(otpData.msg)
            
            let context = {
              otpCode: otpData.otp
            }
            MailerService.sendMail("tailv@ebizworld.com.vn", AppConfig.EMAIL_SUBJECT.VERIFY_ACCOUNT, 'verify-email', context);
            
            const accessToken = token.createToken(user);

            let userResponse = {
                user: new LoginDto(user),
                token:accessToken
            }

            logInfo('register() - returning userResponse', this.logContext, userResponse)
            return userResponse;
        } catch (e: any) {
            throw new Error(e);
        }
    }
    public async login(userData: ReqLoginUserDto): Promise<any> {
        try {
          const errMessage = "Wrong username or password";
          const user = await User.findOne({ email: userData.email });
          if (!user) {
            throw new Error(errMessage);
          }
          if(user.isUserLocked) {
            throw new Error("User is locked. Please try after some time later");
          }
          let matchPw = await user.isValidPassword(userData.password);
          await user.updateUserLockedInformation(matchPw)
          if (matchPw) {
            let loginResponse = {
                token: token.createToken(user),
                user: new LoginDto(user)
            }
            return loginResponse
          } else {
            throw new Error(errMessage);
          }
        } catch (e) {
                logError('Error from loginUser()', this.logContext, e)
             throw new Error("Unable to authenticate");
        }
    }


}

export default AuthService