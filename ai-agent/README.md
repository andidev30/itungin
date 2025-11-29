run with session
adk web --port 8000 --session_service_uri agent_engine://rising-field-479619-r5/locations/europe-west1/reasoningEngines/8365489084398829568

adk deploy cloud_run \
--project=rising-field-479619-r5 \
--region=europe-west1 \
--service_name=itungin-agent \
--app_name=itungin-agent \
--with_ui \
./itungin_agent