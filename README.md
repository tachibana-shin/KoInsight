<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="images/heading.png">
    <img src="images/heading-dark.png" width="80%">
  </picture>
</p>

<p align="center">
  <strong>KoInsight</strong> brings your <a href="https://koreader.rocks" target="_blank">KOReader</a> reading stats to life with a clean, web-based dashboard.
</p>

<p align="center">
  <a href='https://coveralls.io/github/GeorgeSG/KoInsight'><img src='https://coveralls.io/repos/github/GeorgeSG/KoInsight/badge.svg' alt='Coverage Status' /></a>
</p>

<p align="center">
   <picture>
    <source media="(prefers-color-scheme: dark)" srcset="images/screenshots/stats_1_d.png">
    <img src="images/screenshots/stats_1_l.png" width="100%">
  </picture>
</p>

# Features

- 📈 Interactive dashboard with charts and insights
- ✏️ Highlights sync
- 🔄 KOReader plugin for syncing reading stats
- 📱 Multi-device support
- 📤 Manual .sqlite upload supported
- ♻️ Act as a KOReader (kosync) sync server
- 🏠 Fully self-hostable (Docker image available)

# Screenshots

<p><strong>Note:</strong>As of 2025-10-15 covers are not (yet) automatically displayed, as they are not part of the KOReader-generated database. If you want to see covers, you'll need to add them once per book. The UI offers a search by title and upload of images under the tab 'Cover Selector'.</p>

<table>
  <tr>
    <td><strong>Home page</strong></td>
    <td><strong>Book view</strong></td>
  </tr>
  <tr>
    <td><img src="images/screenshots/book_ld.png" width="300"/></td>
    <td><img src="images/screenshots/home_ld.png" width="300"/></td>
  </tr>
  <tr>
    <td><strong>Statistics</strong></td>
    <td><strong>Statistics</strong></td>
  </tr>
  <tr>
    <td><img src="images/screenshots/stats_1_ld.png" width="300"/></td>
    <td><img src="images/screenshots/stats_2_ld.png" width="300"/></td>
  </tr>
</table>

See all [screenshots](/images/screenshots/)

# Serverless Migration

KoInsight has been migrated to a modern, serverless-friendly architecture. This enables you to deploy the application on platforms like **Cloudflare Pages/Workers** and **Netlify** with minimal overhead.

## Comparison with Original Project

| Feature | Original Project | Serverless Version (Current) |
|---------|------------------|-----------------------------|
| **Core Architecture** | Standalone Node.js/Express server | Monorepo (Turborepo) with Hono API |
| **Runtime** | Node.js | Bun / Node.js / Cloudflare Workers |
| **Deployment** | Docker / VPS | Cloudflare Pages, Netlify, or Docker |
| **Database** | File-based SQLite (`knex`) | Drizzle ORM (Postgres / Cloudflare D1 / SQLite) |
| **Web App** | Integrated with server | Vite SPA (apps/web) |
| **Zipping** | `archiver` (Node-specific) | `jszip` (Browser/Serverless compatible) |

# Configuration (Env Variables)

The following environment variables are required for a successful deployment:

### General
- `NODE_ENV`: Set to `production` or `development`.
- `MAX_FILE_SIZE_MB`: Max upload size for `.sqlite` files (default: `100`).

### Authentication
- `DASHBOARD_PASSWORD`: *(Optional)* Set a password to protect the web dashboard. If not set, the app is publicly accessible.
- `JWT_SECRET`: *(Recommended)* A secret string used to sign JWT tokens. Defaults to a built-in value if not set — **set this in production**.

### Database
- `DATABASE_URL`: **Required.** Connection string for your database (e.g., PostgreSQL).
- `DATA_PATH`: Local path for SQLite data (if not using a remote DB).

### AI Integration (Optional)
Used for fetching book genres and summaries automatically. If both are provided, Gemini is prioritized.
- `GEMINI_API_KEY`: API key for Google Gemini (Recommended, has a generous free tier).
- `OPENAI_API_KEY`: API key for OpenAI.
- `OPENAI_PROJECT_ID`: *(Optional)* OpenAI Project ID.
- `OPENAI_ORG_ID`: *(Optional)* OpenAI Organization ID.

### Third-party Integrations
- `IMGBB_API_KEY`: API key for ImgBB cover storage (Get it from [api.imgbb.com](https://api.imgbb.com/)).
- `IMGUR_CLIENT_ID`: Client ID for Imgur cover storage (Register an app at [api.imgur.com](https://api.imgur.com/oauth2/addclient)).
- `FLICKR_*`: Keys and tokens for Flickr integration (Get them from [flickr.com/services/apps/by/me](https://www.flickr.com/services/apps/by/me)).
- `WEBDAV_*`: URL and credentials for WebDAV storage (e.g., Nextcloud, Infomaniak).

# Deployment Guide

### 1. Unified Local Development

Run the entire stack (frontend + backend) concurrently:
```bash
npm run dev
```
Access the dashboard at `http://localhost:5173`. Frontend API calls are automatically proxied to the backend at `http://localhost:3000`.

### 2. Cloudflare Pages (Recommended)

KoInsight is configured for Cloudflare Pages with Functions.

1. Install [Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/): `npm install -g wrangler`
2. Build the web app: `npm run build:web`
3. Deploy to Cloudflare:
   ```bash
   npm run deploy:wrangler
   ```
   *This uses the root `wrangler.toml` to configure assets and the Hono worker.*

### 3. Netlify

1. Build the project: `npm run build`
2. Deploy using the [Netlify CLI](https://docs.netlify.com/cli/get-started/):
   ```bash
   npm run dev:server:netlify
   ```
   *Netlify Dev handles the local emulation of functions and redirects.*

# Usage

## Reading statistics

To start seeing data in KoInsight, you need to upload your reading statistics.
Currently, there are two ways to do this:

1. **Manual upload**: Extract your `statistics.sqlite` (in settings folder) file from KOReader and upload it using the **"Upload Statistics DB"** button in KoInsight.
2. **Sync plugin**: Install and configure the KoInsight plugin in KOReader to sync your data directly.

### KOReader sync plugin

The KoInsight plugin syncs your reading statistics from KOReader to KoInsight.

**Installation:**

1. Download the plugin ZIP bundle from the **"KOReader Plugin"** button in the main menu.
1. Extract it into your `KOReader/plugins/` folder.
1. For the plugin to be installed correctly, the file structure should look like this:
   ```
   koreader
   └── plugins
       └── koinsight.koplugin
           ├── _meta.lua
           ├── main.lua
           └── ...
   ```

**Usage:**

1. Open the KOReader app.
1. Go to the **Tools** menu and open **KoInsight** (it should be below "More tools").
1. Click **Configure KoInsight** and enter your KoInsight server URL (e.g., `http://server-ip:3000`).
   - ⚠️ Make sure your KOReader device has network access to the server.
1. Click **Sync** in the KoInsight plugin menu.

Reload the KoInsight web dashboard. If everything went well (🤞), your data should appear.

### Manual Upload: `statistics.sqlite`

1. Open a file manager on your KOReader device.
1. Navigate to the `KOReader/settings/` folder.
1. Locate the `statistics.sqlite` file.
1. Copy it to your computer.
1. Upload it to KoInsight using the **"Upload Statistics DB"** button.
1. Reload the KoInsight web dashboard.

Every time you need to reupload data, you would need to upload the statistics database file again.

## Use as progress sync server

You can use your KoInsight instance as a KOReader sync server. This allows you to sync your reading progress across multiple devices.

1. Open the KOReader app.
1. Go to the **Tools** menu and open **Progress sync**
1. Set the server URL to your KoInsight instance (e.g., `http://server-ip:3000`).
1. Register an account and login.
1. Sync your progress.

The progress sync data should appear in the **"Progress syncs"** page in KoInsight.

# Development

See [DEVELOPMENT.md](DEVELOPMENT.md) for development setup and instructions.

# Roadmap

(a.k.a things I want to do)

See [Project board](https://github.com/users/GeorgeSG/projects/2)
