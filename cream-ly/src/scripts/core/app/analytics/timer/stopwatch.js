export default class Stopwatch {
  constructor(cb) {
    this.startTime = 0;
    this.elapsedTime = 0;
    this.timerInterval = 0;
    this.cb = cb;
  }

  timeToString(time) {
    let diffInHrs = time / 3600000;
    let hh = Math.floor(diffInHrs);

    let diffInMin = (diffInHrs - hh) * 60;
    let mm = Math.floor(diffInMin);

    let diffInSec = (diffInMin - mm) * 60;
    let ss = Math.floor(diffInSec);

    let diffInMs = (diffInSec - ss) * 100;
    let ms = Math.floor(diffInMs);

    let formattedMM = mm.toString().padStart(2, "0");
    let formattedSS = ss.toString().padStart(2, "0");
    let formattedMS = ms.toString().padStart(2, "0");

    return `${formattedMM}:${formattedSS}:${formattedMS}`;
  }

  start() {
    this.startTime = Date.now() - this.elapsedTime;
    this.cb.onStart(this.timeToString(this.elapsedTime));

    this.timerInterval = setInterval(() => {
      this.elapsedTime = Date.now() - this.startTime;
      this.cb.onUpdate(this.timeToString(this.elapsedTime));
    }, 10);
  }

  stop() {
    this.cb.onStop(this.timeToString(this.elapsedTime));
    clearInterval(this.timerInterval);
    this.elapsedTime = 0;
  }
}
