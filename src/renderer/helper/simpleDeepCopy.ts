const simpleDeepCopy = <T>(obj: T) => {
  return JSON.parse(JSON.stringify(obj)) as T;
};

export default simpleDeepCopy;
