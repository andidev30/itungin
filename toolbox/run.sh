#!/bin/bash
# Run the MCP Toolbox with the tools.yaml configuration
cd "$(dirname "$0")"
mcp-toolbox --tools split_bill_tool.yaml
