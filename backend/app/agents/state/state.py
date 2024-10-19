from typing_extensions import TypedDict
from typing import Annotated
from langgraph.graph import add_messages

class IdentificationState(TypedDict):
    messages: Annotated[list, add_messages]
    fields:str
    values:str
    counter:int
    
class IntakeRAGState(TypedDict):
    messages: Annotated[list, add_messages]
    question: str #current user input. It may or may not be a 'question'
    context: str
    
class SupervisorState(TypedDict):
    #messages: Annotated[list, add_messages]
    next: str #next step in the workflow
    
class GraphState(TypedDict):
    messages: Annotated[list, add_messages]
    fields:str
    values:str
    counter:int
    question: str #current user input. It may or may not be a 'question'
    context: str
    completed: str
    next:int