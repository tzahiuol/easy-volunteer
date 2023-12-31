import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany } from 'typeorm';
import { UserAnswers } from './user_answers.entity';
import { Institution } from './institution.entity';
import { InstitutionPositionTimeSlot } from './institution_position_timeslot';

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  lastName: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(type => UserAnswers, userAnswers => userAnswers.user)
  userAnswers: UserAnswers[];

  @OneToMany(type => Institution, institution => institution.owner)
  ownedInstitutions: Institution[];

  @ManyToMany(type => InstitutionPositionTimeSlot)
  institutionPositionTimeSlots: InstitutionPositionTimeSlot[];
}