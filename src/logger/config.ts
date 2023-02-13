import { HEADER } from 'src/shared/constant/request';

// pino log levels: "debug" | "fatal" | "error" | "warn" | "info" | "trace"
const LOG_LVL = process.env.LOG_LVL || 'debug';

const loggerConfig = {
  // https://github.com/pinojs/pino-http
  imports: [],
  inject: [],
  useFactory: () => {
    return {
      pinoHttp: {
        level: LOG_LVL,

        genReqId(req) {
          return req.headers[HEADER.X_REQUEST_ID];
        },

        serializers: {
          req(req) {
            const redactedReq = {
              id: req.id,
              method: req.method,
              url: req.url,
              query: req.query,
              params: req.param,
              headers: {},
              remoteAddress: req.remoteAddress,
              remotePort: req.remotePort,
              body: {},
            };
            for (const header in req.headers) {
              if (HEADER.REDACTEDS.includes(header)) {
                redactedReq.headers[header] = HEADER.REDACTED_VALUE;
              } else {
                redactedReq.headers[header] = req.headers[header];
              }
            }
            const logLvl = LOG_LVL;
            if (logLvl === 'debug' || logLvl === 'trace') {
              redactedReq.body = req.raw.body;
            }
            return redactedReq;
          },
        },
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: "yyyy-mm-dd'T'HH:mm:ss.l'Z'",
            messageFormat: '{req.id} [{context}] {msg}',
            singleLine: true,
            errorLikeObjectKeys: ['err', 'error'],
          },
        },
      },
    };
  },
};

export default loggerConfig;
