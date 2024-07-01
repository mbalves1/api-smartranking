import { Player } from './interfaces/player.interface';
import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  UsePipes,
  ValidationPipe,
  Param,
  Put,
} from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { PlayersService } from './players.service';
import { ValidationsParamsPipe } from '../common/pipes/validation-params.pipe';
import { UpdatePlayerDto } from './dtos/update-player.dto';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createPlayer(
    @Body() createPlayerDto: CreatePlayerDto,
  ): Promise<Player> {
    return await this.playersService.createPlayer(createPlayerDto);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async updatePlayer(
    @Body() updatePlayerDto: UpdatePlayerDto,
    @Param('_id', ValidationsParamsPipe) _id: string,
  ): Promise<Player> {
    return await this.playersService.updatePlayer(_id, updatePlayerDto);
  }

  @Get()
  async getPlayersAll(): Promise<Player[]> {
    return await this.playersService.getAllPlayers();
  }

  @Get('/:_id')
  async getPlayer(
    @Param('_id', ValidationsParamsPipe) _id: string,
  ): Promise<Player> {
    if (_id) {
      return await this.playersService.getPlayerById(_id);
    }
  }

  @Delete('/:_id')
  async deletePlayer(
    @Param('_id', ValidationsParamsPipe) _id: string,
  ): Promise<void> {
    await this.playersService.deletePlayer(_id);
  }
}
