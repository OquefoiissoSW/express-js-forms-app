import * as jwt from 'jsonwebtoken'

const jwtSecret = process.env.JWT_SECRET;

const generateToken = (id: string) =>
    jwt.sign({ user: { id }}, jwtSecret as string, { expiresIn: '60d' });

export default generateToken