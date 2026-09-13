declare module "passport-apple" {
  import { Strategy as PassportStrategy } from "passport-strategy";

  interface AppleStrategyOptions {
    clientID: string;
    teamID: string;
    keyID: string;
    privateKeyString?: string;
    privateKeyPath?: string;
    callbackURL: string;
    scope?: string[];
    passReqToCallback?: boolean;
  }

  class Strategy extends PassportStrategy {
    constructor(
      options: AppleStrategyOptions,
      verify: (...args: any[]) => void,
    );
  }

  export = Strategy;
}
