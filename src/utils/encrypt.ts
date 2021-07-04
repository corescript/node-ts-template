import bcrypt from 'bcryptjs';

export const genSalt = bcrypt.genSalt;
export const hash = bcrypt.hash;
export const compare = bcrypt.compare;
