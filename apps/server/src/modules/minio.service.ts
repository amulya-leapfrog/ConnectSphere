import { Injectable } from '@nestjs/common';
import * as Minio from 'minio';

@Injectable({})
export class MinioService {
  private minioClient: Minio.Client;
  private bucketName: string;

  constructor() {
    this.minioClient = new Minio.Client({
      endPoint: String(process.env.MINIO_ENDPOINT),
      port: Number(process.env.MINIO_PORT),
      useSSL: false,
      accessKey: String(process.env.MINIO_ACCESS_KEY),
      secretKey: String(process.env.MINIO_SECRET_KEY),
    });
    this.bucketName = String(process.env.MINIO_BUCKET_NAME);
  }

  async createBucketIfNotExists() {
    const bucketExists = await this.minioClient.bucketExists(this.bucketName);
    if (!bucketExists) {
      await this.minioClient.makeBucket(this.bucketName, 'images');
    }
  }

  async uploadFile(file: Express.Multer.File) {
    const fileName = `${Date.now()}-${file.originalname}`;

    await this.minioClient.putObject(
      this.bucketName,
      fileName,
      file.buffer,
      file.size,
    );

    return fileName;
  }

  async getFileUrl(fileName: string) {
    return this.minioClient.presignedUrl('GET', this.bucketName, fileName);
  }

  async deleteFile(fileName: string) {
    await this.minioClient.removeObject(this.bucketName, fileName);
  }
}
