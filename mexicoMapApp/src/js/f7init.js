export var f7 = null;
export var mainView = null;

export const f7init = () => {
  f7 = new Framework7();
  mainView = f7.addView(".view-main", {
    domCache: true,
    dynamicNavbar: true,
    swipeBackPage: false,
    statusbarOverlay: false
  });
};
