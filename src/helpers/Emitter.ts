type Options = {
  message: string;
  type: string;
};

class EventRegister {
  static _Listeners: any = {
    count: 0,
    refs: {},
  };

  static addEventListener(eventName: string, callback: any) {
    if (typeof eventName === 'string' && typeof callback === 'function') {
      EventRegister._Listeners.count += 1;
      const eventId = `l${EventRegister._Listeners.count}`;
      EventRegister._Listeners.refs[eventId] = {
        name: eventName,
        callback,
      };
      return eventId;
    }
    return false;
  }

  static removeEventListener(id: any) {
    if (typeof id === 'string') {
      return delete EventRegister._Listeners.refs[id];
    }
    return false;
  }

  static removeAllListeners() {
    let removeError = false;
    Object.keys(EventRegister._Listeners.refs).forEach(_id => {
      const removed = delete EventRegister._Listeners.refs[_id];
      removeError = !removeError ? !removed : removeError;
    });
    return !removeError;
  }

  static emitEvent(eventName: string, data: Options) {
    Object.keys(EventRegister._Listeners.refs).forEach(_id => {
      if (
        EventRegister._Listeners.refs[_id] &&
        eventName === EventRegister._Listeners.refs[_id].name
      ) {
        EventRegister._Listeners.refs[_id].callback(data);
      }
    });
  }

  /*
   * Shorten
   */
  static on(eventName: string, callback: any) {
    return EventRegister.addEventListener(eventName, callback);
  }

  static rm(eventName: string) {
    return EventRegister.removeEventListener(eventName);
  }

  static rmAll() {
    return EventRegister.removeAllListeners();
  }

  static emit(eventName: string, data: Options) {
    EventRegister.emitEvent(eventName, data);
  }
}

export default EventRegister;
