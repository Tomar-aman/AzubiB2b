import express from "express";
import dotenv from "dotenv";
import { Database } from "./utils/dbConnection";
import path from "path";
import emailService from "./utils/emailService";
import fileUpload from "express-fileupload";
import logger from "./utils/logger";
import setupGlobalCustomMiddleware from "./middleware";
import cors from "cors";
import router from "./router";

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

const PORT = process.env.PORT ?? 4000;

// database connection
const db = new Database(
  process.env.MONGODB_URI ?? "mongodb://0.0.0.0:27017/social-media",
);

// email service
(async () => {
  db.connect();
  await emailService.init();
  await emailService.verifyConnection();
})();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(process.cwd(), "./")));
app.use(express.static(path.join(process.cwd(), "./public")));

app.use('/qr', express.static(path.join(__dirname, '../static/qr')));

// Middleware to parse form data with express-fileupload
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
app.use(fileUpload());

// Setup custom middleware
setupGlobalCustomMiddleware(app);


app.use((_req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  res.setHeader("Access-Control-Expose-Headers", "x-access, x-refresh");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS",
  );
  next();
});

app.get("/", (_req, res) => {
  res.sendSuccess200Response("Yay!🚀", null);
});

// routes
router.forEach((route: any) => {
  app.use(`/api/v1${route.prefix}`, route.router);
});

app.listen(PORT, () => {
  logger.info(`Server is running 🚀🚀🚀🚀 http://localhost:${PORT}`);
});