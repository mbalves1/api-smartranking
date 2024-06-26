import { UpdateCategoryDto } from './dtos/update-category.dto';
import { CreateCategoryDto } from './dtos/create-category.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async getAllCategorys(): Promise<Category[]> {
    return await this.categoryModel.find();
  }

  async getCategoryById(category: string): Promise<Category> {
    const existCategory = await this.categoryModel.findOne({ category });
    if (!existCategory) {
      throw new NotFoundException('Category not founded');
    }
    return existCategory;
  }

  async updateCategory(
    category: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<void> {
    const categoryFounded = await this.categoryModel.findOne({ category });
    if (!categoryFounded) {
      throw new NotFoundException('Category not founded');
    }
    await this.categoryModel.findOneAndUpdate({ category }, updateCategoryDto);
  }
}
