import { Document, Schema } from "mongoose";

export default interface User extends Document {
  _id: Schema.Types.ObjectId;
  email: string;
  password: string;
  loginAttempt: number;
  timeLock: number;
  isUserLocked: boolean;
  isValidPassword(password: string): Promise<Error | boolean>;
  updateUserLockedInformation(matchPw: any): Promise<any>;
}