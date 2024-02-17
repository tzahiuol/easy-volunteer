import { Test, TestingModule } from '@nestjs/testing';
import { InstitutionPositionsController } from './institution_positions.controller';

describe('InstitutionPositionsController', () => {
  let controller: InstitutionPositionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InstitutionPositionsController],
    }).compile();

    controller = module.get<InstitutionPositionsController>(InstitutionPositionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
