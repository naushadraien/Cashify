import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { patchNestJsSwagger } from "nestjs-zod";
import { AppModule } from "./app.module";

async function bootstrap() {
  // MUST run before SwaggerModule.createDocument(). @nestjs/swagger normally
  // reads @ApiProperty()-decorated class fields to build schemas; nestjs-zod
  // DTOs have no such decorators, so without this patch every zod-backed DTO
  // (RegisterDto, MobileGoogleLoginDto, etc.) renders as an empty `{}` object
  // in Swagger UI — no fields, no types, no validation constraints. This
  // patches @nestjs/swagger's schema factory to read the zod schema each
  // createZodDto() class carries instead.
  patchNestJsSwagger();

  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.enableCors({
    origin: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Auth Boilerplate API")
    .setDescription(
      "Google / Facebook / Apple / GitHub OAuth for web + mobile, with JWT refresh-token rotation",
    )
    .setVersion("1.0")
    .addBearerAuth()
    .addTag("auth")
    .addTag("users")
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("docs", app, document);

  const port = config.get<number>("port")!;
  await app.listen(port);
  console.log(`API running on http://localhost:${port}`);
  console.log(`Swagger docs at http://localhost:${port}/docs`);
}

bootstrap();
