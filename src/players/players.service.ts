import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
// import { randomUUID } from 'node:crypto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  async createUpdatePlayer(createPlayerDto: CreatePlayerDto): Promise<void> {
    const { email } = createPlayerDto;
    const findPlayer = await this.playerModel.findOne({ email });

    console.log(findPlayer);

    if (findPlayer) {
      await this.update(createPlayerDto);
    } else {
      await this.create(createPlayerDto);
    }
  }

  async getAllPlayers(): Promise<Player[]> {
    return await this.playerModel.find();
  }

  async getPlayerByEmail(email: string): Promise<Player> {
    const findPlayer = await this.playerModel.findOne({ email });
    if (!findPlayer) {
      throw new NotFoundException('Player not found!');
    }
    return findPlayer;
  }

  private async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const createdPlayer = new this.playerModel(createPlayerDto);
    return await createdPlayer.save();
  }

  private async update(createPlayerDto: CreatePlayerDto): Promise<Player> {
    return await this.playerModel.findOneAndUpdate(
      { email: createPlayerDto.email },
      createPlayerDto,
    );
  }

  async deletePlayer(email: string): Promise<any> {
    const findPlayer = await this.playerModel.findOne({ email });
    if (!findPlayer) {
      throw new NotFoundException('Player not found!');
    }
    return await this.playerModel.deleteOne({ email });
  }
}
