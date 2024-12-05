let inserted = false;
// to do if implemented : change color on darkmode and lightmode
// function updatePostCountUI(postCount) {
//   const followersEL = document.querySelector(
//     `a[href="/${userId}/verified_followers"]`
//   );
//   if (!followersEL) return;
//   if (inserted) {
//     document.getElementById(
//       "replies-count"
//     ).innerHTML = `<div class="css-175oi2r"><a href="twitter.com/Samyrahim7" id="replies-count" dir="ltr" role="link" class="${followersEL.getAttribute(
//       "class"
//     )}" style="text-overflow: unset; ;"><span class="${followersEL.firstElementChild.getAttribute(
//       "class"
//     )}" style="text-overflow: unset; ;"><span class=""><span class="${followersEL.firstElementChild.firstElementChild.getAttribute(
//       "class"
//     )}">${postCount}</span></span><span class="${followersEL.children[1].getAttribute(
//       "class"
//     )}" "><span class="${followersEL.children[1].firstElementChild.getAttribute(
//       "class"
//     )}}" style="text-overflow: unset;"> Replies</span></span></a></div>`;
//     return;
//   }
//   console.log("inserted");
//   // create a list from element classList
//   const classList = Array.from(followersEL.classList);
//   followersEL.classList.add("r-le9fof");
//   followersEL.parentElement.insertAdjacentHTML(
//     "afterend",
//     `<div class="css-175oi2r"><a href="twitter.com/Samyrahim7" id="replies-count" dir="ltr" role="link" class="${followersEL.getAttribute(
//       "class"
//     )}" style="text-overflow: unset; ;"><span class="${followersEL.firstElementChild.getAttribute(
//       "class"
//     )}" style="text-overflow: unset; ;"><span class=""><span class="${followersEL.firstElementChild.firstElementChild.getAttribute(
//       "class"
//     )}">${postCount}</span></span><span class="${followersEL.children[1].getAttribute(
//       "class"
//     )}" "><span class="${followersEL.children[1].firstElementChild.getAttribute(
//       "class"
//     )}}" style="text-overflow: unset;"> Replies</span></span></a></div>`
//   );

//   inserted = true;
// }

let postCount = chrome.storage.sync.get("postCount", (data) => {
  postCount = data.postCount || 0;
});

let todayCount = chrome.storage.sync.get("todayCount", (data) => {
  todayCount = data.todayCount || 0;
});

function createContainer() {
  const container = document.createElement("div");
  container.id = "stats-container";
  container.style.position = "fixed";
  container.style.top = "0";
  container.style.right = "0";
  container.style.padding = "10px";

  container.style.backgroundColor = "#04498e";
  container.style.color = "#ffffff";
  container.style.fontFamily = "Arial, sans-serif";
  container.style.fontSize = "14px";
  container.style.fontWeight = "bold";
  container.style.zIndex = "9999";
  container.style.borderBottomLeftRadius = "10px";

  document.body.prepend(container);
}

function createStatsElement() {
  const statsElement = document.createElement("div");
  statsElement.id = "post-stats";
  statsElement.style.display = "flex";
  statsElement.style.alignItems = "center";
  statsElement.style.gap = "5px";
  statsElement.style.padding = "0 15px";

  document.querySelector("#stats-container").appendChild(statsElement);
}

function createProgressBar() {
  const progressBarContainer = document.createElement("div");
  progressBarContainer.id = "post-progress-bar-container";
  progressBarContainer.style.height = "3px";
  progressBarContainer.style.width = "100%";
  progressBarContainer.style.backgroundColor = " #106aa6";
  progressBarContainer.style.zIndex = "9999";
  progressBarContainer.style.margin = "0 10px";
  progressBarContainer.style.marginBottom = "5px";
  progressBarContainer.style.borderRadius = "20px";

  const progressBar = document.createElement("div");
  progressBar.id = "post-progress-bar";
  progressBar.style.width = "4px";
  progressBar.style.height = "100%";
  progressBar.style.backgroundColor = "#ffffff";
  progressBar.style.borderRadius = "20px";

  progressBarContainer.prepend(progressBar);
  document.querySelector("#stats-container").prepend(progressBarContainer);

  updateProgressBar();
}

function updateStatsElement() {
  chrome.storage.sync.get(["postCount", "countDays", "todayCount"], (data) => {
    const statsElement = document.getElementById("post-stats");
    data.postCount = data.postCount || 0;
    statsElement.innerHTML = `<svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="connect-small" aria-hidden="true" role="none" data-supported-dps="16x16" fill="#ffffff" fill-opacity="0.9" width="16"  height="16" >
  <path d="M9 4a3 3 0 11-3-3 3 3 0 013 3zM6.75 8h-1.5A2.25 2.25 0 003 10.25V15h6v-4.75A2.25 2.25 0 006.75 8zM13 8V6h-1v2h-2v1h2v2h1V9h2V8z" fill-opacity="0.9"></path>
</svg>This week : ${data.postCount} / ${GOAL} `;
  });
}

const GOAL = 200;
const dailyGoal = 15;

function updateProgressBar() {
  chrome.storage.sync.get(["postCount", "todayCount"], (data) => {
    const progressBar = document.getElementById("post-progress-bar");
    let progress = (data.postCount / dailyGoal) * 100;
    if (progress > 100) progress = 100;
    progressBar.style.width = `${progress}%`;
  });
}

// Add event listener for detecting comment or post activity
document.addEventListener("click", function (event) {
  console.log("event.target");
  if (event.target.closest("[aria-label='Send now']")) {
    console.log("clicked");
    // User clicked the tweet button to post
    chrome.storage.sync.get(["postCount", "todayCount"], (data) => {
      postCount = data.postCount || 0;
      postCount++;
      todayCount = data.todayCount || 0;
      todayCount++;
      chrome.storage.sync.set({ postCount: postCount, todayCount: todayCount });
      updateStatsElement();
      updateProgressBar();
      // updatePostCountUI(postCount);
    });
  }
});

// let userId;
// chrome.storage.sync.get("userId", (data) => {
//   userId = data.userId;
//   console.log(userId);
// });
// console.log(userId);

// check if the day has changed
const today = new Date().toLocaleDateString();
chrome.storage.sync.get(["currentDay", "countDays"], (data) => {
  (!data.countDays || data.countDays == 0) && (data.countDays = 1);
  if (data.currentDay !== today) {
    chrome.storage.sync.set({
      currentDay: today,
      todayCount: 0,
      countDays: data.countDays + 1,
    });
  }
});

chrome.storage.sync.get("postCount", (data) => {
  let postCount = data.postCount || 0;
  console.log(postCount);
  createContainer();
  createStatsElement();
  createProgressBar();
  updateStatsElement(postCount);
  updateProgressBar();
});

// Select the followers element and update the text

// setTimeout(() => {
//   setInterval(() => {
//     chrome.storage.sync.get("postCount", (data) => {
//       let postCount = data.postCount;
//       if (postCount == undefined) postCount = 0;
//       // updatePostCountUI(postCount);
//     });
//   }, 100);
// }, 200);

// reset count

// update stats and post count on storage change
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.postCount) {
    updateStatsElement();
    updateProgressBar();
    // updatePostCountUI(changes.postCount.newValue);
  }
});

// update user id on storage change
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.userId) {
    userId = changes.userId.newValue;
  }
});

console.log("content.js");
