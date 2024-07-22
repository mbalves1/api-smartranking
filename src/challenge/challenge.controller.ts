import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { Challenge } from './interfaces/challenge.interface';
import { ChallengeStatusValidationPipe } from './pipes/challenge-status-validation.pipe';
import { AssignChallengeMatchDto } from './dto/assign-challenge.dto';

@Controller('api/v1/challenge')
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createChallenge(
    @Body() createChallengeDto: CreateChallengeDto,
  ): Promise<Challenge> {
    return await this.challengeService.createChallenge(createChallengeDto);
  }

  @Get()
  async getChallenges(
    @Query('idPlayer') _id: string,
  ): Promise<Array<Challenge>> {
    return _id
      ? await this.challengeService.consultSinglePlayerChallenge(_id)
      : await this.challengeService.getAllChallenges();
  }

  @Put('/:challenge')
  async updateChallenge(
    @Body(ChallengeStatusValidationPipe) updateChallengeDto: UpdateChallengeDto,
    @Param('challenge') _id: string,
  ): Promise<void> {
    await this.challengeService.updateChallenge(_id, updateChallengeDto);
  }

  @Post('/:challenge/match/')
  async assignMatchChallenge(
    @Body(ValidationPipe) assignChallengeMatchDto: AssignChallengeMatchDto,
    @Param('challenge') _id: string,
  ): Promise<void> {
    return await this.challengeService.assignChallengeMatch(
      _id,
      assignChallengeMatchDto,
    );
  }

  @Delete('/:id')
  async deleteChallenge(@Param('_id') _id: string): Promise<void> {
    await this.challengeService.deleteChallenge(_id);
  }
}
