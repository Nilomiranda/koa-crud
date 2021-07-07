import { Column, Entity } from 'typeorm'
import { BaseEntity } from '../_common/base.entity'

@Entity()
export class User extends BaseEntity<User> {
  @Column({ type: 'varchar' })
  name: string;
}
