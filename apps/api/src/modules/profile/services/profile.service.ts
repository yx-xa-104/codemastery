import { Injectable } from '@nestjs/common';
import { Tables } from '@shared/database/database.types';
import { ProfileRepository } from '../repositories/profile.repository';
import { BadgeWithDefinition } from '../interfaces/profile.interface';

@Injectable()
export class ProfileService {
  constructor(private profileRepository: ProfileRepository) {}

  async getProfile(userId: string): Promise<Tables<'profiles'>> {
    return this.profileRepository.findById(userId);
  }

  async updateProfile(
    userId: string,
    updates: {
      full_name?: string;
      bio?: string;
      avatar_url?: string;
      date_of_birth?: string;
      student_id?: string;
      class_code?: string;
    },
  ): Promise<Tables<'profiles'>> {
    return this.profileRepository.update(userId, updates);
  }

  async getMyBadges(userId: string): Promise<BadgeWithDefinition[]> {
    return this.profileRepository.findBadges(userId);
  }

  async getLearningActivity(
    userId: string,
    days = 30,
  ): Promise<Tables<'learning_activity'>[]> {
    const since = new Date();
    since.setDate(since.getDate() - days);
    return this.profileRepository.findLearningActivity(userId, since);
  }
}
