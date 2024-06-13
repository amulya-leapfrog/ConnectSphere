import { Injectable } from '@nestjs/common';

@Injectable({})
export class UserService {
  async getUsers() {
    console.log('this is get all user');
  }
}
