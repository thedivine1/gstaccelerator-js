#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { GSTAccelerator } from "./client";
import { GSTAcceleratorMCPTools } from "./index";

const apiKey = process.env.GST_API_KEY;

if (!apiKey) {
  console.error("GST_API_KEY environment variable is required to run the MCP server.");
  console.error("Usage: GST_API_KEY=your_key npx gstaccelerator-mcp");
  process.exit(1);
}

const gst = new GSTAccelerator({ apiKey });

const server = new Server(
  {
    name: "gstaccelerator-mcp",
    version: "0.2.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: GSTAcceleratorMCPTools,
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;
    
    if (name === "hsn_lookup") {
      const code = String(args?.code);
      const result = await gst.hsn.get(code);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
    
    if (name === "gst_search") {
      const result = await gst.lookup(String(args?.description), {
        supplyType: args?.supply_type as any,
        branded: args?.branded as any,
        saleValueInr: args?.sale_value_inr as any,
      });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
    
    if (name === "gstin_validate") {
      const gstin = String(args?.gstin);
      const result = await gst.gstin.validate(gstin);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
    
    throw new Error(`Unknown tool: ${name}`);
  } catch (error: any) {
    return {
      content: [{ type: "text", text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});

async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("GST Accelerator MCP Server running on stdio");
}

run().catch((error) => {
  console.error("Fatal error running MCP server:", error);
  process.exit(1);
});
