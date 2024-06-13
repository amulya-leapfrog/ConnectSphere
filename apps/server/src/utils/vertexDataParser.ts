export default function vertexDataParser(data: any) {
  const extractedData = data.map((vertex: any) => {
    const extractedVertex: Record<string, any> = {
      id: vertex.id,
      label: vertex.label,
    };

    for (const property in vertex.properties) {
      if (Object.prototype.hasOwnProperty.call(vertex.properties, property)) {
        extractedVertex[property] = vertex.properties[property][0]; // Assuming properties are arrays containing a single value
      }
    }

    return extractedVertex;
  });

  return extractedData;
}
