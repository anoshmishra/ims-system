class IncidentState {
  async handle(incident, nextStatus) {
    throw new Error("Method handle() must be implemented");
  }
}

class OpenState extends IncidentState {
  async handle(incident, nextStatus) {
    if (nextStatus !== 'INVESTIGATING') throw new Error('Invalid transition');
    incident.status = 'INVESTIGATING';
    await incident.save();
  }
}

class InvestigatingState extends IncidentState {
  async handle(incident, nextStatus) {
    if (nextStatus !== 'RESOLVED') throw new Error('Invalid transition');
    incident.status = 'RESOLVED';
    await incident.save();
  }
}

class ResolvedState extends IncidentState {
  async handle(incident, nextStatus) {
    if (nextStatus !== 'CLOSED') throw new Error('Invalid transition');
    
    const rca = await incident.getRca();
    if (!rca) {
      throw new Error('RCA is mandatory before closing the incident');
    }

    incident.status = 'CLOSED';
    incident.end_time = new Date();
    
    const start = new Date(incident.start_time).getTime();
    const end = new Date(incident.end_time).getTime();
    incident.mttr = Math.floor((end - start) / 1000 / 60);
    
    await incident.save();
  }
}

class ClosedState extends IncidentState {
  async handle(incident, nextStatus) {
    throw new Error('Incident is already closed');
  }
}

class StateContext {
  constructor() {
    this.states = {
      OPEN: new OpenState(),
      INVESTIGATING: new InvestigatingState(),
      RESOLVED: new ResolvedState(),
      CLOSED: new ClosedState()
    };
  }

  async transition(incident, nextStatus) {
    const currentState = this.states[incident.status];
    if (!currentState) throw new Error('Invalid current state');
    await currentState.handle(incident, nextStatus);
  }
}

module.exports = new StateContext();