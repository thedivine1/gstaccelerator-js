export interface GSTAcceleratorConfig {
  apiKey: string
  baseUrl?: string
  timeout?: number
  maxRetries?: number
}

export interface TaxRates {
  igst: number
  cgst: number
  sgst: number
  cess: number
}

export interface ApplicableRate {
  intrastate: string
  interstate: string
}

export interface HSNResult {
  hsn_code: string
  description: string
  tax_rates: TaxRates
  applicable_rate: ApplicableRate
  notification_ref: string
  confidence: number
  needs_review: boolean
  condition_applied?: string
  condition_warning?: string
  last_updated?: string
}

export interface GSTINValidationResult {
  valid: boolean
  gstin: string
  state_code?: string
  state_name?: string
  pan?: string
  entity_type_code?: string
  error_reason?: string
}

export interface LookupOptions {
  supplyType?: 'B2B' | 'B2C'
  branded?: boolean
  saleValueInr?: number
  stateOfSupply?: string
}

export interface MetaResponse {
  total_hsn: number
  total_sac: number
  last_updated: string
  source: string
  db_version: string
}
