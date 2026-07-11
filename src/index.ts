import { GSTAccelerator } from './client';

export { GSTAccelerator };
export default GSTAccelerator;

export * from './types';
export * from './errors';

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
  }
];
