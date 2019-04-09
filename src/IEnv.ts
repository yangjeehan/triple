
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
        "synchronize": boolean
    };
}

export class DevEnv implements IEnv {
    getDbConf() : { type: "mysql"; host: string; port: number; username: string; password: string; database: string; synchronize: boolean; } {
        return {
            type: "mysql",
            host: "127.0.0.1",
            port: 3306,
            database: "triple",
            username: "root",
            password: "root",
            synchronize: true
        };
    }

    getExternalIp(): string {
        return "127.0.0.1";
    }

    getPort(): number {
        return 3000;
    }

}

