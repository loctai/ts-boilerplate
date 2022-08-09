import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import User from "../interfaces/user.interface";
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 1 * 60 * 60 ; // 1 hour
const UserSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    loginAttempt: { type: Number, default: 0 },
    timeLock: { type: Number, default: 0 }, // timestamps
  },
  {
    timestamps: true,
  }
);

UserSchema.pre<User>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const hash = await bcrypt.hash(this.password, 12);
  this.password = hash;
  next();
});


UserSchema.methods.isValidPassword = async function (
  password: string
): Promise<Error | boolean> {
  return await bcrypt.compare(password, this.password);
};


UserSchema.methods.updateUserLockedInformation = async function (isPasswordValid: boolean) {
  let count = this.loginAttempt;
  this.loginAttempt = isPasswordValid ? 0 : count + 1;
  this.lockedAt = this.loginAttempt <= MAX_LOGIN_ATTEMPTS ? 0 : Math.floor(new Date() as any / 1000);
  await this.save();
};

UserSchema.virtual('isUserLocked').get(function (this: any) {
  const lockedAt = this.lockedAt as Number;
  let timeLock  = Number(lockedAt) + Number(LOCK_TIME)
  return timeLock >= Math.floor(new Date() as any / 1000)
});

export default model<User>("User", UserSchema);
