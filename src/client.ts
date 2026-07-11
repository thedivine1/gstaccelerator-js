import crossFetch from 'cross-fetch';
import { GSTAcceleratorConfig, LookupOptions, MetaResponse } from './types';
import { AuthenticationError, NotFoundError, ValidationError, RateLimitError, ServerError, GSTAcceleratorError } from './errors';
import { HSNClient } from './resources/hsn';
import { SACClient } from './resources/sac';
import { GSTINClient } from './resources/gstin';

const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
const fetchImpl = typeof fetch !== 'undefined' ? fetch : crossFetch;

export class GSTAccelerator {
  private apiKey: string;
  private baseUrl: string;
  private timeout: number;
  public maxRetries: number;
  
  public hsn: HSNClient;
  public sac: SACClient;
  public gstin: GSTINClient;

  constructor(config: GSTAcceleratorConfig) {
    this.apiKey = config.apiKey || '';
    this.baseUrl = config.baseUrl || 'https://gstaccelerator.in';
    this.timeout = config.timeout || 30000;
    this.maxRetries = config.maxRetries ?? 3;
    
    this.hsn = new HSNClient(this);
    this.sac = new SACClient(this);
    this.gstin = new GSTINClient(this);
  }

  async request<T>(method: string, path: string, body?: any): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    };

    if (!isBrowser) {
      headers['User-Agent'] = `gstaccelerator-js/0.1.0`;
    }

    let attempt = 0;
    
    while (attempt <= this.maxRetries) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        
        const response = await fetchImpl(url, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (response.ok) {
          const text = await response.text();
          return text ? JSON.parse(text) : {} as T;
        }

        const errText = await response.text();
        const errJson = errText ? JSON.parse(errText) : {};

        if (response.status === 401) {
          throw new AuthenticationError('Authentication failed', 401, errJson);
        } else if (response.status === 404) {
          throw new NotFoundError('Resource not found', 404, errJson);
        } else if (response.status === 400 || response.status === 422) {
          throw new ValidationError('Validation error', response.status, errJson);
        } else if (response.status === 429) {
          if (attempt < this.maxRetries) {
            const retryAfter = response.headers.get('Retry-After');
            const delay = retryAfter ? parseInt(retryAfter, 10) * 1000 : 1000 * Math.pow(2, attempt);
            await new Promise(resolve => setTimeout(resolve, delay));
            attempt++;
            continue;
          }
          const retryAfter = response.headers.get('Retry-After');
          throw new RateLimitError('Rate limit exceeded', 429, errJson, retryAfter ? parseInt(retryAfter, 10) : undefined);
        } else if (response.status >= 500) {
          if (attempt < this.maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
            attempt++;
            continue;
          }
          throw new ServerError(`Server error: ${response.status}`, response.status, errJson);
        }

        throw new GSTAcceleratorError(`HTTP Error ${response.status}`, response.status, errJson);
      } catch (err: any) {
        if (err.name === 'AbortError') {
          if (attempt < this.maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
            attempt++;
            continue;
          }
          throw new GSTAcceleratorError('Request timeout', 0, {});
        }
        
        if (err instanceof GSTAcceleratorError) {
          throw err;
        }

        if (attempt < this.maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
          attempt++;
          continue;
        }
        throw new GSTAcceleratorError(err.message || 'Unknown error', 0, {});
      }
    }
    
    throw new GSTAcceleratorError('Max retries exceeded', 0, {});
  }

  async lookup(description: string, options?: LookupOptions): Promise<any[]> {
    const payload: any = { description };
    if (options?.supplyType) payload.supply_type = options.supplyType;
    if (options?.branded !== undefined) payload.branded = options.branded;
    if (options?.saleValueInr !== undefined) payload.sale_value_inr = options.saleValueInr;
    if (options?.stateOfSupply) payload.state_of_supply = options.stateOfSupply;
    
    return this.request<any[]>('POST', '/api/v1/lookup', payload);
  }

  async autocomplete(query: string): Promise<string[]> {
    const params = new URLSearchParams({ q: query });
    return this.request<string[]>('GET', `/api/v1/autocomplete?${params.toString()}`);
  }

  async bulk(descriptions: string[]): Promise<any[][]> {
    return this.request<any[][]>('POST', '/api/v1/bulk', { descriptions });
  }

  async health(): Promise<Record<string, unknown>> {
    return this.request<Record<string, unknown>>('GET', '/api/v1/health');
  }

  async meta(): Promise<MetaResponse> {
    return this.request<MetaResponse>('GET', '/api/v1/meta');
  }
}
