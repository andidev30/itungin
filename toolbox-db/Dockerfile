# MCP Toolbox for Databases - using official image
FROM us-central1-docker.pkg.dev/database-toolbox/toolbox/toolbox:latest

# Copy config
COPY tools.yaml /config/tools.yaml

# Run toolbox
CMD ["toolbox", "--tools-file", "/config/tools.yaml", "--address", "0.0.0.0"]
