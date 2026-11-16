import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './activity.entity.js';

@Injectable()
export class ActivityService {
  constructor(@InjectRepository(Activity) private readonly repo: Repository<Activity>) {}

  add(who: string, role: string, action: string) {
    return this.repo.save(this.repo.create({ who, role, action }));
  }

  // 30 hoạt động mới nhất
  findAll() {
    return this.repo.find({ order: { id: 'DESC' }, take: 30 });
  }
}
