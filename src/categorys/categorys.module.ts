import { Module } from '@nestjs/common';
import { CategorysController } from './categorys.controller';
import { CategorysService } from './categorys.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema } from './interfaces/category.schema';
import { PlayersModule } from 'src/players/players.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Category', schema: CategorySchema }]),
    PlayersModule,
  ],
  controllers: [CategorysController],
  providers: [CategorysService],
  exports: [CategorysService],
})
export class CategorysModule {}
