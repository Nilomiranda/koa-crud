import { CreateDateColumn, DeepPartial, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

export class BaseEntity<TargetEntity> {
  constructor(data: DeepPartial<TargetEntity>) {
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
