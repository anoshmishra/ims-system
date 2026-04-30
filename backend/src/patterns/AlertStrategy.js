class AlertStrategy {
  calculate(componentId) {
    throw new Error("Method calculate() must be implemented");
  }
}

class RDBMSAlertStrategy extends AlertStrategy {
  calculate(componentId) {
    return 'P0';
  }
}

class CacheAlertStrategy extends AlertStrategy {
  calculate(componentId) {
    return 'P2';
  }
}

class DefaultAlertStrategy extends AlertStrategy {
  calculate(componentId) {
    return 'P1';
  }
}

class AlertContext {
  constructor() {
    this.strategies = {
      'RDBMS': new RDBMSAlertStrategy(),
      'CACHE': new CacheAlertStrategy()
    };
    this.defaultStrategy = new DefaultAlertStrategy();
  }

  getSeverity(componentId) {
    const type = Object.keys(this.strategies).find(key => componentId.includes(key));
    const strategy = this.strategies[type] || this.defaultStrategy;
    return strategy.calculate(componentId);
  }
}

module.exports = new AlertContext();