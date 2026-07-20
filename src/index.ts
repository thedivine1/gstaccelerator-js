import { GSTAccelerator } from './client';

export { GSTAccelerator };
export default GSTAccelerator;

export * from './types';
export * from './errors';
export { InvoiceClient } from './resources/invoice';
export type { InvoiceItem, ClassifiedItem, InvoiceClassifyResult } from './resources/invoice';

export const GSTAcceleratorMCPTools = [
  {
    name: "hsn_lookup",
    description: "Look up Indian GST rate for a specific HSN code",
    input_schema: {
      type: "object",
      properties: {
        code: { type: "string", description: "8-digit HSN code" }
      },
      required: ["code"]
    }
  },
  {
    name: "gst_search",
    description: "Search GST HSN codes by product description",
    input_schema: {
      type: "object",
      properties: {
        description: { type: "string" },
        supply_type: { type: "string", enum: ["B2B", "B2C"] },
        branded: { type: "boolean" },
        sale_value_inr: { type: "number" }
      },
      required: ["description"]
    }
  },
  {
    name: "gstin_validate",
    description: "Validate an Indian GSTIN number and extract components",
    input_schema: {
      type: "object",
      properties: {
        gstin: { type: "string", description: "15-character GSTIN" }
      },
      required: ["gstin"]
    }
  },
  {
    name: "sac_lookup",
    description: "Look up Indian GST rate for a specific SAC code",
    input_schema: {
      type: "object",
      properties: {
        code: { type: "string", description: "6-digit SAC code" }
      },
      required: ["code"]
    }
  },
  {
    name: "invoice_classify",
    description: "Classify invoice line items as CGST+SGST (intrastate) or IGST (interstate)",
    input_schema: {
      type: "object",
      properties: {
        seller_state: { type: "string" },
        buyer_state: { type: "string" },
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              hsn_code: { type: "string" },
              quantity: { type: "number" },
              rate: { type: "number" },
              amount: { type: "number" }
            },
            required: ["hsn_code"]
          }
        }
      },
      required: ["seller_state", "buyer_state", "items"]
    }
  }
];
