import Stopwatch from "./stopwatch";

export function isInViewport(element) {
  const rect = element.getBoundingClientRect();

  return rect.top - window.innerHeight <= 0 && rect.bottom >= 0;
}

export const initTimer = (ref, cb) => {
  const timer = new Timer(ref, cb);

  document.addEventListener("scroll", (e) => timer.track(e), true);
};

const Timer = (ref, cb) => {
  let isTimerStart = false;

  const element = ref.current;
  const stopwatch = new Stopwatch({
    onUpdate: (time) => {
      cb("update", time);
    },
    onStart: (time) => {
      isTimerStart = true;
      cb("start", time);
    },
    onStop: (time) => {
      isTimerStart = false;
      cb("stop", time);
    },
  });

  const track = () => {
    if (!isTimerStart && isInViewport(element)) {
      stopwatch.start();
    }
    if (isTimerStart && !isInViewport(element)) {
      stopwatch.stop();
    }
  };

  return {
    track,
    init: () => {},
  };
};
