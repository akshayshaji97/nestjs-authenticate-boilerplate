import * as dotenv from 'dotenv';
import { Appconfig, Environment } from 'src/interfaces';

const env: Environment = (process.env.NODE_ENV as Environment) || 'development';

if (env === 'development') {
  dotenv.config({ path: `${__dirname}/../../.env.development` });
} else if (env === 'production') {
  dotenv.config({ path: `${__dirname}/../../.env.production` });
} else {
  dotenv.config();
}

// console.log(`MONGO_URL: ${process.env.MONGO_URL}`);
// console.log(`PORT from env: ${process.env.PORT}`);

const config: Appconfig = {
  port: process.env.PORT || 8001,
  mongoUrl:
    process.env.MONGO_URL ||
    'mongodb+srv://rubiontechio:mampallil@shopfrombio-dev.q1h9x.mongodb.net/shopformbio-dev?retryWrites=true&w=majority',
  jwt: {
    secret: process.env.JWT_SECRET || 'dfdfdfdeeeee',
    accessSecret: process.env.JWT_ACCESS_SECRET || 'asdfertgfrg',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'yghjdtyuhgfddb',
    accessExpiry: 900, // 15 minutes in seconds
    refreshExpiry: 604800, // 7 days
  },
  authentication: {
    liveOTP: false,
    debugOTP: '123456',
  },
};

export default config;
