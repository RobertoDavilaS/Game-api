import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { envs } from './config/envs';
import { GamesModule } from 'games/games.module';



@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: envs.DATABASE_HOST,
      port: envs.DATABASE_PORT,
      username: envs.DATABASE_USERNAME,
      password: envs.DATABASE_PASSWORD,
      database: envs.DATABASE_NAME,
      autoLoadModels: true,
      sync: {force: true},
      synchronize: true,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    }),
    GamesModule, 
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}