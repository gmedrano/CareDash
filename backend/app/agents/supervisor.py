from langgraph.graph import END
class SupervisorAgent:
    def __init__(self):
        self.order = ['verification_agent', 'medical_agent']
        self.next = 0
    
    def __call__(self, state):
        if not state.get('completed'):
            state["completed"] = ""
        if not state.get('next'):
            state["next"] = 0
        if not state.get('context'):
            state["context"] = ""
            
        return state

    def route(self, state):
        if self.next >= len(self.order):
            return END
        print("SUPERVISOR route", state["next"])
        return self.order[state["next"]]
        