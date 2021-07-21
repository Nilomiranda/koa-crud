import { Column, Entity, OneToMany } from 'typeorm'
import { BaseEntity } from '../_common/base.entity'
import { Photo } from '../photo/photo.entity'

@Entity()
export class  User extends BaseEntity<User> {
  @Column({ type: 'varchar' })
  name: string;

  @OneToMany(() => Photo, photo => photo.user, { nullable: true })
  photos: Photo[]
}
