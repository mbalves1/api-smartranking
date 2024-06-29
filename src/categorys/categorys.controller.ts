import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { Category } from './interfaces/category.interface';
import { CategorysService } from './categorys.service';
import { UpdateCategoryDto } from './dtos/update-category.dto';

interface PlayerCategoryParams {
  category: string;
  idPlayer: string;
}

@Controller('api/v1/categorys')
export class CategorysController {
  constructor(private readonly categoryService: CategorysService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return await this.categoryService.createCategory(createCategoryDto);
  }

  @Get()
  async getAllCategorys(): Promise<Category[]> {
    return await this.categoryService.getAllCategorys();
  }

  @Get('/:category')
  async getCategoryById(
    @Param('category') category: string,
  ): Promise<Category> {
    return await this.categoryService.getCategoryById(category);
  }

  @Put('/:category')
  @UsePipes(ValidationPipe)
  async updateCategory(
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Param('category') category: string,
  ): Promise<void> {
    return await this.categoryService.updateCategory(
      category,
      updateCategoryDto,
    );
  }

  @Post('/:category/players/:idPlayer')
  async addPlayerCategory(
    @Param() params: PlayerCategoryParams,
  ): Promise<void> {
    return await this.categoryService.addPlayerCategory(params);
  }
}
