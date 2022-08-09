import { Schema, model } from "mongoose";
import IOTP from "../interfaces/otp.interface";


export enum VERIFICATION_TYPES {
    EMAIL_VERIFICATION = "EMAIL_VERIFICATION",
    FORGOT_PASSWORD = "FORGOT_PASSWORD"
}


const OTPSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    otp: {
        type: String,
        required: [true, 'OTP must have a otp'],
        trim: true,
    },
    verification_type: {
        type: String,
        enum: [VERIFICATION_TYPES.EMAIL_VERIFICATION, VERIFICATION_TYPES.FORGOT_PASSWORD],
        required: true,
    },
    isVerified: {
		type: Boolean,
		default: false,
	},
    otpExpire: {
        type: Date
    },
    emailVerifiedAt: {
        type: Date
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret._id;
        delete ret.__v;
        delete ret.email;
      },
    },
  }
);


export default model<IOTP>("OTP", OTPSchema);
