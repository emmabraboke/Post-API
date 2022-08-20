import dotenv from 'dotenv';
dotenv.config();

const config = {
  mongoUrl: process.env.MONGO_URI,
  port: process.env.PORT,
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS,
  tokenSecret: process.env.TOKEN_SECRET,
  refreshTokenLife: process.env.REFRESH_TOKEN_LIFE,
  origin: process.env.ORIGIN,
  callbackURL: process.env.CALLBACK_URL,
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  cloudName: process.env.CLOUD_NAME,
  cloudSecret: process.env.CLOUD_SECRET,
  cloudKey: process.env.CLOUD_KEY,
};

export default config;
