import { Document } from 'mongoose';
import { ChallengeStatus } from './challenge-status.enum';
import { Player } from 'src/players/interfaces/player.interface';

export interface Challenge extends Document {
  dateHourChallenge: Date;
  status: ChallengeStatus;
  dateHourRequest: Date;
  dateHourResponse: Date;
  requerer: Player;
  category: string;
  players: Array<Player>;
  match: Match;
}

export interface Match extends Document {
  category: string;
  players: Array<Player>;
  def: Player;
  result: Array<Result>;
}

export interface Result {
  set: string;
}
