import {inject, injectable} from "inversify";
import {IEnv} from "../IEnv";
import {interfaceBindKey} from "../interface_bind_key";

@injectable()
export class PointService {
    private readonly env: IEnv;

    public constructor(@inject(interfaceBindKey.env) env: IEnv) {
        this.env = env;
    }
}