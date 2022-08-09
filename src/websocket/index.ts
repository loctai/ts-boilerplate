import { Server } from "http";
import SocketIO from "socket.io";
import { Server as socketServer } from "socket.io";

export default class WebSocketService {
    private server: Server;
    private io: socketServer;
    private ws?: any;

    constructor(server: Server) {
        console.log("[WebSocketService]: Starting Service...");
        this.server = server;
        this.io = new socketServer(this.server, {
            cors: {
                origin: "*"
            }
        });

        this.listeners();
    }

    public get socket(): socketServer { return this.io };

    private listeners() {
        this.ws = this.io.on('connection', (socket: SocketIO.Socket) => {
            console.log("[WebSocketService]: Connection established");
            console.log("[WebSocketService]: Socket ID: ", socket.id);

            socket.on('connect', async () => {
               
                socket.emit('state-change', {
                    state: "CONNECTED"
                })
            })
        });
    }


    public emit(event: string, data: any) {
        this.ws.emit(event, data);
    }

    public addListener(of: string, event: string, callback: (data: any) => void) {
        this.ws.of(of).on(event, callback);
    }
}