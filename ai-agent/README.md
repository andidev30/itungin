### deploy

```bash
adk deploy agent_engine \
    --project=rising-field-479619-r5 \
    --region=europe-west1 \
    --staging_bucket=gs://agent_engine_artifacts_2025 \
    --display_name="Itungin Agent" \
    --trace_to_cloud \
    ./itungin_agent
```