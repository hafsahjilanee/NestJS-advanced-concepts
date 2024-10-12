import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';

@Module({
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagsModule implements OnApplicationBootstrap {
  constructor(private readonly moduleRef: ModuleRef) {}
  async onApplicationBootstrap() {
    // const tagService = await this.moduleRef.resolve(TagsService);
    // console.log('tagService: ', tagService);

    const contextId = ContextIdFactory.create();
    // const tagServices = await Promise.all([
    //   this.moduleRef.resolve(TagsService, contextId),
    //   this.moduleRef.resolve(TagsService, contextId),
    // ]);

    // console.log(tagServices[0] === tagServices[1]);

    this.moduleRef.registerRequestByContextId({ hello: 'world' }, contextId);
    const tagService = await this.moduleRef.resolve(TagsService, contextId);
    console.log('tagService: ', tagService);
  }
}
