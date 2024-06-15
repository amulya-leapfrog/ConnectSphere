import { Injectable } from '@nestjs/common';
import { GremlinService } from '../gremlin/gremlin.service';
import { extractUserData, vertexDataParser } from '@/utils/vertexDataParser';
import { UserData } from '@/interfaces/userData';
import { MinioService } from '../minio.service';

@Injectable({})
export class UserService {
  constructor(
    private gremlinService: GremlinService,
    private minioService: MinioService,
  ) {}
  async getUsers(id: number) {
    const gremlinInstance = this.gremlinService.getClient();

    const response: any = await gremlinInstance.V().hasLabel('user').toList();

    const users = vertexDataParser(response);

    const parseData: UserData[] = extractUserData(users);

    const userData = await Promise.all(
      parseData
        .filter((item) => item.id !== id)
        .map(async (item) => {
          let imgURL: string | null = null;
          if (item.image !== false) {
            imgURL = await this.minioService.getFileUrl(String(item.image));
          }
          return { ...item, image: imgURL };
        }),
    );

    return userData;
  }
}
