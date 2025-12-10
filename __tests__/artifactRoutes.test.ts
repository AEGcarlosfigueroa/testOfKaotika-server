import * as express from "express";
import { artifactRouter } from './../src/routes/artifactRoutes.ts';
import * as supertest from 'supertest';
import * as artifactDatabase from "./../src/database/artifactDatabase.ts";


describe('test if artifact API routes work properly', () => {
    const app = express();

    beforeAll(() => {
        app.use("/api/artifacts", artifactRouter);

        app.listen(3000, () => {
            console.log(`API is listening on port ${3000}`);
        });
    });

    afterAll(() => {

    })

    test('GET /all ahould return an array of artifacts with code 200', async() => {

        //ARTIFACT ARRAY
        const fakeArtifactArray = [
            {
                artifactId: "0",
                latitude: 20,
                longitude: 55,
                artifactName: "testArtifact",
                isCollected: false
            },
            {
                artifactId: "1",
                latitude: 15,
                longitude: 35,
                artifactName: "testArtifact2",
                isCollected: false
            }
        ]

        //SPY ON FUNCTION TO NOT SEND A REAL REQUEST TO MONGODB AND USE THE FAKE ARRAY
        jest.spyOn(artifactDatabase, "getAllArtifacts").mockImplementation(() => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(fakeArtifactArray);
                }, 50);
            });
        })

       const url = "/api/artifacts/all";
       
       const response = await supertest(app).get(url);

       expect(response.status).toBe(200);
       expect(response.body.artifactData[0].artifactId).toBe(fakeArtifactArray[0].artifactId);
       expect(response.body.artifactData[1].artifactId).toBe(fakeArtifactArray[1].artifactId);
    })
})