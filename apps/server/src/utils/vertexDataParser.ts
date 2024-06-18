import { MinioService } from '@/modules/minio.service';
import { Injectable } from '@nestjs/common';

@Injectable({})
export class VertexParser {
  constructor(private minioService: MinioService) {}

  static vertexDataParser = (data: any) => {
    const extractedData = data.map((vertex: any) => {
      const extractedVertex: Record<string, any> = {
        id: vertex.id,
        label: vertex.label,
      };

      for (const property in vertex.properties) {
        if (Object.prototype.hasOwnProperty.call(vertex.properties, property)) {
          extractedVertex[property] = vertex.properties[property][0];
        }
      }

      return extractedVertex;
    });

    return extractedData;
  };

  static extractUserData = (userData: any) => {
    return userData.map((user: any) => {
      const { password, ...userDataWithoutPassword } = user;
      const userDataValues: Record<string, any> = {};
      for (const key in userDataWithoutPassword) {
        if (userDataWithoutPassword[key].value !== undefined) {
          userDataValues[key] = userDataWithoutPassword[key].value;
        } else {
          userDataValues[key] = userDataWithoutPassword[key];
        }
      }
      return userDataValues;
    });
  };

  async parseRecommendation(response: any) {
    const parsedItems = await Promise.all(
      response.map(async (item: any) => {
        const recommended = item.get('recommended');
        const mutualFriends = item.get('mutualFriends');

        const parsedRecommended: any = {};
        for (const [key, value] of recommended.entries()) {
          if (key !== 'password' && key !== 'bio' && key !== 'phone') {
            if (key === 'image') {
              parsedRecommended[key] = await this.minioService.getFileUrl(
                value[0],
              );
            } else {
              parsedRecommended[key] = Array.isArray(value) ? value[0] : value;
            }
          }
        }

        const parsedMutualFriends = mutualFriends.map((friend: any) => {
          const parsedFriend: any = {};
          for (const [key, value] of friend.entries()) {
            parsedFriend[key] = value;
          }
          return parsedFriend;
        });

        return {
          recommended: parsedRecommended,
          mutualFriends: parsedMutualFriends,
        };
      }),
    );
    return parsedItems;
  }

  async friendsResponse(response: any) {
    return await Promise.all(
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
  }
}
