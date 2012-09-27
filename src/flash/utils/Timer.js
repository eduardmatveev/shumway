function Timer_avm2(delay, repeatCount) {
  EventDispatcher.call(this);

  Object.defineProperties(this, {
    delay:       describeProperty(delay),
    repeatCount: describeProperty(repeatCount || 0),
    running:     describeProperty(false)
  });
}

Timer_avm2.prototype = Object.create(EventDispatcher.prototype, {
  __class__: describeInternalProperty('flash.utils.Timer'),

  _start: describeMethod(function () {
    if (this.running)
      return;

    var timer = this;
    this.iteration = 0;
    this.running = true;
    this._interval = setInterval(function Timer_tick() {
      timer.iteration++;
      timer._timerDispatch();
      if (timer.repeatCount > 0 && timer.iteration >= timer.repeatCount)
        timer._stop();
    }, this.delay);
  }),
  _stop: describeMethod(function () {
    if (!this.running)
      return;

    clearInterval(this._interval);
    this.running = false;

    this.dispatchEvent(new TimerEvent(
      TimerEvent.TIMER_COMPLETE,
      true,
      false));
  }),
  _timerDispatch: describeMethod(function () {
    this.dispatchEvent(new TimerEvent(
      TimerEvent.TIMER,
      true,
      false));
  })
});