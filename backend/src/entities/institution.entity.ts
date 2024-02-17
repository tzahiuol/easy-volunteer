import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, ManyToMany, JoinTable, Unique } from 'typeorm';
import { QuestionEntity } from './question.entity';
import { UserAnswersEntity } from './user_answers.entity';
import { SkillEntity } from './skill';
import { UserEntity } from './user.entity';
import { PositionEntity } from './position.entity';
import { InstitutionPositionEntity } from './institution_position';

@Entity({name:"institutions"})
export class InstitutionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Unique("name",["name"])
    name: string;

    @Column({type: 'blob', nullable: true})
    logo: string

    @ManyToOne(type => UserEntity, user => user.ownedInstitutions, { onDelete: 'CASCADE' })
    owner: UserEntity;

    @OneToMany(type => InstitutionPositionEntity, instpos => instpos.institution, { onDelete: 'CASCADE' })
    institutionPositions: InstitutionPositionEntity[];

}