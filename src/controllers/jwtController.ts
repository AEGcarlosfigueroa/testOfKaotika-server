import * as jwtImplementation from './../middlewares/jsonWebToken.ts'
import * as jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'

export function refreshToken(req: Request, res: Response)
{
    try
    {
        const authHeader = req.headers.refreshtoken;

        console.log(req.headers)

        const token = authHeader && authHeader.split(' ')[1];

        if(!token)
        {
            console.log('UNAUTHORIZED');
            return res.sendStatus(401);
        }

        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (error, email) => {
            if(error)
            {
                console.log('FORBIDDEN')
                console.log(error);
                return res.sendStatus(405);
            }

            const newAccessToken = jwtImplementation.generateAccessToken(email);
            const newRefreshToken = jwtImplementation.generateRefreshToken(email);

            return res.send({status: 'SUCCESS', data: { accessToken: newAccessToken, refreshToken: newRefreshToken }});
        })
    }
    catch(error)
    {
        console.error(error);
        return res.status(error?.status || 500).send({ 
            status: "FAILED",
            message: "Request failed",
            data: { error: error?.message || error }
        });
    }
}

export function createNewToken(req: any, res: Response)
{
    try
    {
        const { params: { playerEmail } } = req;

        const newAccessToken = jwtImplementation.generateAccessToken(playerEmail);
        const newRefreshToken = jwtImplementation.generateRefreshToken(playerEmail);
        return res.send({status: 'SUCCESS', data: { accessToken: newAccessToken, refreshToken: newRefreshToken }});

    }
    catch(error)
    {
        console.error(error);
        return res.status(error?.status || 500).send({ 
            status: "FAILED",
            message: "Request failed",
            data: { error: error?.message || error }
        });
    }
}

