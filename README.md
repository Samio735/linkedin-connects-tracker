# LinkedIn Connects Tracker

A Chrome extension that helps you track your LinkedIn connection requests to optimize your networking within LinkedIn's 200 weekly connection limit.

## Features

- Track weekly connection requests (0/200)
- Visual progress bar
- Fixed stats display in the top-right corner
- Automatic weekly reset
- Works on all LinkedIn pages

## Installation

1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked" and select the project directory

## Usage

After installation, the extension will automatically track your connection requests on LinkedIn:

- A small blue box will appear in the top-right corner of LinkedIn
- Shows your current weekly progress (e.g., "This week: 15/200")
- Progress bar indicates your daily goal progress
- Counter automatically increments when you send connection requests

## Technical Details

- Built with vanilla JavaScript
- Uses Chrome Storage API for data persistence
- Manifest V3 compatible
- Content script runs on all LinkedIn pages

## Permissions

- `storage`: Required to save connection request counts
- `https://www.linkedin.com/*`: Required to operate on LinkedIn pages

## Contributing

Feel free to open issues or submit pull requests to improve the extension.

## License

MIT License
