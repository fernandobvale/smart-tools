export const calculateValue = (numberOfLessons: number) => {
  const valuePerLesson = numberOfLessons <= 15 ? 10 : 8;
  return numberOfLessons * valuePerLesson;
};