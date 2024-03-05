const ResetBtn = document.getElementById("reset");
const dailyGoalEl = document.getElementById("daily-goal");
const activateFilterPostsEl = document.getElementById("activate-filter-posts");
const postFilterEls = document.querySelectorAll(".post-filter");
const postFilterContainerEl = document.querySelector(".post-filter-container");
const maxTimeEl = document.getElementById("max-time");
const minReachEl = document.getElementById("min-reach");
const maxReplisEl = document.getElementById("max-replies");
const hideLikedPostsEl = document.getElementById("hide-liked");
const hideViewsPerMinuteEl = document.getElementById("hide-views-per-min");
const disaibleReplySoundEl = document.getElementById("disable-reply-sound");
const todayCountEl = document.getElementById("today-count");
const overallCountEl = document.getElementById("overall-count");
const dailyAverageEl = document.getElementById("daily-average");
const todayTimeEl = document.getElementById("today-time");
const averageTimeEl = document.getElementById("average-time");
const timePerTweetEl = document.getElementById("time-per-tweet");
const todayRateEl = document.getElementById("today-rate");
const showTodayCountEl = document.getElementById("show-today-count");
const showOverallCountEl = document.getElementById("show-overall-count");
const showDailyAverageEl = document.getElementById("show-daily-average");
const showTodayTimeEl = document.getElementById("show-today-time");
const showAverageTimeEl = document.getElementById("show-average-time");
const showTimePerTweetEl = document.getElementById("show-time-per-tweet");
const showTodayRateEl = document.getElementById("show-today-rate");
const trackContainerEl = document.querySelector(".track-container");
const filterContainerEl = document.querySelector(".filter-container");

ResetBtn.addEventListener("click", () => {
  chrome.storage.local.set({
    todayCount: 0,
    postCount: 0,
    countDays: 1,
    timeSpent: 0,
    timeSpentToday: 0,
  });
  updateUI();
});

// add event listenes to each show button

showTodayCountEl.addEventListener("change", (e) => {
  chrome.storage.local.set({ showTodayCount: e.target.checked });
});

showOverallCountEl.addEventListener("change", (e) => {
  chrome.storage.local.set({ showOverallCount: e.target.checked });
});

showDailyAverageEl.addEventListener("change", (e) => {
  chrome.storage.local.set({ showDailyAverage: e.target.checked });
});

showTodayTimeEl.addEventListener("change", (e) => {
  chrome.storage.local.set({ showTodayTime: e.target.checked });
});

showAverageTimeEl.addEventListener("change", (e) => {
  chrome.storage.local.set({ showAverageTime: e.target.checked });
  console.log("hello");
});

showTimePerTweetEl.addEventListener("change", (e) => {
  chrome.storage.local.set({ showTimePerTweet: e.target.checked });
});

showTodayRateEl.addEventListener("change", (e) => {
  chrome.storage.local.set({ showTodayRate: e.target.checked });
});

dailyGoalEl.addEventListener("change", (e) => {
  chrome.storage.local.set({
    dailyGoal: Number(e.target.value),
  });
});

activateFilterPostsEl.addEventListener("change", (e) => {
  chrome.storage.local.set({
    activateFilterPosts: e.target.checked,
  });
  postFilterEls.forEach((el) => {
    el.style.opacity = activateFilterPostsEl.checked ? "1" : "0.5";
  });
});

maxTimeEl.addEventListener("change", (e) => {
  if (!e.target.value) e.target.value = Infinity;
  if (e.target.value < 0) e.target.value = Infinity;
  chrome.storage.local.set({
    maxTimePassed: Number(e.target.value),
  });
});

minReachEl.addEventListener("change", (e) => {
  chrome.storage.local.set({
    minViewsPerMinute: Number(e.target.value),
  });
});

maxReplisEl.addEventListener("change", (e) => {
  chrome.storage.local.set({
    maxReplyCount: Number(e.target.value),
  });
});

hideLikedPostsEl.addEventListener("change", (e) => {
  chrome.storage.local.set({
    hideLikedPosts: e.target.checked,
  });
});

hideViewsPerMinuteEl.addEventListener("change", (e) => {
  chrome.storage.local.set({
    hideViewsPerMinute: e.target.checked,
  });
});

disaibleReplySoundEl.addEventListener("change", (e) => {
  chrome.storage.local.set({
    disaibleReplySound: e.target.checked,
  });
});

document.addEventListener("click", (e) => {
  if (e.target.closest(".categories")) {
    document.getElementById("filter").classList.toggle("focused");
    document.getElementById("track").classList.toggle("focused");
    // check which button is focused
    const focused = document.activeElement;
    if (focused.id === "track") switchToTrack();
    if (focused.id === "filter") switchToFilter();
  }
});

switchToTrack();

function switchToTrack() {
  trackContainerEl.style.display = "block";
  filterContainerEl.style.display = "none";
}

function switchToFilter() {
  trackContainerEl.style.display = "none";
  filterContainerEl.style.display = "block";
}

function updateUI() {
  chrome.storage.local.get(
    [
      "dailyGoal",
      "countDays",
      "todayCount",
      "postCount",
      "timeSpent",
      "timeSpentToday",
      "showTodayCount",
      "showOverallCount",
      "showDailyAverage",
      "showTodayTime",
      "showAverageTime",
      "showTimePerTweet",
      "showTodayRate",
      "maxTimePassed",
      "minViewsPerMinute",
      "maxReplyCount",
      "hideLikedPosts",
      "hideViewsPerMinute",
      "disaibleReplySound",
      "activateFilterPosts",
    ],
    (data) => {
      const dailyGoal = data.dailyGoal || 0;
      const countDays = data.countDays || 1;
      const todayCount = data.todayCount || 0;
      const postCount = data.postCount || 0;
      const timeSpent = data.timeSpent || 0;
      const timeSpentToday = data.timeSpentToday || 0;
      const showTodayCount = !!data.showTodayCount ? "true" : "false";
      const showOverallCount = !!data.showOverallCount ? "true" : "false";
      const showDailyAverage = !!data.showDailyAverage ? "true" : "false";
      const showTodayTime = !!data.showTodayTime ? "true" : "false";
      const showAverageTime = !!data.showAverageTime ? "true" : "false";
      const showTimePerTweet = !!data.showTimePerTweet ? "true" : "false";
      const showTodayRate = !!data.showTodayRate ? "true" : "false";
      const maxTimePassed = data.maxTimePassed || Infinity;
      const minViewsPerMinute = data.minViewsPerMinute || 0;
      const maxReplyCount = data.maxReplyCount || Infinity;
      const hideLikedPosts = !!data.hideLikedPosts ? "true" : "false";
      const hideViewsPerMinute = !!data.hideViewsPerMinute ? "true" : "false";
      const disaibleReplySound = !!data.disaibleReplySound ? "true" : "false";
      const activateFilterPosts = !!data.activateFilterPosts ? "true" : "false";

      dailyGoalEl.value = dailyGoal;
      maxTimeEl.value = maxTimePassed;
      minReachEl.value = minViewsPerMinute;
      maxReplisEl.value = maxReplyCount;
      todayCountEl.textContent = todayCount;
      overallCountEl.textContent = postCount;
      dailyAverageEl.textContent = (postCount / countDays).toFixed(1);
      todayTimeEl.textContent = Math.round(timeSpentToday / 60);
      averageTimeEl.textContent = Math.round(timeSpent / 60 / countDays);
      timePerTweetEl.textContent = (
        postCount /
        (timeSpent / (60 * 60))
      ).toFixed(1);
      todayRateEl.textContent = (
        data.todayCount /
        (data.timeSpentToday / (60 * 60))
      ).toFixed(1);
      showTodayCountEl.checked = showTodayCount === "true";
      showOverallCountEl.checked = showOverallCount === "true";
      showDailyAverageEl.checked = showDailyAverage === "true";
      showTodayTimeEl.checked = showTodayTime === "true";
      showAverageTimeEl.checked = showAverageTime === "true";
      showTimePerTweetEl.checked = showTimePerTweet === "true";
      showTodayRateEl.checked = showTodayRate === "true";
      hideLikedPostsEl.checked = hideLikedPosts === "true";
      hideViewsPerMinuteEl.checked = hideViewsPerMinute === "true";
      disaibleReplySoundEl.checked = disaibleReplySound === "true";
      activateFilterPostsEl.checked = activateFilterPosts === "true";
      postFilterEls.forEach((el) => {
        el.style.opacity = activateFilterPostsEl.checked ? "1" : "0.5";
      });
    }
  );
}

updateUI();
