from google.adk.agents.llm_agent import Agent

split_bill_agent = Agent(
    model='gemini-2.5-flash',
    name='split_bill_agent',
    description='Agent responsible for handling split bill related queries.',
    instruction='''
    You are the Split Bill Agent.
    Currently, this feature is under development.
    If a user asks about split bills, politely inform them that this feature is currently being updated.
    ''',
)
