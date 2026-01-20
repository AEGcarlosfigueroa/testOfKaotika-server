import * as dotenv from 'dotenv'
import * as jwt from 'jsonwebtoken'

export default function authenticateToken (req: Request, res: Response, next: Function)
{
    const authHeader = req.headers['jwtauthorization'];

    const token = authHeader && authHeader.split(' ')[1];

    if(!token)
    {
        console.log('UNAUTHORIZED');
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, email) => {
        if(error)
        {
            console.log('FORBIDDEN')
            console.log(error);
            return res.sendStatus(403);
        }
        req.email = email;
        next();
    })
}