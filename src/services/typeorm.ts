import * as typeorm from "typeorm";
import { Connection } from "typeorm";
import { IEnv } from "../../IEnv";
import { injectable } from "inversify";

export interface ITypeormService {
    getConnection(): Connection;
}

@injectable()
export class TypeormService implements ITypeormService {
    private readonly conn: Connection;

    // env: IEnv
    public static async getInstance(dbConf: any): Promise<TypeormService> {
        // const dbConf = env.getDbConf();
        console.log(dbConf);
        const conn: Connection = await typeorm.createConnection(
            {
                type: dbConf.type,
                host: dbConf.host,
                port: dbConf.port,
                username: dbConf.username,
                password: dbConf.password,
                database: dbConf.database,
                synchronize: dbConf.synchronize,
                logging: dbConf.logging,
                entities: dbConf.entities
            });
        return new TypeormService(conn);
    }
//private으로 해야함
    private constructor(conn: Connection) {
        this.conn = conn;
    }

    public getConnection(): Connection {
        return this.conn;
    }
}
