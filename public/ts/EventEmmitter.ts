class EventEmmiter extends EventTarget {
  emmit() {
    console.log('dispatchEvent');
    this.dispatchEvent(new Event('player_state_changed'));
  }
}

export default EventEmmiter;
