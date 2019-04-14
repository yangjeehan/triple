
export interface IEnv {
    getExternalIp(): string;

    getPort(): number;

    getDbConf(): {
        "type": "mysql",
        "host": string,
        "port": number,
        "username": string,
        "password": string,
        "database": string,
        "synchronize": boolean,
        "logging" : boolean,
        "entities" : string[]
    };
}

export class DevEnv implements IEnv {

    getDbConf() : { type: "mysql"; host: string; port: number; username: string; password: string; database: string; synchronize: boolean;  logging : boolean; entities: string[] } {
        return {
            type: "mysql",
            host: "localhost",
            port: 3306,
            username: "yang",
            password: "yang123",
            database: "triple",
            synchronize: false,
            logging: true,
            entities: [
                __dirname + "/src/entities/**/*"
            ]
        };
    }

    getExternalIp(): string {
        return "127.0.0.1";
    }

    getPort(): number {
        return 3000;
    }

}

