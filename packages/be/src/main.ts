import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import { AppModule } from "./app.module";

const PORT = process.env.PORT ?? 3000;
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.setGlobalPrefix("api");
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  // Serve static files from Angular build
  if (process.env.NODE_ENV === "production") {
    app.useStaticAssets(join(__dirname, "../../fe/dist/fe/browser"));
    app.setBaseViewsDir(join(__dirname, "../../fe/dist/fe/browser"));
    // Fallback to index.html for SPA routing
    app.use((req, res, next) => {
      if (!req.path.startsWith("/api")) {
        res.sendFile(join(__dirname, "../../fe/dist/fe/browser/index.html"));
      } else {
        next();
      }
    });
  }

  await app.listen(PORT);
}
bootstrap().then(() => console.log(`Server is running on port ${PORT}`));
