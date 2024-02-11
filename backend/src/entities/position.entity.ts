import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, ManyToMany, JoinTable, OneToOne, JoinColumn } from 'typeorm';
import { QuestionEntity } from './question.entity';
import { UserAnswersEntity } from './user_answers.entity';
import { SkillEntity } from './skill';
import { UserEntity } from './user.entity';
import { InstitutionPositionEntity } from './institution_position';

@Entity()
export class PositionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    
    @OneToOne(() => SkillEntity)
    @JoinColumn()
    requiredSkill: SkillEntity;

    @OneToMany(type => InstitutionPositionEntity, instpos => instpos.position, { onDelete: 'CASCADE' })
    institutionPositions: InstitutionPositionEntity[];

}