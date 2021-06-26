import crypto from 'crypto';

const stringify = (val: unknown) => typeof val === 'string' ? val : JSON.stringify(val);

export const MD5 = (data: unknown) => crypto.createHash('md5').update(stringify(data)).digest('hex');

export const SHA = (data: unknown) => crypto.createHash('sha256').update(stringify(data)).digest('hex');

export const random = (size: number) => crypto.randomBytes(size).toString('hex');
