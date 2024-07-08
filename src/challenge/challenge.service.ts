import { PlayersService } from './../players/players.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Challenge, Match } from './interfaces/challenge.interface';
import { CategorysService } from 'src/categorys/categorys.service';
import { ChallengeStatus } from './interfaces/challenge-status.enum';

@Injectable()
export class ChallengeService {
  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
    @InjectModel('Match') private readonly matchModel: Model<Match>,
    private readonly playersService: PlayersService,
    private readonly categoryService: CategorysService,
  ) {}

  async createChallenge(
    createChallengeDto: CreateChallengeDto,
  ): Promise<Challenge> {
    const players = await this.playersService.getAllPlayers();

    createChallengeDto.players.map((playerDto) => {
      const playerFilter = players.filter(
        (player) => player.id === playerDto.id,
      );

      if (playerFilter.length === 0) {
        throw new BadRequestException('Player not found');
      }
    });

    const requererIsPlayerMatch = await createChallengeDto.players.filter(
      (player) => player.id == createChallengeDto.requester,
    );

    if (requererIsPlayerMatch.length === 0) {
      throw new BadRequestException('Requester is not a player');
    }

    const categoryPlayer = await this.categoryService.consultPlayerCategory(
      createChallengeDto.requester,
    );

    if (!categoryPlayer) {
      throw new BadRequestException('Requerer must belong to the category');
    }

    const challengeCreated = new this.challengeModel(createChallengeDto);
    challengeCreated.category = categoryPlayer.category;
    challengeCreated.dateHourRequest = new Date();

    challengeCreated.status = ChallengeStatus.PENDING;

    return await challengeCreated.save();
  }

  async getPlayerChallenge(_id: any): Promise<Array<Challenge>> {
    const players = await this.playersService.getAllPlayers();
    const playerFilter = players.filter((player) => player._id == _id);

    if (playerFilter.length == 0) {
      throw new BadRequestException('Player not found');
    }

    return await this.challengeModel
      .find()
      .where('players')
      .in(_id)
      .populate('requerer')
      .populate('players')
      .populate('match');
  }

  async getAllChallenges(): Promise<Array<Challenge>> {
    return await this.challengeModel
      .find()
      .populate('requerer')
      .populate('players')
      .populate('match');
  }

  async consultSinglePlayerChallenge(_id: any): Promise<Array<Challenge>> {
    const players = await this.playersService.getAllPlayers();
    const playersFilter = players.filter((player) => player._id == _id);

    if (playersFilter.length == 0) {
      throw new BadRequestException(`Player id ${_id} not found`);
    }

    return await this.challengeModel
      .find()
      .where('players')
      .in(_id)
      .populate('requerer')
      .populate('players')
      .populate('match');
  }

  async updateChallenge(
    _id: string,
    updateChallengeDto: UpdateChallengeDto,
  ): Promise<void> {
    const challengeFind = await this.challengeModel.findById(_id);
    if (!challengeFind) {
      throw new NotFoundException(`Challenge ${_id} not found`);
    }
    if (updateChallengeDto.status) {
      challengeFind.dateHourResponse = new Date();
    }
    challengeFind.status = updateChallengeDto.status;
    challengeFind.dateHourChallenge = updateChallengeDto.dateHourChallenge;

    await this.challengeModel.findOneAndUpdate({ _id }, { challengeFind });
  }

  update(id: number, updateChallengeDto: UpdateChallengeDto) {
    return `This action updates a #${id} challenge`;
  }

  remove(id: number) {
    return `This action removes a #${id} challenge`;
  }
}
