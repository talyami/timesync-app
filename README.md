# TimeSync - Timezone Coordination for Remote Teams

**🌍 Live URL:** https://talyami.github.io/timesync-app/

**📁 Source Code:** https://github.com/talyami/timesync-app

---

## What It Does

TimeSync is a free tool that solves a universal problem for remote workers: **"What time is it for you right now?"**

### Core Features

1. **Team Rooms** - Create rooms for different teams/projects
2. **Live Time View** - See everyone's local time updating in real-time
3. **Working Hours Indicator** - Visual indicators show who's in working hours, evening, or sleeping
4. **Meeting Finder** - Find optimal meeting times that work for everyone across timezones
5. **Share Links** - Generate shareable links to let anyone see/edit the team view
6. **No Account Required** - Works entirely in the browser with localStorage

---

## How to Use

1. **Visit** https://talyami.github.io/timesync-app/
2. **Click "Get Started Free"** or "New Team" button
3. **Name your team** (e.g., "Engineering Team")
4. **Add members** with their name and timezone
5. **See everyone's time** updating live
6. **Click "Find Meeting Time"** to find optimal meeting slots
7. **Click "Share"** to copy a link that others can use to view/edit the team

---

## Tech Stack

- **Frontend:** React 18 + Vite
- **Styling:** Custom CSS with glassmorphism effects
- **Icons:** Lucide React
- **Storage:** Browser localStorage + URL-encoded state for sharing
- **Hosting:** GitHub Pages (auto-deployed via GitHub Actions)

---

## Features in Detail

### Real-Time Clocks
Each team member shows their current local time, updating every second. The display includes:
- Large, readable time display
- Date and timezone info
- Offset from your timezone (e.g., "+8h ahead")
- Working hours visualization bar

### Working Status Indicators
- 🟢 **Working** (9am-5pm local)
- 🟡 **Evening/Early Morning** (5pm-10pm, 6am-9am)
- ⚫ **Night** (10pm-6am)

### Meeting Finder
When you have 2+ team members, the "Find Meeting Time" button becomes available. It:
- Scans the next 24 hours
- Rates each hour by how well it works for everyone
- Shows "Optimal" (all in 9-5), "Good" (all in reasonable hours), or "Not ideal"
- Displays each member's local time for that slot

### Share Links
The share feature encodes the entire room state into a URL. Anyone with the link can:
- View all team members and their times
- Add the room to their own browser
- Make edits (collaborative editing via URL sharing)

---

## No Backend Required

TimeSync is a fully client-side application. Data is stored in:
1. **localStorage** - For your own rooms
2. **URL encoding** - For shared rooms

This means:
- Zero server costs
- Privacy-friendly (data never leaves your browser)
- Works offline once loaded
- Instant sharing via copy/paste

---

## Future Enhancements (Ideas)

- [ ] Calendar integration (Google Calendar, Outlook)
- [ ] Slack/Discord bot integration
- [ ] Working hours customization per person
- [ ] Meeting link generation (Zoom, Meet, Teams)
- [ ] Recurring meeting planner
- [ ] Browser extension for quick access

---

## Built By

Created as a demonstration of rapid SaaS development - from idea to deployed product.

**Completed:** January 28, 2026
