import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from 'config';
import { EntityResolver } from './entities.resolver';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        type: 'mysql',
        ...dbConfig.mysql,
        entities: EntityResolver(),
        synchronize: true,
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class TypeOrmConfigModule {}
