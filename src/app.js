"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_1 = require("inversify");
var express_1 = __importDefault(require("express"));
var interface_bind_key_1 = require("./interface_bind_key");
var point_1 = require("./controllers/point");
function buildContainer(env) {
    return __awaiter(this, void 0, void 0, function () {
        var container, app;
        return __generator(this, function (_a) {
            container = new inversify_1.Container();
            container.bind(interface_bind_key_1.interfaceBindKey.env).toConstantValue(env);
            app = express_1.default();
            container.bind(interface_bind_key_1.interfaceBindKey.express).toConstantValue(app);
            app.set("port", env.getPort());
            container.bind(point_1.PointController).to(point_1.PointController).inSingletonScope();
            app.post("/point", container.get(point_1.PointController).postPoint());
            /*
             process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "false";
             const container: interfaces.Container = new Container();
             container.bind(interfaceBindKey.env).toConstantValue(env);
        
             const app = express();
             container.bind<express.Express>(interfaceBindKey.express).toConstantValue(app);
             container.bind<ITypeormService>(interfaceBindKey.typeormService).toConstantValue(await TypeormService.getInstance(env));
             container.bind<ILoggerBuilderService>(interfaceBindKey.loggerBuilderService).to(WinstonAndDebugLoggerBuilderService).inSingletonScope();
        
             // express configuration
             app.set("port", env.getPort());
             app.use(compression());
             app.use(bodyParser.json());
             app.use(bodyParser.urlencoded({extended: true}));
             app.use(expressValidator());
             app.use(session({
                 resave: false,
                 saveUninitialized: false,
                 secret: env.getSessionSecret(),
                 store: new TypeormStore(container.get<ITypeormService>(interfaceBindKey.typeormService).getConnection(), container.get<ILoggerBuilderService>(interfaceBindKey.loggerBuilderService), {
                     cleanupLimit: 2,
                     ttl: 86400
                 })
             }));
             app.use(cookieParser());
             app.use(flash());
             app.use(lusca.xframe("SAMEORIGIN"));
             app.use(lusca.xssProtection(true));
             app.use(
                 express.static(path.join(__dirname, "public"), {maxAge: 31557600000})
             );
        
             container.bind(interfaceBindKey.authenticationService).to(PassportLocalAuthenticationService).inSingletonScope();
             container.bind(interfaceBindKey.kubeService).to(KubeService).inSingletonScope();
             container.bind(interfaceBindKey.pvcService).to(PVCService).inSingletonScope();
             container.bind(interfaceBindKey.datasetService).to(DatasetService).inSingletonScope();
             container.bind(interfaceBindKey.trainingService).to(TrainingService).inSingletonScope();
             container.bind(interfaceBindKey.redisService).to(RedisService).inSingletonScope;
        
             // controllers
        
        
            container.bind(AccountController).to(AccountController).inSingletonScope();
            container.bind(InternalErrorController).to(InternalErrorController).inSingletonScope();
        
            container.bind(TrainingController).to(TrainingController).inSingletonScope();
        
            //Primary app routes.
        
            const authHandler = getAuthHandler(container.get(interfaceBindKey.authenticationService));
            app.get("/account", authHandler, container.get(AccountController).getAccount());
            app.post("/account/login", container.get(AccountController).postLogin());
            app.get("/account/logout", container.get(AccountController).getLogout());
            app.use(container.get(InternalErrorController).errorHandler());
        
        
            app.post("/training/preprocess", container.get(TrainingController).postPreProcess());
            app.post("/training/run", container.get(TrainingController).postRun());
            app.post("/training/logs", container.get(TrainingController).postLogs());
        
        
            */
            return [2 /*return*/, container];
        });
    });
}
exports.buildContainer = buildContainer;
function buildApp(env) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, buildContainer(env)];
                case 1: return [2 /*return*/, (_a.sent()).get(interface_bind_key_1.interfaceBindKey.express)];
            }
        });
    });
}
exports.buildApp = buildApp;
