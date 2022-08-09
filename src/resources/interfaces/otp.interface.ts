import { Document, Schema } from "mongoose";

export default interface IOTP extends Document {
  _id: Schema.Types.ObjectId;
  email: string;
  otp: string | undefined;
  verification_type: string;
  isVerified: boolean;
  otpExpire: Date | string | undefined;
  emailVerifiedAt: Date;
}
