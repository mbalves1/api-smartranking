import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ChallengeStatus } from '../interfaces/challenge-status.enum';

export class ChallengeStatusValidationPipe implements PipeTransform {
  readonly statusAllowed = [
    ChallengeStatus.ACCEPT,
    ChallengeStatus.DENIED,
    ChallengeStatus.CANCEL,
  ];

  transform(value: any) {
    const status = value.status.toUpperCase();

    if (!this.isValidStatus(status)) {
      throw new BadRequestException(`Invalid status: ${status}`);
    }

    return value;
  }

  private isValidStatus(status: any) {
    const idx = this.statusAllowed.indexOf(status);
    return idx !== -1;
  }
}
