import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
// import { randomUUID } from 'node:crypto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdatePlayerDto } from './dtos/update-player.dto';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  async createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const { email } = createPlayerDto;
    const findPlayer = await this.playerModel.findOne({ email });

    if (findPlayer) {
      throw new BadRequestException(
        `Player with email ${email} already exists`,
      );
    }

    const createdPlayer = new this.playerModel(createPlayerDto);
    return await createdPlayer.save();
  }

  async updatePlayer(
    _id: string,
    updatePlayerDto: UpdatePlayerDto,
  ): Promise<Player> {
    const findPlayer = await this.playerModel.findById(_id);
    if (!findPlayer) {
      throw new BadRequestException(`Player with id ${_id} not founded`);
    }
    return await this.playerModel.findOneAndUpdate({ _id }, updatePlayerDto);
  }

  async getAllPlayers(): Promise<Player[]> {
    return await this.playerModel.find();
  }

  async getPlayerById(_id: string): Promise<Player> {
    const findPlayer = await this.playerModel.findOne({ _id });
    if (!findPlayer) {
      throw new NotFoundException('Player not found!');
    }
    return findPlayer;
  }

  async deletePlayer(_id: string): Promise<any> {
    const findPlayer = await this.playerModel.findOne({ _id });

    if (!findPlayer) {
      throw new NotFoundException('Player not found!');
    }
    return await this.playerModel.deleteOne({ _id });
  }
}
