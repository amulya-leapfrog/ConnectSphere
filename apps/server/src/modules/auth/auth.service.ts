import { Injectable } from "@nestjs/common";

@Injectable({})
export class AuthService{
    login(data:any){
        return data
    }

    signup(data:any){
        return data
    }
}