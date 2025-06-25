# CDG STATTRAKR

A gamified developer activity tracker that awards XP for GitHub contributions and manual quests. Features leaderboards, level progression, and configurable rewards.

## Getting Started

1. Copy the `.env.local` file from Confluence
2. Install dependencies: `npm install`
3. Run development server: `npm run dev`

## Features

- **GitHub Integration**: Automatic XP tracking via webhooks
- **Manual Quests**: Submit custom achievements
- **Level System**: 100 configurable levels with titles and rewards
- **Leaderboards**: Monthly and all-time rankings
- **Level-up Notifications**: Claim rewards when advancing
- **Supabase Backend**: Authentication, database, and real-time updates

## Level System

Fully configurable through the `levels` database table:

- **XP Requirements**: Progressive XP thresholds
- **Coin Rewards**: Currency earned per level
- **Titles**: From "Noob" to "On Crack" (Level 100)
- **Special Rewards**: JSON field for future features

## Database Schema

### Core Tables

- **users**: Player profiles, stats, and progression
- **quests**: Individual actions/contributions with XP values
- **levels**: Configurable level definitions and rewards
- **level_ups**: Claimable level advancement records

### Key Functions

- `increment_user_stats_with_levelup`: Handles XP gains and multi-level progression
- `get_level_for_xp`: Calculates current level from total XP
- `reset_monthly_stats`: Monthly leaderboard reset via `/api/reset`

## GitHub Webhook Setup

Add this webhook URL to your repositories:

```
[Your Domain]/api/github-webhook
```

Supported events: push, pull_request, issues, pull_request_review

## Development Roadmap

- Implement monthly reset CRON job
- Support more events like PR reviews
- Custom sprites/avatars
- Logging more manual work. E.g. cold calls
- Coin shop system
- Achievements?
- Special items? E.g. Aidan's stinky socks
