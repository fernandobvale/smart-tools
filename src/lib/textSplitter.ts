export const splitText = (text: string, maxLength: number): string[] => {
  if (!text) return [];
  
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  const result: string[] = [];
  let currentChunk = "";

  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length <= maxLength) {
      currentChunk += sentence;
    } else {
      if (currentChunk) {
        result.push(currentChunk.trim());
      }
      currentChunk = sentence;
    }
  }

  if (currentChunk) {
    result.push(currentChunk.trim());
  }

  return result;
};