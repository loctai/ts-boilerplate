import mongoose from "mongoose";
import express, { Application } from "express";
import Controller from "./utils/interface/controller.interface";
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import errorMiddleware from "./middleware/error.middleware";
import helmet from "helmet";



class App {
    public express: Application;
    public port: number;
    public baseUrl: string;

    constructor(
        controllers: Controller[], port: number, baseUrl: string
    ) {
        this.express = express();
        this.port = port;
        this.baseUrl = baseUrl;
        this.initDBConnection();
        this.initMiddleware();
        this.initControllers(controllers);
        this.initErrorHandling();


    }

    private initMiddleware(): void {
        this.express.use(helmet());
        this.express.use(cors({
            origin: 'http://localhost:4200'
        }));
        this.express.use(morgan('dev'));
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
        this.express.use(compression());
    }

    private initControllers(controllers: Controller[]): void {
        controllers.forEach((controller: Controller) => {
            this.express.use('/api', controller.router);
        });
    }

    private initErrorHandling(): void {
        this.express.use(errorMiddleware);
    }

    private initDBConnection(): void {
        const { MONGO_URI } = process.env;
        mongoose.connect(`${MONGO_URI}`); 
        const connection = mongoose.connection;
    
        connection.on("connected", () => {
            console.log(
                `⚡️[server]: DB connected on port ${connection.port}`
            );
        });
        connection.on("disconnected", () => {
          console.log("⚡️[server]: DB disconnected");
        });
      }

    public listen(): void {
        this.express.listen(this.port, this.baseUrl, () => {
            console.log(`⚡️[server]: App listening on the port ${this.port}`);
        });
    }
}

export default App;