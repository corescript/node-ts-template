import crypto from 'crypto';

const stringify = (val: unknown) =>
    typeof val === 'string' ? val : JSON.stringify(val);

export const MD5 = (data: unknown): string =>
    crypto.createHash('md5').update(stringify(data)).digest('hex');

export const SHA = (data: unknown): string =>
    crypto.createHash('sha256').update(stringify(data)).digest('hex');

export const random = (size: number): string =>
    crypto.randomBytes(size).toString('hex');
