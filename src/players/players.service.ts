import { Injectable, Logger } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { randomUUID } from 'node:crypto';

@Injectable()
export class PlayersService {
  private players: Player[] = [];
  private readonly logger = new Logger(PlayersService.name);

  async createUpdatePlayer(createPlayerDto: CreatePlayerDto): Promise<void> {
    await this.create(createPlayerDto);
  }

  async getAllPlayers(): Promise<Player[]> {
    return await this.players;
  }

  private create(createPlayerDto: CreatePlayerDto): void {
    const { name, email, phoneNumber } = createPlayerDto;
    const player: Player = {
      _id: randomUUID(),
      name,
      email,
      phoneNumber,
      ranking: 'A',
      positionRanking: 1,
      urlPhoto: 'www.google.com.br/foto123.jpg',
    };

    this.players.push(player);
    console.log('player', this.players);
  }
}
