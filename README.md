# CDG STATTRAKR

This project is to track our work and get that extra motivation. For now lets track some simple quests in GitHub. I will store these quests in Supabase and award XP to the user that performed the quest. We need a montly leaderboard on the home page followed by a log of all the quests associated with it.

## Getting Started

Copy the repo, and copy the .env.local file in our Confluence

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Features

- Supabase integration for data storage
- Authentication for users
- Leaderboard on home page
- Action log with associated points
- GitHub action tracking
- **Extensible level-up system with configurable rewards**
- **Rich level progression with titles**
- **Level-up notifications with detailed rewards**

## Level System

The level system is **fully configurable** through the `levels` database table, making it easy to fine-tune progression and rewards without code changes.

### Level Configuration

Each level is defined in the `levels` table with:

- **XP Required**: Total XP needed to reach this level
- **Coin Reward**: Coins awarded when reaching this level
- **Title**: Level title (e.g., "Novice", "Master", "Legend")
- **Special Reward**: JSON field for future extensibility (items, unlocks, etc.)

### Customizing Levels

To modify the level system, simply update the `levels` table:

## Development Roadmap

- Balancing through levels table
- Custom sprites (Pokemon based?)
- Shop to redeem Coins
- Achievement system
- Seasonal events
- Special reward system (items, unlocks, themes)

# Supabase Schema Details

I do my best to keep this updated but no guarantees

## Tables

1. **users** - Stores user information and stats

   - id (UUID, PK)
   - username (text)
   - github_username (text)
   - total_xp (integer)
   - monthly_xp (integer)
     - level (integer) - Auto-calculated from total_xp
   - coins (integer) - Earned from level-ups
   - quest_count (integer)
   - monthly_quest_count (integer)
   - created_at (timestamp)

2. **quests** - Stores each action/contribution

   - id (UUID, PK)
   - user_id (UUID, FK to users)
   - username (text)
   - source (text)
   - type (text)
   - points (integer)
   - description (text)
   - created_at (timestamp)

3. **levels** - Defines level requirements and rewards (configurable)

   - level (integer, PK)
   - xp_required (integer) - Total XP needed for this level
   - coin_reward (integer) - Coins awarded when reaching this level
   - title (text) - Level title (e.g., "Master", "Legend")
   - special_reward (jsonb) - Future extensibility for items/unlocks

4. **level_ups** - Stores level-up events for rewards

   - id (UUID, PK)
   - user_id (UUID, FK to users)
   - level (integer, FK to levels)
   - xp (integer) - Total XP when level was reached
   - claimed (boolean) - Whether reward has been claimed
   - created_at (timestamp)

## Database Functions

1. **get_level_for_xp** - Calculates current level based on XP using the levels table
2. **get_xp_for_level** - Gets XP required for a specific level
3. **get_xp_to_next_level** - Calculates XP needed to reach the next level
4. **get_level_rewards** - Gets all reward information for a specific level
5. **increment_user_stats_with_levelup** - Enhanced function that updates user stats and handles level-ups automatically using the levels table
6. **reset_monthly_stats** - Resets monthly stats without affecting levels or coins
7. **handle_new_user** - Creates user profile on signup

## Additional Notes

- The database is set up to automatically create a user profile when someone signs up through Supabase Auth. The `handle_new_user` function should initialize all point and count fields (both lifetime and monthly) to their default starting values (e.g., 0).
- Monthly resets for `monthly_xp` and `monthly_quest_count` via a cron job using the `/api/reset` endpoint. This function should specifically target the monthly fields.
