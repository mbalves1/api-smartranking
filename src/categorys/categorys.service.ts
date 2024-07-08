import { PlayersService } from './../players/players.service';
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
    private readonly playersService: PlayersService,
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
    return await this.categoryModel.find().populate('players');
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

  async addPlayerCategory(params: any): Promise<void> {
    const { category, idPlayer } = params;

    const categoryFounded: any = await this.categoryModel.findOne({ category });
    const playerAlreadyExists = await this.categoryModel
      .find({ category })
      .where('players')
      .in(idPlayer);

    await this.playersService.getPlayerById(idPlayer);

    if (!categoryFounded) {
      throw new BadRequestException(`Category ${category} not founded`);
    }

    if (playerAlreadyExists.length > 0) {
      throw new BadRequestException(
        `Player with ${idPlayer} already exists in category ${category}`,
      );
    }

    categoryFounded.players.push(idPlayer);
    await this.categoryModel.findOneAndUpdate({ category }, categoryFounded);
  }

  async consultPlayerCategory(idPlayer: any): Promise<Category> {
    const players = await this.playersService.getAllPlayers();

    const playerFilter = players.filter((player) => player._id == idPlayer);
    if (playerFilter.length == 0) {
      throw new BadRequestException('Player not founded');
    }

    return await this.categoryModel.findOne().where('players').in(idPlayer);
  }
}
