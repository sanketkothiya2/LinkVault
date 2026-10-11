# LinkVault - Personal Resource Library & Productivity Workspace

![LinkVault Preview](./public/preview.png)

> **"Collect what inspires you, Build what you dream."**

LinkVault is a modern, premium, dark-first web application designed as your personal digital library and productivity dashboard. It combines the visual discovery power of Pinterest and Raindrop.io with the precision of Linear and Notion.

---

## 🌟 Key Features

### 1. Visual Resource Discovery & Automatic Link Previews
- **Live Metadata Extraction**: Pasting any URL automatically fetches page title, Open Graph description, `og:image`, favicon, domain, and content-type.
- **YouTube Specialization**: Automatically embeds high-resolution thumbnails, channel attribution, and play indicators.
- **SSRF-Protected Backend**: Prevents Server-Side Request Forgery by blocking local IP addresses (`127.0.0.1`, RFC 1918 private subnets, cloud metadata `169.254.169.254`), enforcing timeouts, and limiting response sizes to 1MB.
- **Graceful Fallbacks**: Generates branded domain cards when sites omit metadata.
- **Resource Details Modal**: Deep view with notes editor, tag manager, copy link, favorite, archive, and delete with confirmation.

### 2. Master Dashboard (Faithfully crafted from reference design)
- **Top Omnibar Header**: Global search across resources, tags, categories, tasks, and goals with keyboard shortcut (`⌘K` / `Ctrl+K`), theme switcher, notifications, and user avatar.
- **Hero Greeting Banner**: Personalized greeting (*"Good Morning, Sanket"*), daily quote, and skyline artwork.
- **Metric Stat Cards**: Real-time counters for Total Resources, Favorites, Tasks Today, and Active Goals with trend badges.
- **Recently Added Grid**: Visual cards with hover transitions, video overlays, and favorite badges.
- **Recently Viewed / Collections Carousel**: Quick access to top collections like Animation & Motion, 3D Websites & Three.js, UI/UX Design, and more.
- **Right Column Panel**:
  - **Quick Add Resource**: URL bar with instantaneous metadata preview card and content type pills.
  - **Today's Tasks**: Interactive checklist with priority badges (Urgent, High, Medium, Low) and scheduled times.
  - **Goals Tracker**: Progress bars with percentage tracking and milestone counts.
  - **Mini Calendar**: Interactive calendar widget with active date highlights.

### 3. Productivity & Goal Management
- **Task Management**: Dedicated views for Today, Upcoming, All Tasks, and Completed with priority sorting and subtasks.
- **Goal Hub**: Set long-term targets, track milestone completion percentages, and link saved resources directly to goals.
- **Celebration Feedback**: Confetti animations upon completing tasks or reaching 100% on goals.

### 4. Data Ownership & Migration
- **HTML Bookmark Import**: Directly imports Netscape-format bookmark exports from Chrome, Safari, and Firefox with duplicate detection.
- **JSON & CSV Export**: Export full database backups or CSV spreadsheets anytime.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router, Server Actions & Edge API Routes) |
| **Frontend Library** | React 19 + TypeScript |
| **Styling** | Tailwind CSS with dark-first theme & custom glassmorphism |
| **Icons** | Lucide React |
| **Scraping & Metadata** | Cheerio + Native Fetch with SSRF Guardrails |
| **Database & Auth** | Supabase PostgreSQL with Row Level Security (RLS) + Local Fallback |
| **Celebrations** | Canvas Confetti |

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ (tested on Node.js v24 LTS)
- npm or pnpm

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-username/linkvault.git
cd linkvault

# Install dependencies
npm install
```

### 3. Environment Variables (Optional)
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

For immediate local usage, LinkVault runs with zero external configuration using built-in persistent storage. To connect your remote Supabase PostgreSQL database:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
npm run start
```

---

## 🗄️ Database Setup (Supabase)

To deploy the schema to your Supabase project:
1. Navigate to the SQL Editor in your [Supabase Dashboard](https://supabase.com).
2. Open `supabase/migrations/20250101_initial_schema.sql`.
3. Paste the contents and run the query.
4. Row Level Security (RLS) policies are automatically configured to guarantee complete user isolation.

---

## 🧪 Testing

Run backend security and metadata extraction verification:
```bash
node tests/metadata.test.js
```

---

## 📦 Deployment

### Deploying to Netlify
1. Connect your GitHub repository to Netlify.
2. Set Build Command: `npm run build`
3. Set Publish Directory: `.next`
4. Add environment variables `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

### Deploying to Vercel
1. Import the repository into Vercel.
2. Next.js App Router defaults will be automatically detected.
3. Click **Deploy**.
