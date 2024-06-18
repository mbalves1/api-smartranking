import { Player } from './interfaces/player.interface';
import { Controller, Post, Body, Get } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  async createUpdatePlayer(@Body() createPlayerDto: CreatePlayerDto) {
    await this.playersService.createUpdatePlayer(createPlayerDto);
  }

  @Get()
  async getPlayers(): Promise<Player[]> {
    return await this.playersService.getAllPlayers();
  }
}
