from langgraph.graph import END
from langchain_openai import ChatOpenAI
from langchain_core.runnables import RunnableLambda
from langchain_core.messages import AIMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

class SupervisorAgent:
    def __init__(self):
        self.order = ['verification_agent', 'intake_agent']
        self.next = 0
    
    def __call__(self, state):
        if not state.get('completed'):
            state["completed"] = ""
        if not state.get('next'):
            state["next"] = 0
        if not state.get('context'):
            state["context"] = ""
        if not state.get('counter'):
            state["counter"] = 0
            
        return state

    def route(self, state):
        if self.next >= len(self.order):
            return END
        
        if state["counter"] >= 3:
            return "end_node"
        
        print("SUPERVISOR route", state["next"])
        return self.order[state["next"]]

class EndNode:
    def __init__(self, llm: ChatOpenAI):
        prompt = ChatPromptTemplate.from_messages([
          MessagesPlaceholder(variable_name="messages")
        ])
        self.runnable = prompt | RunnableLambda(lambda x: AIMessage(content="tel number")) 
    
    def __call__(self, state):
        result = self.runnable.invoke(state)
        print("END NODE RESULT", result)
        return {**state, "messages":[result]}
    