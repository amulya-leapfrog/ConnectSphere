import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController{
    constructor(private authService: AuthService){}

    @Post('login')
    login(@Body() dto:any){
        return this.authService.login(dto)
    }

    @Post('signup')
    signup(@Body() dto:any){
        return this.authService.signup(dto)
    }

}