import * as express from "express";
import * as supertest from 'supertest';
import * as firebase from "../src/middlewares/verifyData.ts";
import * as dotenv from 'dotenv';
import authenticateToken from './../src/middlewares/verifyJsonWebToken.ts'

describe('test if jwt API routes work properly', () => {
    const app = express();

    const tokens = {
        accessToken: "", refreshToken: ""
    }

    beforeAll(async() => {

        dotenv.config();

        jest.spyOn(firebase, 'verifyFirebaseToken').mockImplementation(async(req: any, res: any, next: Function) => {
            next();
        });

        const router = (await import('./../src/routes/jwtRoutes.ts'))

        app.use("/api/jwt", router.jwtRouter);

        app.use("/verifyToken", authenticateToken, (req: any, res: any) => {return res.sendStatus(200)})

        app.listen(3000, () => {
            console.log(`API is listening on port ${3000}`);
        });


    });

    beforeEach(() => {
        
    })

    afterEach(() => {
    })

    afterAll(() => {
        jest.clearAllMocks();
    })

    test('GET /api/jwt ahould return an accessToken and a refrshToken with code 200', async() => {

       const email = "a@a.com"

       const url = "/api/jwt/generateToken/" + email;
       
       const response = await supertest(app).get(url);

       console.log(response.body);

       tokens.accessToken = response.body.data.accessToken; //Save access token for next test
       tokens.refreshToken = response.body.data.refreshToken; //Save refresh token for next text

       expect(response.status).toBe(200);
       expect(response.body.data.accessToken).not.toBe(undefined);
       expect(response.body.data.refreshToken).not.toBe(undefined);
    })

    test("GET /api/jwt/refreshToken should return a refreshToken and an accessToken with code 200", async() => {
        const usedRefreshToken = tokens.refreshToken;

        console.log(usedRefreshToken)

        const url = "/api/jwt/refreshToken";

        const response = await supertest(app).get(url).set('refreshtoken', `Bearer ${usedRefreshToken}`);

        expect(response.status).toBe(200);
        expect(response.body.data.accessToken).not.toBe(undefined);
        expect(response.body.data.refreshToken).not.toBe(undefined);
    })

    test("GET /api/jwt/refreshToken should return 401 when there is not any token", async() => {

        const url = "/api/jwt/refreshToken";

        const response = await supertest(app).get(url);

        expect(response.status).toBe(401);
    })

    test("GET /api/jwt/refreshToken should return 405 when there is an incorrect token", async() => {

        const url = "/api/jwt/refreshToken";

        const response = await supertest(app).get(url).set('refreshtoken', `Bearer ufib32ufb32nu`);

        expect(response.status).toBe(405);
    })

    test("authenticateToken middleware should be passed when there is a correct token", async() => {
        const usedAccessToken = tokens.accessToken;

        console.log(usedAccessToken)

        const url = "/verifyToken";

        const response = await supertest(app).get(url).set('jwtauthorization', `Bearer ${usedAccessToken}`);

        console.log(response);

        expect(response.status).toBe(200);
    })

    test("authenticateToken middleware should return 403 when there is not a correct token", async() => {

        const url = "/verifyToken";

        const response = await supertest(app).get(url).set('jwtauthorization', `Bearer bub8bg87b8.yvuvuobyu.uvuivbyu`);

        expect(response.status).toBe(403);
    })
})