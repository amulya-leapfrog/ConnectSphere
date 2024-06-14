export function vertexDataParser(data: any) {
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
}

export function extractUserData(userData: any) {
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
}
