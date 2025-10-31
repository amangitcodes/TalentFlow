#  TalentFlow – A Mini Hiring Platform

**TalentFlow** is a lightweight yet feature-rich **React + Vite** application that empowers HR teams to manage **Jobs**, **Candidates**, and **Assessments** — entirely on the front-end.  
It simulates a full hiring workflow using **Mock Service Worker (MSW)** and persists data locally with **IndexedDB** via **Dexie**.  
No backend required — yet it feels like one!

---

##  Live Demo

🔗 **Deployed App:** [Add your Vercel or Netlify link here]  
💻 **GitHub Repository:** [https://github.com/amangitcodes/TalentFlow](https://github.com/amangitcodes/TalentFlow)

---

## ✨ Core Features

###  Job Management
- Create, edit, archive, and reorder job postings.  
- Drag-and-drop reordering with **optimistic updates** and rollback on failure.  
- Filter, search, and paginate through jobs.  
- Deep-linking to `/jobs/:jobId`.

###  Candidate Management
- Manage 1000+ candidates with **virtualized lists** for speed.  
- Kanban-style stage management (Applied → Screen → Tech → Offer → Hired/Rejected).  
- Candidate profiles with **status timeline** and **notes with @mentions**.  
- Local persistence of all candidate data.

###  Assessment Builder
- Build **job-specific assessments** with multiple sections and different question types.  
- Live preview of assessments before publishing.  
- Conditional questions (e.g., show Q3 only if Q1 === “Yes”).  
- Validation rules and local persistence of both assessments and responses.

---

## ⚙️ Advanced Functionality

| Feature | Description |
|----------|-------------|
|  Offline-first | Data persisted locally in IndexedDB via Dexie |
|  Mock Backend | Complete REST simulation with MSW |
|  Optimistic UI | Fast user feedback with rollback on simulated errors |
|  Modular Architecture | Feature-based folder organization |
|  Responsive Design | Tailwind CSS for a clean, adaptive UI |


---

##  Tech Stack

| Category | Tools |
|-----------|-------|
| **Frontend Framework** | React 19.2 + Vite 7 |
| **Styling** | Tailwind CSS 4 |
| **Routing** | React Router DOM 6.30 |
| **State Management** | React Hooks + Redux Toolkit |
| **Persistence Layer** | IndexedDB (Dexie 4.2) |
| **Mock API** | MSW 1.3.5 |
| **Drag & Drop** | @hello-pangea/dnd |
| **Virtualization** | react-window |
| **Icons & UI** | Lucide React, React Hot Toast |
| **Linting & Tools** | ESLint, PostCSS, Autoprefixer |

---

## 📁 Project Structure

```bash
TalentFlow-main/
├── public/
│   ├── mockServiceWorker.js
│   └── vite.svg
├── src/
│   ├── features/
│   │   ├── assessments/     # Builder, Preview, Runtime components
│   │   ├── candidates/      # Candidate board, list, notes, profile
│   │   ├── dashboard/       # HR dashboard
│   │   ├── jobs/            # Job details, form, list, slice
│   │   └── layout/          # Navbar and layout
│   ├── indexedDB/           # Dexie-based local databases
│   ├── mocks/               # MSW API mocks
│   │   ├── jobsAPI.js
│   │   ├── jobsHandlers.js
│   │   ├── candidatesAPI.js
│   │   ├── candidatesHandlers.js
│   │   ├── assessmentsAPI.js
│   │   ├── assessmentsHandlers.js
│   │   ├── handlers.js
│   │   └── browser.js
│   ├── utils/               # Data seeding scripts
│   ├── store/               # App-wide store configuration
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .gitignore
├── eslint.config.js
├── index.html
└── package.json
```

---

## ⚙️ Local Setup

###  Prerequisites
Make sure you have:
- **Node.js ≥ 16**
- **npm** 

---

### 🔧 Installation Steps

```bash
# 1️⃣ Clone the repository
git clone https://github.com/amangitcodes/TalentFlow.git
cd TalentFlow-main

# 2️⃣ Install all dependencies
npm install

# 3️⃣ Start the development server
npm run dev

# 4️⃣ Build the project for production
npm run build

# 5️⃣ Preview the optimized production build
npm run preview
```

After running the dev server, open your browser at  
👉 **http://localhost:5173**


---

##  Architecture Highlights

- **Frontend-Only**: Entire app runs in browser; MSW simulates all API endpoints.  
- **Persistence Layer**: Dexie provides IndexedDB read/write abstraction.  
- **Optimistic Updates**: Instant UI response with rollback when mock API returns failure.  
- **Error Simulation**: 5–10% write requests randomly fail for realism.  
- **Modular Design**: Each domain (jobs, candidates, assessments) isolated in `/features/`.

---

## 🔮 Future Enhancements
-  Authentication & role-based access  
-  Analytics dashboard for HR metrics  
-  Email notifications & templates  
-  Assessment library & versioning  
- 🌍Multi-language (i18n) support  
-  Dark mode theme  
-  AI-assisted candidate screening  


---

## 📝 License
This project is licensed under the **MIT License** — free for use and modification with attribution.

---

> **TalentFlow — Streamlining the hiring process for modern HR teams.**
