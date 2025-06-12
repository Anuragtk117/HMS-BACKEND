import * as argon2 from 'argon2';

const hashData = async (data: string): Promise<string> => {
  return argon2.hash(data);
};

const compareData = (data: string, hash: string): Promise<boolean> => {
  return argon2.verify(hash, data);
};

export { hashData, compareData };
