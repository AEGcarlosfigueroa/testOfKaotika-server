import { createServer } from "node:http";
import { type AddressInfo } from "node:net";
import { Server, Socket as ServerSocket, Socket } from "socket.io";
import { io as ioc, type Socket as ClientSocket } from "socket.io-client";
import { coordinateListener } from "../src/ioServer/listeners/coordinateListener.ts";

import * as listUpdate from "./../src/ioServer/events/coordinateListUpdate.ts";
import * as globals from "./../src/globalVariables.ts";

const fakeObj = {playerEmail: "a@a.com", latitude: 20, longitude: 35}
const fakeObj2 = {playerEmail: "a@a.com", latitude: 30, longitude: 40}
const fakeObj3 = {playerEmail: "b@b.com", latitude: 20, longitude: 35}

describe("Test that the coordinateListener properly inserts coordinate object into the coordinateList array", () => {
    let io: Server, serverSocket: ServerSocket, clientSocket: ClientSocket;

    beforeAll((done) => {
      const httpServer = createServer();
      io = new Server(httpServer);
      httpServer.listen(() => {
        const port = (httpServer.address() as AddressInfo).port;
        clientSocket = ioc(`http://localhost:${port}`);
        io.on("connection", (socket: Socket) => {
          serverSocket = socket;
        });
        clientSocket.on("connect", done);
      });
    });

    afterAll(() => {
      io.close();
      clientSocket.disconnect();
    });

    beforeEach(() => {
        jest.mock("./../src/ioServer/events/coordinateListUpdate.ts");
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("make sure the new object is properly inserved into the coordinateList array", async() => {
        coordinateListener(serverSocket, io);
        clientSocket.emit("sendCoordinates", fakeObj);
        await wait();
        expect(globals.coordinateList.length).toBe(1);
    });

    test("when a coordinate object with a different email appears, it should be inserted alongside the existing object", async() => {
        coordinateListener(serverSocket, io);
        clientSocket.emit("sendCoordinates", fakeObj3);
        await wait();
        expect(globals.coordinateList.length).toBe(2);
    });

    test("when a coordinate that matches email with another object appears, it should replace the existing object", async() => {
        coordinateListener(serverSocket, io);
        clientSocket.emit("sendCoordinates", fakeObj2);
        await wait();
        expect(globals.coordinateList.length).toBe(2);
    })

})

async function wait()
{
    await new Promise((resolve) => {
                setTimeout(() => {
                    resolve ("a");
                }, 50);
            });
}
