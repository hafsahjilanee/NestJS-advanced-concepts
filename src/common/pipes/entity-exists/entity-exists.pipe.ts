import {
  ArgumentMetadata,
  Inject,
  Injectable,
  PipeTransform,
  Type,
} from '@nestjs/common';

export function EntityExistsPipe(entityCis: Type): Type<PipeTransform> {
  @Injectable()
  class EntityExistsPipeCIs implements PipeTransform {
    constructor(
      @Inject(entityCis)
      private entityRepository: { exists(condition: unknown): Promise<void> },
    ) {}

    async transform(value: any, metadata: ArgumentMetadata) {
      await this.entityRepository.exists({ where: { id: value } }); //throw if entity does not exist
      return value;
    }
  }
  return EntityExistsPipeCIs;
}
