import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import PocketBase from 'pocketbase';

@Injectable()
export class PocketbaseService implements OnModuleInit {
  private pb: PocketBase;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.pb = new PocketBase(
      this.configService.get<string>('POCKETBASE_URL') || 'http://localhost:8090'
    );
  }

  // Metody uwierzytelniania
  async register(email: string, password: string, passwordConfirm: string, name: string) {
    try {
      const user = await this.pb.collection('users').create({
        email,
        password,
        passwordConfirm,
        name,
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      return await this.pb.collection('users').authWithPassword(email, password);
    } catch (error) {
      throw error;
    }
  }

  // Metody dla podpisów
  async getSignatures() {
    try {
      const records = await this.pb.collection('signatures').getList(1, 50, {
        expand: 'user',
      });
      
      return records.items.map(record => {
        // Maskowanie emaili jeśli podpis jest publiczny
        if (record.expand?.user && record.public_display) {
          const email = record.expand.user.email;
          record.expand.user.email = this.maskEmail(email);
        } else if (!record.public_display) {
          // Jeśli podpis nie jest publiczny, ukryj dane użytkownika
          record.expand = { user: { name: 'Anonim', email: '' } };
        }
        return record;
      });
    } catch (error) {
      throw error;
    }
  }

  async createSignature(userId: string, agreeCheckbox: boolean, publicDisplay: boolean) {
    try {
      return await this.pb.collection('signatures').create({
        user: userId,
        agree_checkbox: agreeCheckbox,
        public_display: publicDisplay,
      });
    } catch (error) {
      throw error;
    }
  }

  async getUserSignature(userId: string) {
    try {
      const records = await this.pb.collection('signatures').getList(1, 1, {
        filter: `user = "${userId}"`,
      });
      return records.items.length > 0 ? records.items[0] : null;
    } catch (error) {
      throw error;
    }
  }

  async deleteSignature(signatureId: string) {
    try {
      return await this.pb.collection('signatures').delete(signatureId);
    } catch (error) {
      throw error;
    }
  }

  // Pomocnicze metody
  private maskEmail(email: string): string {
    const [username, domain] = email.split('@');
    if (username.length <= 2) {
      return `${username[0]}*@${domain}`;
    }
    return `${username[0]}${this.generateAsterisks(username.length - 2)}${username[username.length-1]}@${domain}`;
  }

  private generateAsterisks(length: number): string {
    return '*'.repeat(Math.min(length, 5));
  }
} 