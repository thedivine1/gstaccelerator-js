import type { GSTAccelerator } from '../client';

export interface InvoiceItem {
  /** HSN code, e.g. "61099090" */
  hsn_code: string;
  /** Quantity of the item (defaults to 1.0 if omitted) */
  quantity?: number;
  /** Unit rate / price in INR (must provide either rate or amount) */
  rate?: number;
  /** Total line amount in INR (must provide either rate or amount) */
  amount?: number;
}

export interface ClassifiedItem {
  hsn_code: string;
  quantity: number;
  rate: number;
  base_amount: number;
  cgst_amount: number;
  sgst_amount: number;
  igst_amount: number;
  cess_amount: number;
  total_tax_amount: number;
  total_amount: number;
  item_type: string;
}

export interface InvoiceClassifyResult {
  /** "intrastate" when seller and buyer are in the same state, "interstate" otherwise */
  transaction_type: 'intrastate' | 'interstate';
  items: ClassifiedItem[];
  total_base_amount: number;
  total_cgst_amount: number;
  total_sgst_amount: number;
  total_igst_amount: number;
  total_cess_amount: number;
  total_tax_amount: number;
  grand_total: number;
}

export class InvoiceClient {
  constructor(private client: GSTAccelerator) {}

  /**
   * Classify invoice line items as CGST+SGST (intrastate) or IGST (interstate)
   * and return a complete per-item + document-level tax breakdown.
   *
   * @param sellerState  Seller's state — full name ("Maharashtra"), abbreviation
   *                     ("MH"), or 2-digit GST code ("27").
   * @param buyerState   Buyer's state — same formats accepted.
   * @param items        Array of line items with hsn_code, quantity, and rate.
   *
   * @example
   * ```ts
   * const result = await gst.invoice.classify(
   *   "Maharashtra",
   *   "Karnataka",
   *   [
   *     { hsn_code: "61099090", quantity: 10, rate: 500 },
   *     { hsn_code: "84713010", quantity: 2,  rate: 45000 },
   *   ]
   * );
   * console.log(result.transaction_type); // "interstate"
   * console.log(result.grand_total);      // e.g. 112400
   * ```
   */
  async classify(
    sellerState: string,
    buyerState: string,
    items: InvoiceItem[]
  ): Promise<InvoiceClassifyResult> {
    return this.client.request<InvoiceClassifyResult>(
      'POST',
      '/api/v1/invoice/classify',
      {
        seller_state: sellerState,
        buyer_state: buyerState,
        items,
      }
    );
  }
}
