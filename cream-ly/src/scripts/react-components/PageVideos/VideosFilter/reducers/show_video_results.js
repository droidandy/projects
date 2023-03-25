export default (selectedGoals) => {
  if (!Array.isArray(selectedGoals)) return [];

  const goalsInclude = (targetGoals) =>
    targetGoals.some((goal) => selectedGoals.includes(goal));

  const selectedVideos = [];

  if (goalsInclude(["wrinkles"]))
    selectedVideos.push(
      "video-3-osanka",
      "video-1",
      "video-4-buccal-massage",
      "video-5-guasha-massage",
      "video-7-mewing",
      "video-8-taping"
    );

  if (goalsInclude(["capillaries"]))
    selectedVideos.push(
      "video-3-osanka",
      "video-2-limfa",
      "video-1",
      "video-5-guasha-massage",
      "video-7-mewing"
    );

  if (goalsInclude(["neck_wrinkles"]))
    selectedVideos.push("video-3-osanka", "video-1");

  if (goalsInclude(["edema"]))
    selectedVideos.push(
      "video-2-limfa",
      "video-5-guasha-massage",
      "video-7-mewing",
      "video-8-taping",
      "video-9-body-taping"
    );

  if (goalsInclude(["breast_shape"])) selectedVideos.push("video-3-osanka");

  if (goalsInclude(["cellulite"]))
    selectedVideos.push(
      "video-6-cellulite",
      "video-2-limfa",
      "video-9-body-taping"
    );

  return selectedVideos;
};
