export const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || '4');

export const roles = {
    admin: 'ADMIN',
    user: 'USER'
};

export const JWT_SECRET = process.env.JWT_SECRET || '';
