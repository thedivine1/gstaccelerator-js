import type { GSTAccelerator } from '../client';
import type { HSNResult } from '../types';

export class HSNClient {
  constructor(private client: GSTAccelerator) {}

  async get(code: string): Promise<HSNResult> {
    return this.client.request<HSNResult>('GET', `/api/v1/hsn/${code}`);
  }
}
