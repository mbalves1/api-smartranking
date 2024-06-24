import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';

export class PlayersValidationsParamsPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException(
        `Invalid request, ${metadata.data} should be defined`,
      );
    }
    // console.log(value, metadata.type);

    return value;
  }
}
