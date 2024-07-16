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
import { AssignChallengeMatchDto } from './dto/assign-challenge.dto';

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
        (player) => player.id === playerDto._id,
      );

      if (playerFilter.length === 0) {
        throw new BadRequestException('Player not found');
      }
    });

    const requererIsPlayerMatch = await createChallengeDto.players.filter(
      (player) => player._id === createChallengeDto.requester,
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
    console.log(challengeCreated);

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

  async assignChallengeMatch(
    _id: string,
    assignChallengeMatchDto: AssignChallengeMatchDto,
  ): Promise<void> {
    const challengFind = await this.challengeModel.findById(_id);

    if (!challengFind) {
      throw new BadRequestException('Challenge not create');
    }

    //const playerFilter = challengFind.players.filter(
    //(player) => player._id === assignChallengeMatchDto.def,
    //);

    //if (playerFilter.length == 0) {
    //throw new BadRequestException('Winner not belong to challenge');
    //    }

    const matchCreated = new this.matchModel(assignChallengeMatchDto);
    matchCreated.category = challengFind.category;
    matchCreated.players = challengFind.players;
    const result = await matchCreated.save();

    challengFind.status = ChallengeStatus.REALIZED;
    // challengFind.match = result._id;
    console.log(result);
    try {
      await this.challengeModel.findOneAndUpdate({ _id }, { challengFind });
    } catch (error) {
      await this.matchModel.deleteOne({ _id: result._id });
      throw new BadRequestException(`Challenge ${_id} not add`);
    }
  }

  async deleteChallenge(_id: string): Promise<void> {
    const challengeFind = await this.challengeModel.findById(_id);
    if (!challengeFind) {
      throw new BadRequestException('Challenge not found!');
    }
    await this.challengeModel.findOneAndUpdate({ _id }, { challengeFind });
  }
}
