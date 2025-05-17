# GitHub Webhook Setup Guide

This guide explains how to set up GitHub webhooks for automatic contribution tracking in StatTrack AK47.

## 1. Connect Your GitHub Username

Before setting up webhooks, connect your GitHub username in your StatTrack profile:

1. Log in to StatTrack AK47
2. Go to your Profile page
3. Enter your GitHub username and click "Connect GitHub"

## 2. Configure Repository Webhooks

For each repository you want to track:

1. Go to your GitHub repository
2. Click "Settings" tab
3. Select "Webhooks" from the left sidebar
4. Click "Add webhook"
5. Configure the webhook:
   - Payload URL: `https://your-stattrack-app.com/api/github-webhook`
   - Content type: `application/json`
   - Secret: (Optional, but recommended for security)
   - Events: Select the events you want to track:
     - Push (commits)
     - Pull requests
     - Issues
     - Issue comments
     - Pull request reviews
   - Active: Check this box
6. Click "Add webhook"

## 3. Verify Webhook Setup

To verify your webhook is working:

1. Make a small commit to the repository
2. Push the commit
3. Check the "Recent Quests" section on StatTrack
4. You should see your commit and earned XP

## 4. Points System

Each GitHub activity earns points:

| Activity      | Points              |
| ------------- | ------------------- |
| Commit (Push) | 5 points per commit |
| Pull Request  | 10 points           |
| Issue         | 3 points            |
| Comment       | 2 points            |
| Code Review   | 7 points            |

## 5. Organization Repositories

If you want to set up webhooks for organization repositories:

1. You must have admin permissions for the repository
2. Follow the same steps as above for each repository
3. Consider using organization-level webhooks if tracking multiple repositories

## Troubleshooting

- Check the webhook delivery history in GitHub
- Ensure your GitHub username in StatTrack matches exactly
- Verify your StatTrack server is accessible from GitHub
- Check that the webhook URL is correct
