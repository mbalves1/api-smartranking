import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayersModule } from './players/players.module';
import { CategorysModule } from './categorys/categorys.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://murilobalves1:XACPq5wGyq16WbYu@cluster0.jzsum4t.mongodb.net/smartranking?retryWrites=true&w=majority&appName=Cluster0',
    ),
    PlayersModule,
    CategorysModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
