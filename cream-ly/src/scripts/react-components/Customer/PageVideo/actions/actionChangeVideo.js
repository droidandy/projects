/* import Player from "@vimeo/player";

$(document).ready(() => {
  assignVideoPartsLink();
});

function assignVideoPartsLink() {
  const videoPartLinks = document.querySelectorAll(
    `[data-role="playerPartLink"]`
  );
  if (videoPartLinks.length)
    videoPartLinks.forEach((videoPartLink) => {
      videoPartLink.addEventListener("click", playerGoToPart);
    });
}

function activateVideoPartInHTML(link, videoN) {
  $(".list-group .active").removeClass("active");
  $(link)
    .parent(".list-group-item")
    .addClass("active");
  $(".iframeDivs").hide();
  $("#iframeDiv" + videoN).show();
}

function playerGoToPart(event) {
  event.preventDefault();

  const link = event.target;

  const videoHandle = link.dataset.videohandle;
  const videoN = link.dataset.videon;
  const time = link.dataset.time.split(":");
  const title = link.innerHTML;

  //sendAnalytics(`${videoHandle}-${videoN}-${title}`);
  activateVideoPartInHTML(link, videoN);

  const player = new Player("videoPart" + videoN);
  player.setCurrentTime(Number(time[0]) * 60 + Number(time[1]));
  player.play();
}
 */
