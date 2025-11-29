from google.adk.agents.llm_agent import Agent
from .split_bill_agent import split_bill_agent
from .fund_pool_agent import fund_pool_agent

root_agent = Agent(
    model='gemini-2.5-flash',
    name='router_agent',
    description='Main router agent that directs user queries to the appropriate sub-agent.',
    instruction='''
    You are Itungin AI, a helpful assistant that can help users manage their finances, specifically split bills and fund pools.
    
    Your job is to understand the user's intent and delegate the task to the appropriate sub-agent.
    - If the user asks about splitting bills, checking bill status, or bill details, delegate to the 'split_bill_agent'.
    - If the user asks about fund pools, collecting money, or shared funds, delegate to the 'fund_pool_agent'.
    - If the user asks a general question unrelated to these topics, answer it yourself or ask for clarification.
    ''',
    sub_agents=[split_bill_agent, fund_pool_agent]
)
