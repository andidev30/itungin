from google.adk.agents.llm_agent import Agent

fund_pool_agent = Agent(
    model='gemini-2.5-flash',
    name='fund_pool_agent',
    description='Agent responsible for handling fund pool related queries.',
    instruction='''
    You are the Fund Pool Agent.
    Currently, this feature is under development.
    If a user asks about fund pools, politely inform them that this feature is currently being updated.
    ''',
)
