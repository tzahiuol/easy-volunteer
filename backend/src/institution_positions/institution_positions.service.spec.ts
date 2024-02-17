import { Test, TestingModule } from '@nestjs/testing';
import { InstitutionPositionsService } from './institution_positions.service';

describe('InstitutionPositionsService', () => {
  let service: InstitutionPositionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InstitutionPositionsService],
    }).compile();

    service = module.get<InstitutionPositionsService>(InstitutionPositionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
