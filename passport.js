const passport = require("passport");
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWt = require("passport-jwt").ExtractJwt;

require("dotenv").config();


passport.use(
  new JWTstrategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJWt.fromAuthHeaderAsBearerToken(),
    },
    async (payload, done) => {
        
      try {
        return done(null, payload.user); // req.user = payload.user
      } catch (error) {
        done(error);
      }
    }
  )
);

module.exports = {passport}
