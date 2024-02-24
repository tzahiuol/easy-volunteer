import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany } from 'typeorm';
import { UserAnswersEntity } from './user_answers.entity';
import { InstitutionEntity } from './institution.entity';
import { InstitutionPositionTimeSlotEntity } from './institution_position_timeslot';

@Entity({name: 'users'})
export class UserEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({select: false})
  password: string;

  @Column({select: false} )
  salt: string

  @Column()
  lastName: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(type => UserAnswersEntity, userAnswers => userAnswers.user, { onDelete: 'CASCADE' })
  userAnswers: UserAnswersEntity[];

  @OneToMany(type => InstitutionEntity, institution => institution.owner, { onDelete: 'CASCADE' })
  ownedInstitutions: InstitutionEntity[];

  @ManyToMany(type => InstitutionPositionTimeSlotEntity)
  institutionPositionTimeSlots: InstitutionPositionTimeSlotEntity[];
}