import * as jwt from "jsonwebtoken";
import logger from "./logger";
class JwtService {
  private get secret(): string {
    const s = process.env.JWT_SECRET ?? "secret";
    if (!s) {
      logger.error("'JWT_SECRET is required in .env");
    }
    return s;
  }

  sign(payload: any, options?: Omit<jwt.SignOptions, "algorithm">) {
    return jwt.sign(payload, this.secret, options);
  }

  verify(token: string) {
    return jwt.verify(token, this.secret);
  }
}
export default JwtService;
