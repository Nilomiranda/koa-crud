import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntity } from '../_common/base.entity'
import { User } from '../user/user.entity'

@Entity()
export class Photo extends BaseEntity<Photo> {
  @Column({ type: 'varchar' })
  url: string;

  @Column({ type: 'varchar' })
  description: string;

  @ManyToOne(() => User, user => user.photos, { onDelete: 'CASCADE', nullable: false })
  user: User
}
