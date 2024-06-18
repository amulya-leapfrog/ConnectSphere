import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GremlinService } from '../gremlin/gremlin.service';
import { extractUserData, vertexDataParser } from '@/utils/vertexDataParser';
import { UserData } from '@/interfaces/userData';
import { MinioService } from '../minio.service';
import { process } from 'gremlin';

@Injectable({})
export class UserService {
  constructor(
    private gremlinService: GremlinService,
    private minioService: MinioService,
  ) {}
  async getUsers(id: number) {
    const gremlinInstance = this.gremlinService.getClient();

    const response: any = await gremlinInstance
      .V()
      .hasLabel('user')
      .not(process.statics.both('friends').hasId(id))
      .toList();

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

  async sendFriendRequest(userId: number, targetId: number) {
    const gremlinInstance = this.gremlinService.getClient();

    const edgeExists = await gremlinInstance
      .V(userId)
      .bothE('friends')
      .where(process.statics.otherV().hasId(targetId))
      .hasNext();

    if (edgeExists) {
      throw new HttpException('Request already sent', HttpStatus.BAD_REQUEST);
    }

    await gremlinInstance
      .V(userId)
      .as('from')
      .V(targetId)
      .as('to')
      .addE('friends')
      .from_('from')
      .to('to')
      .property('requestedBy', userId)
      .property('receivedBy', targetId)
      .property('status', 'PENDING')
      .next();

    return new HttpException('Friend Request Sent', HttpStatus.OK);
  }

  async getMyFriends(userId: number) {
    const gremlinInstance = this.gremlinService.getClient();

    const response: any = await gremlinInstance
      .V(userId)
      .bothE('friends')
      .as('edge')
      .otherV()
      .as('vertex')
      .select('edge', 'vertex')
      .by(
        process.statics
          .project(
            'id',
            'label',
            'status',
            'requestedBy',
            'receivedBy',
            'fullName',
            'bio',
            'residence',
            'phone',
            'image',
          )
          .by(process.statics.id())
          .by(process.statics.label())
          .by('status')
          .by('requestedBy')
          .by('receivedBy')
          .by('fullName')
          .by('bio')
          .by('residence')
          .by('phone')
          .by('image'),
      )
      .toList();

    const friendData = await Promise.all(
      response.map(async (entry: any) => ({
        friendId: entry.get('vertex').get('id'),
        fullName: entry.get('vertex').get('fullName'),
        bio: entry.get('vertex').get('bio'),
        residence: entry.get('vertex').get('residence'),
        phone: entry.get('vertex').get('phone'),
        image: entry.get('vertex').get('image')
          ? await this.minioService.getFileUrl(entry.get('vertex').get('image'))
          : null,
        requestedBy: entry.get('edge').get('requestedBy'),
        receivedBy: entry.get('edge').get('receivedBy'),
        status: entry.get('edge').get('status'),
        edgeId: entry.get('edge').get('id').relationId,
      })),
    );

    return friendData;
  }

  async deleteMyFriend(edgeId: string) {
    const gremlinInstance = this.gremlinService.getClient();
    await gremlinInstance.E(edgeId).drop().next();
    return new HttpException('Friend Request Deleted', HttpStatus.OK);
  }

  async approveMyFriend(edgeId: string) {
    const gremlinInstance = this.gremlinService.getClient();
    await gremlinInstance.E(edgeId).property('status', 'APPROVED').next();
    return new HttpException('Friend Request Approved', HttpStatus.OK);
  }
}
