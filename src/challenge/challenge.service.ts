import { PlayersService } from './../players/players.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Challenge } from './interfaces/challenge.interface';

@Injectable()
export class ChallengeService {
  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
    private readonly playersService: PlayersService,
  )
  async createChallenge(
    createChallengeDto: CreateChallengeDto,
  ): Promise<Challenge> {
    const players = await this.playersService.getPlayersAll()

    createChallengeDto.players.map(playerDto => {
      const playerFilter = players.filter(player => player.id === playerDto.id)

      if (playerFilter.length === 0) {
        throw new BadRequestException('Player not found')
      }
    })
    
    return 'This action adds a new challenge';
  }

  async getPlayerChallenge(_id: any): Promise<Array<Challenge>> {
    const players = await this.playersService.getAllPlayers()
    const playerFilter = players.filter(player => player._id == _id)

    if (playerFilter.length == 0) {
      throw new BadRequestException('Player not found')
    }

    return await this.challengeModel.find()
      .where('players')
      .in(_id)
      .populate('requerer')
      .populate('players')
      .populate('match')
  }

  async getAllChallenges(): Promise<Array<Challenge>> {
    return await this.challengeModel.find()
      .populate('requerer')
      .populate('players')
      .populate('match')
  }

  findOne(id: number) {
    return `This action returns a #${id} challenge`;
  }

  update(id: number, updateChallengeDto: UpdateChallengeDto) {
    return `This action updates a #${id} challenge`;
  }

  remove(id: number) {
    return `This action removes a #${id} challenge`;
  }
}
