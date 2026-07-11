import type { GSTAccelerator } from '../client';

export class SACClient {
  constructor(private client: GSTAccelerator) {}

  async get(code: string): Promise<any> {
    return this.client.request<any>('GET', `/api/v1/sac/${code}`);
  }
}
