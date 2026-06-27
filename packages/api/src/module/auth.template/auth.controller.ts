import { type Request, type Response } from "express";
import logger from "../../utils/logger";
import { UserService } from "../user.template/user.service";
import { AuthService } from "./auth.service";
import JwtService from "../../utils/jwt";
import EmailService from "../../utils/emailService";
class AuthController {
  private readonly userService: UserService;
  private readonly authService: AuthService;

  constructor() {
    this.userService = new UserService();
    this.authService = new AuthService();
  }

  private readonly setAccessTokenToHeader = (
    res: Response,
    accessToken: string,
  ) => {
    res.setHeader("x-access", accessToken);
  };

  private readonly setRefreshTokenToHeader = (
    res: Response,
    accessToken: string,
  ) => {
    res.setHeader("x-refresh", accessToken);
  };

  public createUser = async (req: Request, res: Response) => {
    try {
      const user = await this.userService.create(req.body);
      const { accessToken, refreshToken } =
        await this.authService.createSession({
          email: req.body.email,
          password: req.body.password,
          ip: req.ip ?? "",
          userAgent: req.headers["user-agent"] ?? "",
        });
      this.setAccessTokenToHeader(res, accessToken);
      this.setRefreshTokenToHeader(res, refreshToken);
      res.sendCreated201Response("User created successfully", { user });
    } catch (error) {
      logger.error(error);
      res.sendErrorResponse("Error creating user", error);
    }
  };

  public createSession = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const user = await this.userService.findOneWithOptions({ email });
      if (!user) {
        throw new Error("User not found");
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new Error("Invalid password");
      }

      const { accessToken, refreshToken } =
        await this.authService.createSession({
          email,
          password,
          ip: req.ip ?? "",
          userAgent: req.headers["user-agent"] ?? "",
        });

      this.setAccessTokenToHeader(res, accessToken);
      this.setRefreshTokenToHeader(res, refreshToken);
      res.sendSuccess200Response("User logged in successfully", {
        user,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      res.sendUnauthorized401Response(
        "Email address or password is incorrect",
        error,
      );
    }
  };

  public refreshAccessToken = async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;

      // Verify refresh token
      const accessToken =
        await this.authService.getAccessTokenFromRefreshToken(refreshToken);

      if (!accessToken) {
        throw new Error("Invalid refresh token");
      }

      this.setAccessTokenToHeader(res, accessToken);
      res.sendSuccess200Response("Access token refreshed successfully", {
        accessToken,
      });
    } catch (error) {
      res.sendUnauthorized401Response("Error refreshing access token", error);
    }
  };

  public logout = async (req: Request, res: Response) => {
    if (!req.sessionId) {
      return;
    }
    try {
      await this.authService.logoutSession(req.sessionId);
      res.sendNoContent204Response();
    } catch (error) {
      res.sendBadRequest400Response("Error logging out user", error);
    }
  };

  public getForPasswordLink = async (req: Request, res: Response) => {
    try {
      const { email } = req.params;

      const user = await this.userService.findOneWithOptions({ email });
      if (!user) {
        throw new Error("Not found");
      }

      const jwtService = new JwtService();

      const resetToken = jwtService.sign({ id: user._id }, { expiresIn: "1h" });
      const resetLink = `${process.env.SUPERADMIN_URL}reset-password?token=${resetToken}`;
      const emailOptions: any = {
        // companyId: user._id,
        to: user.email,
        subject: "Password Reset Request",
        html: `Click the following link to reset your password: <a href="${resetLink}">${resetLink}</a>`,
      };
      await EmailService.sendEmail(emailOptions);
      res.sendSuccess200Response(
        "Password reset email sent successfully",
        null,
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      logger.error("getForPasswordLink", error);
      res.sendErrorResponse("Error ", error);
    }
  };

  public resetPassword = async (req: Request, res: Response) => {
    try {
      const { token, password } = req.body;

      if (!token || !password) {
        throw new Error("Token and password are required");
      }

      const jwtService = new JwtService();
      const decoded: any = jwtService.verify(token);
      const userId = decoded.id;

      const user = await this.userService.findOneWithOptions({
        _id: userId,
      });

      if (!user) {
        throw new Error("User not found");
      }

      if (password) {
        user.password = password;
      }
      await user.save();
      const { accessToken, refreshToken } =
        await this.authService.createSession({
          email: user.email,
          password,
          ip: req.ip ?? "",
          userAgent: req.headers["user-agent"] ?? "",
        });

      this.setAccessTokenToHeader(res, accessToken);
      this.setRefreshTokenToHeader(res, refreshToken);

      res.sendCreated201Response("Password reset successfully", {
        accessToken,
        refreshToken,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      logger.error("resetPassword", error);
      res.sendErrorResponse("resetPassword ", error);
    }
  };
}

export default AuthController;
