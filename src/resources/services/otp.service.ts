import OtpModel, { VERIFICATION_TYPES } from "../models/otp.model";

class OTPService {
    public logContext: string = "OTP SERVICE";

    constructor() {}
    async generateOTP() {
		if (process.env.NODE_ENV === "production") {
			return Math.floor(100000 + Math.random() * 900000);
		} else {
			return 123456;
		}
	}
    public async createOTP(verification_type: any, email: string): Promise<any> {
        if (!Object.values(VERIFICATION_TYPES)?.includes(verification_type)) {
            return { ok: false, msg: `type ${verification_type} not valid` }
        }
        const OTP_Random = await this.generateOTP()

        const limitOtp = await OtpModel.find({
            email: email,
            isVerified: false
        });

        if (limitOtp.length > 3) {
            return { ok: false, msg:  `this ${email} can not request otp at the moment`};
        }

        const newOtp = new OtpModel({
            verification_type: VERIFICATION_TYPES[verification_type],
            otp: OTP_Random.toString(),
            email: email,
            otpExpire: new Date(Date.now() + 10 * 60 * 1000)
        });
        await newOtp.save();
        return { otp_id: newOtp._id, otp: OTP_Random, ok: true };
    }

    

    public async verifyOtp(otp: any): Promise<any> {
        const otpData = await OtpModel.findOne({ otp: otp, isVerified: false });
        if (!otpData) {
            throw new Error("something went wrong.otp failed.");
        }
        if(Date.parse(otpData.otpExpire! as string) < Date.now()) {
            throw new Error("Invalid token")
        }
        otpData.emailVerifiedAt = new Date()
        otpData.isVerified = true;
        otpData.save();
        return true;
    }
}

export default OTPService;
