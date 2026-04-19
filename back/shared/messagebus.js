const EventEmitter = require("events");

class MessageBus extends EventEmitter {
  constructor() {
    super();
    this.subscribers = new Map();
  }

  /**
   * Subscribe to an event type
   * @param {string} eventType - Event type to subscribe to
   * @param {string} serviceName - Name of the service subscribing
   * @param {Function} handler - Handler function for the event
   */
  subscribe(eventType, serviceName, handler) {
    const key = `${eventType}:${serviceName}`;
    if (!this.subscribers.has(key)) {
      this.on(eventType, handler);
      this.subscribers.set(key, handler);
      console.log(`[MessageBus] Service '${serviceName}' subscribed to '${eventType}'`);
    }
  }

  /**
   * Publish an event to all subscribers
   * @param {string} eventType - Event type
   * @param {object} data - Event data
   * @param {string} fromService - Service publishing the event
   */
  publish(eventType, data, fromService) {
    console.log(`[MessageBus] Event '${eventType}' published by '${fromService}'`, data);
    this.emit(eventType, { eventType, data, fromService, timestamp: new Date() });
  }

  /**
   * Get all subscribers for an event type
   */
  getSubscribers(eventType) {
    return Array.from(this.subscribers.entries())
      .filter(([key]) => key.startsWith(eventType))
      .map(([key, handler]) => key);
  }
}

// Singleton instance
const messageBus = new MessageBus();

module.exports = messageBus;
