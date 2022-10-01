import passport from 'passport';
import passportLocal from 'passport-local';
import passportGoogle from 'passport-google-oauth20';
import User from '../database/models/User.js';
import config from '../../config/default.js';

const LocalStrategy = passportLocal.Strategy;
const GoogleStrategy = passportGoogle.Strategy;

passport.use(
  new LocalStrategy(
    // {
    //     usernameField: 'email',
    //     passwordField: 'password',
    //   },
    async function (username, password, cb) {
      try {
        const isEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
          username
        );

        let user = null;
        if (isEmail) {
          user = await User.findOne({ email: username });
        } else {
          user = await User.findOne({ username });
        }

        if (!user) {
          return cb(null, false);
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
          return cb(null, false);
        }

        user = { id: user._id, role: user.role };
        return cb(null, user);
      } catch (error) {
        cb(error);
      }
    }
  )
);

passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(async function (id, cb) {
  try {
    const user = await User.findOne({ _id: id });
    cb(null, user);
  } catch (error) {
    cb(error);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: config.clientId,
      clientSecret: config.clientSecret,
      callbackURL: config.callbackURL,
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        const { name, email, image: picture, googleId: sub } = profile._json;

        console.log(profile._json);

        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            name,
            email,
            image: picture,
            googleId: sub,
          });
        }

        return cb(null, user);
      } catch (error) {
        cb(error);
      }
    }
  )
);
