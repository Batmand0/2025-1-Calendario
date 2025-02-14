# Calendar Project - Microsoft Implementation

📅 A calendar application using Microsoft Graph API to display academic events.

## Features
* **Monthly View**: January-August calendar display
* **Microsoft Integration**: Graph API connectivity
* **Event Support**: Multi-day events with color coding
* **Interactive UI**: Tooltips and event details
* **Secure Access**: Personal Microsoft authentication

## Prerequisites

* Node.js (v14+)
* Personal Microsoft Account
* Azure Portal Application Registration

## Getting Started

### Installation

```bash
git clone https://github.com/Batmand0/2025-1-Calendar-Microsoft.git
cd 2025-1-Calendar-Microsoft
npm install
```

### Configuration

```env
MICROSOFT_CLIENT_ID=your_client_id
REDIRECT_URI=http://localhost:3000/auth/callback
PORT=3000
```

### Running the Application

```bash
# Development
npm run dev

# Production
npm start
```

Visit: [http://localhost:3000](http://localhost:3000)

## Project Structure

```plaintext
2025-1-Calendar-Microsoft/
├── frontend/
│   ├── script.js        # Calendar logic
│   ├── styles.css       # Styles
│   └── index.html       # Main page
├── backend/
│   └── server.js        # Express + Graph API
├── .env                 # Environment variables
└── package.json         # Dependencies
```

## Microsoft Graph API Integration

### Features Used
* Calendar Event Fetching
* Date Range Management
* Event Details & Colors
* Authentication Flow

### Authentication Setup

1. Azure Portal Registration
2. Redirect URI Configuration
3. Required Permissions:
   - Calendars.Read
   - Calendars.ReadWrite

## Development

### Contributing

1. Fork Repository
2. Create Feature Branch
   ```bash
   git checkout -b feature/YourFeature
   ```
3. Commit Changes
   ```bash
   git commit -m "Add: your feature"
   ```
4. Push Branch
   ```bash
   git push origin feature/YourFeature
   ```
5. Submit Pull Request

## Related Projects

* [Original Google Calendar Implementation](https://github.com/Batmand0/2025-1-Calendario)

## Notes

This is the Microsoft Calendar implementation branch. For Google Calendar version, see main branch.

---

## License
MIT License - See LICENSE for details.

---
Created by Armando Armendáriz| [GitHub](https://github.com/YourUsername)
