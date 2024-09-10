import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
} from "passport-jwt";
import passport from "passport";

const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error("Failed to find secret for Passport!");
}

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secret,
};

passport.use(
  new JwtStrategy(opts, (jwtPayload, done) => {
    try {
      return done(null, jwtPayload);
    } catch (err) {
      return done(err, false);
    }
  })
);

export default passport;
