import { CreateCategoryDto } from './dtos/create-category.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './interfaces/category.interface';

@Injectable()
export class CategorysService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const { category } = createCategoryDto;

    const categoryFounded = await this.categoryModel.findOne({ category });

    if (categoryFounded) {
      throw new BadRequestException('Category already exist');
    }

    const categoryCreate = new this.categoryModel(createCategoryDto);
    return await categoryCreate.save();
  }
}
