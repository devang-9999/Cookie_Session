/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import session from 'express-session';  
import { NestFactory } from '@nestjs/core';  
import { AppModule } from './app.module';  
import passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(  
    session({  
      secret: 'yourSecretKey',  
      resave: false,  
      saveUninitialized: false,  
      cookie: { maxAge: 5 ,secure: false ,sameSite: 'strict',httpOnly: true}, 
    }),  
  );  
  app.enableCors({ origin: '*' ,
    credentials: true
  });
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(process.env.PORT ?? 5000);
}

void bootstrap();
