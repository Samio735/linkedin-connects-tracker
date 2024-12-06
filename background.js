self.debugLinkedIn = {
  async getState() {
    const data = await chrome.storage.sync.get(["lastWeek", "postCount"]);
    return {
      currentWeek: this.getCurrentWeek(),
      lastStoredWeek: data.lastWeek,
      connectCount: data.postCount || 0,
    };
  },

  async simulateWeekChange(weeksToAdd = 1) {
    const mockCurrentWeek = this.getCurrentWeek() + weeksToAdd;
    await chrome.storage.sync.set({
      lastWeek: mockCurrentWeek,
      postCount: 0,
    });
    console.log(`Week changed to ${mockCurrentWeek}`);
    return this.getState();
  },

  async simulateConnect(count = 1) {
    try {
      const data = await chrome.storage.sync.get(["postCount"]);
      await chrome.storage.sync.set({
        postCount: (data.postCount || 0) + count,
      });
      return this.getState();
    } catch (error) {
      console.error("Error in simulateConnect:", error);
      throw error;
    }
  },

  async resetAll() {
    await chrome.storage.sync.clear();
    console.log("All data reset");
    return this.getState();
  },

  getCurrentWeek() {
    const now = new Date();
    const yearStart = new Date(now.getFullYear(), 0, 1);
    return Math.ceil(
      ((now - yearStart) / 86400000 + yearStart.getDay() + 1) / 7
    );
  },
};

console.log("Debug functions ready! Try:");
console.log("await self.debugLinkedIn.getState()");
console.log("await self.debugLinkedIn.simulateWeekChange(1)");
console.log("await self.debugLinkedIn.simulateConnect(5)");
console.log("await self.debugLinkedIn.resetAll()");
