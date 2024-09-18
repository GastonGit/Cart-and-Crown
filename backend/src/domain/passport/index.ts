import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
} from "passport-jwt";
import passport, { PassportStatic } from "passport";

let passportStatic: PassportStatic | null = null;

export function getPassport() {
  if (!passportStatic) {
    throw new Error("Passport is not loaded!");
  }
  return passportStatic;
}

export function loadPassport() {
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

  passportStatic = passport;
  console.log("Loaded passport");
}
