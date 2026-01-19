import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

export const generateAccessToken = (email: string) => {
    const result = jwt.sign({data: email}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 15});

    return result;
}

export const generateRefreshToken = (email: string) => {
    const result = jwt.sign({data: email}, process.env.REFRESH_TOKEN_SECRET);

    return result;
}