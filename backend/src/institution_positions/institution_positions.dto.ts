import { IsOptional, Max, Min, IsString, IsDateString,} from 'class-validator';


export class FilterInstitutionPositionsRequestDto {

    @IsString()
    @IsOptional()
    country_code?: string;
    

    @IsString()
    @IsOptional()
    city?: string;

    @IsDateString()
    @IsOptional()
    from?: string

    @IsDateString()
    @IsOptional()
    to?: string
}