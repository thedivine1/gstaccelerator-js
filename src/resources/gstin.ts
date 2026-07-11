import type { GSTAccelerator } from '../client';
import type { GSTINValidationResult } from '../types';

export class GSTINClient {
  constructor(private client: GSTAccelerator) {}

  async validate(gstin: string): Promise<GSTINValidationResult> {
    return this.client.request<GSTINValidationResult>('GET', `/api/v1/gstin/${gstin}/validate`);
  }

  async state(gstin: string): Promise<any> {
    return this.client.request<any>('GET', `/api/v1/gstin/${gstin}/state`);
  }

  async pan(gstin: string): Promise<any> {
    return this.client.request<any>('GET', `/api/v1/gstin/${gstin}/pan`);
  }
}
