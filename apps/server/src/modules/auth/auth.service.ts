import bcrypt from 'bcrypt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GremlinService } from '../gremlin/gremlin.service';
import { LoginDto } from './dto/LoginDto';
import { SignupDto, UpdateDto } from './dto/SignupDto';
import { VertexParser } from '@/utils/vertexDataParser';
import { JwtPayload } from '@/interfaces/jwt';
import { JwtService } from '@nestjs/jwt';
import { MinioService } from '../minio.service';

@Injectable({})
export class AuthService {
  constructor(
    private gremlinService: GremlinService,
    private jwt: JwtService,
    private minioService: MinioService,
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

    const userData = VertexParser.vertexDataParser(response);

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

    const image = data.image ? data.image : false;

    const response = await gremlinInsert
      .addV('user')
      .property('email', data.email)
      .property('password', hashedPassword)
      .property('fullName', data.fullName)
      .property('residence', data.residence)
      .property('phone', data.phone)
      .property('bio', data.bio)
      .property('image', image)
      .next();

    return { user: response.value.id };
  }

  async getMyData(userId: number) {
    const gremlinInstance = this.gremlinService.getClient();

    const response = await gremlinInstance
      .V()
      .hasLabel('user')
      .hasId(userId)
      .toList();

    const userData = VertexParser.vertexDataParser(response);

    const extractedData = VertexParser.extractUserData(userData);

    let imgURL: string | null = null;

    if (extractedData[0].image !== false) {
      imgURL = await this.minioService.getFileUrl(extractedData[0].image);
    }

    const reponseUser = {
      ...extractedData[0],
      image: imgURL,
    };

    return reponseUser;
  }

  async updateMe(id: number, data: UpdateDto) {
    const gremlinInsert = this.gremlinService.getClient();
    await gremlinInsert
      .V(id)
      .property('email', data.email)
      .property('fullName', data.fullName)
      .property('residence', data.residence)
      .property('phone', data.phone)
      .property('bio', data.bio)
      .next();
    return new HttpException('Update successful', HttpStatus.OK);
  }

  async updateMyPic(id: number, fileName: string | null) {
    const image = fileName ? fileName : false;
    const gremlinInsert = this.gremlinService.getClient();
    await gremlinInsert.V(id).property('image', image).next();
    return new HttpException('Update successful', HttpStatus.OK);
  }

  async getFileName(id: number) {
    const gremlinInsert = this.gremlinService.getClient();
    const fileName = await gremlinInsert.V(id).values('image').toList();
    return fileName[0];
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
