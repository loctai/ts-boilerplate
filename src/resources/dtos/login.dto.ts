class LoginDto {
    id: string = "";
    email: string = "";
    constructor(obj) {
        this.id = obj._id;
        this.email = obj.email;
    }
}
export default LoginDto;