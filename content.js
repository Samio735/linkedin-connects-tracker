const WEEKLY_LIMIT = 200;

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
  progressBarContainer.style.width = "calc(100% - 20px)"; // Modified to fill width while respecting padding
  progressBarContainer.style.backgroundColor = " #106aa6";
  progressBarContainer.style.zIndex = "9999";
  progressBarContainer.style.margin = "0 10px 5px 10px";
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

// Modify the updateStatsElement to include debug info
function updateStatsElement() {
  chrome.storage.sync.get(["postCount"], (data) => {
    const statsElement = document.getElementById("post-stats");
    const count = data.postCount || 0;
    statsElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="#ffffff" width="16" height="16">
      <path d="M9 4a3 3 0 11-3-3 3 3 0 013 3zM6.75 8h-1.5A2.25 2.25 0 003 10.25V15h6v-4.75A2.25 2.25 0 006.75 8zM13 8V6h-1v2h-2v1h2v2h1V9h2V8z"></path>
    </svg> This week : ${count} / ${WEEKLY_LIMIT}`;
  });
}

function updateProgressBar() {
  chrome.storage.sync.get(["postCount"], (data) => {
    const progressBar = document.getElementById("post-progress-bar");
    let progress = (data.postCount / WEEKLY_LIMIT) * 100;
    if (progress > 100) progress = 100;
    progressBar.style.width = `${progress}%`;
  });
}

// Replace network request observer with new API endpoint tracking
const connectObserver = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (
      entry.name.includes(
        "voyager/api/voyagerRelationshipsDashMemberRelationships"
      ) &&
      entry.name.includes("verifyQuotaAndCreateV2")
    ) {
      chrome.storage.sync.get(["postCount"], (data) => {
        const newCount = (data.postCount || 0) + 1;

        chrome.storage.sync.set({ postCount: newCount });
        updateStatsElement();
        updateProgressBar();
      });
      break;
    }
  }
});

connectObserver.observe({ entryTypes: ["resource"] });

// Remove or comment out the old click event listener
// document.addEventListener("click"...

// Replace the day change check with a week change check
const getCurrentWeek = () => {
  const now = new Date();
  const yearStart = new Date(now.getFullYear(), 0, 1);
  return Math.ceil(((now - yearStart) / 86400000 + yearStart.getDay() + 1) / 7);
};

// Consolidate storage checks and UI initialization
const init = async () => {
  const currentWeek = getCurrentWeek();
  chrome.storage.sync.get(["lastWeek", "postCount"], (data) => {
    if (data.lastWeek !== currentWeek) {
      chrome.storage.sync.set({
        lastWeek: currentWeek,
        postCount: 0,
      });
    }

    createContainer();
    createStatsElement();
    createProgressBar();
    updateStatsElement();
    updateProgressBar();
  });
};

init();

// update stats and post count on storage change
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.postCount) {
    updateStatsElement();
    updateProgressBar();
  }
});

console.log("LinkedIn Stats Tracker injected!");
