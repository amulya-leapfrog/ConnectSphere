import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GremlinService } from '../gremlin/gremlin.service';
import { VertexParser } from '@/utils/vertexDataParser';
import { UserData } from '@/interfaces/userData';
import { MinioService } from '../minio.service';
import { process } from 'gremlin';

@Injectable({})
export class UserService {
  constructor(
    private gremlinService: GremlinService,
    private minioService: MinioService,
    private vertexParser: VertexParser,
  ) {}
  async getUsers(id: number) {
    const gremlinInstance = this.gremlinService.getClient();

    const response: any = await gremlinInstance
      .V()
      .hasLabel('user')
      .not(process.statics.both('friends').hasId(id))
      .toList();

    const users = VertexParser.vertexDataParser(response);

    const parseData: UserData[] = VertexParser.extractUserData(users);

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

  async recommendingUsers(id: number) {
    const gremlinInstance = this.gremlinService.getClient();

    const response: any = await gremlinInstance
      .V(id)
      .both('friends')
      .both('friends')
      .not(process.statics.hasId(id))
      .not(process.statics.both('friends').hasId(id))
      .dedup()
      .project('recommended', 'mutualFriends')
      .by(process.statics.valueMap(true))
      .by(
        process.statics
          .both('friends')
          .where(process.statics.both('friends').hasId(id))
          .project('id', 'fullName')
          .by(process.statics.id())
          .by(process.statics.values('fullName'))
          .fold(),
      )
      .toList();

    const parsedRecommendUser =
      await this.vertexParser.parseRecommendation(response);

    return parsedRecommendUser;
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

    const friendData = this.vertexParser.friendsResponse(response);

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
