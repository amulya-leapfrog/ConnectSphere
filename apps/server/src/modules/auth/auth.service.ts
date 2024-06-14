import bcrypt from 'bcrypt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GremlinService } from '../gremlin/gremlin.service';
import { LoginDto } from './dto/LoginDto';
import { SignupDto } from './dto/SignupDto';
import { extractUserData, vertexDataParser } from '@/utils/vertexDataParser';
import { JwtPayload } from '@/interfaces/jwt';
import { JwtService } from '@nestjs/jwt';

@Injectable({})
export class AuthService {
  constructor(
    private gremlinService: GremlinService,
    private jwt: JwtService,
  ) {}

  async login(data: LoginDto) {
    const gremlinInstance = this.gremlinService.getClient();

    const response: any = await gremlinInstance
      .V()
      .hasLabel('user')
      .has('email', data.email)
      .toList();

    if (response.length === 0) {
      throw new HttpException(
        'Invalid Email or Password',
        HttpStatus.NOT_FOUND,
      );
    }

    const userData = vertexDataParser(response);

    const isPasswordMatch = await bcrypt.compare(
      data.password,
      userData[0].password.value,
    );

    if (!isPasswordMatch) {
      throw new HttpException(
        'Invalid Email or Password',
        HttpStatus.FORBIDDEN,
      );
    }

    const jwtPayload = {
      id: userData[0].id,
    };

    const accessToken = this.createAccessToken(jwtPayload);
    const refreshToken = this.createRefreshToken(jwtPayload);

    return { accessToken, refreshToken };
  }

  async signup(data: SignupDto) {
    const gremlinInsert = this.gremlinService.getClient();

    const salt = await bcrypt.genSalt(15);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    // profile pics

    const response = await gremlinInsert
      .addV('user')
      .property('email', data.email)
      .property('password', hashedPassword)
      .property('fullName', data.fullName)
      .property('residence', data.residence)
      .property('phone', data.phone)
      .property('bio', data.bio)
      .next();

    this.gremlinService.onModuleDestroy();

    return { user: response.value.id };
  }

  async getMyData(userId: number) {
    const gremlinInstance = this.gremlinService.getClient();
    const response = await gremlinInstance
      .V()
      .hasLabel('user')
      .hasId(userId)
      .toList();

    const userData = vertexDataParser(response);

    this.gremlinService.onModuleDestroy();

    const extractedData = extractUserData(userData);
    return extractedData[0];
  }

  refreshToken(userId: number) {
    const jwtPayload = {
      id: userId,
    };

    const accessToken = this.createAccessToken(jwtPayload);

    return { accessToken };
  }

  createAccessToken(payload: JwtPayload) {
    const accessToken = this.jwt.sign(payload, {
      expiresIn: '10m',
      secret: process.env.ACCESS_TOKEN_SECRET,
    });

    return accessToken;
  }

  createRefreshToken = (payload: JwtPayload) => {
    const refreshToken = this.jwt.sign(payload, {
      expiresIn: '1h',
      secret: process.env.REFRESH_TOKEN_SECRET,
    });

    return refreshToken;
  };
}
