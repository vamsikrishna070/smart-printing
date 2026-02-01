# SmartPrint

A web-based print queue management system for college stationery shops. Students can submit print jobs online, and staff can manage the queue efficiently.

## What it does

Students upload documents and join a print queue. They can see their position and estimated wait time. Staff members manage the queue by updating job statuses (pending, printing, ready for pickup, completed). The system updates in near real-time so students know when to collect their prints.

Built with React for the frontend and Express + MongoDB for the backend.

## Technologies Used

**Frontend:**  
React, Vite, Tailwind CSS, TanStack Query, Wouter (routing), Framer Motion

**Backend:**  
Express, MongoDB with Mongoose, Passport.js

**Other:**  
Multer (file uploads), Zod (validation)

## Prompt Template & Prompts Used

This project was built with the help of AI as a development support tool. AI was mainly used to understand architecture, backend logic, and deployment steps. All generated outputs were reviewed and modified before integration.

**Prompt Template**

"Help me build a full-stack web application using React for the frontend and Express with MongoDB for the backend. Explain things step by step and follow good practices for authentication, database design, and deployment."

**Prompts Used During Development**

- "Help me design a college print management system where students upload files for printing and staff manage a print queue."
- "How do I implement login and signup using Passport.js with student and staff roles?"
- "Design MongoDB schemas for users and print jobs with file details, print options, status, and timestamps."
- "How can I upload PDF, DOCX, and image files using Multer in an Express app?"
- "Create a print job queue where staff update job status and students track progress."
- "Use TanStack Query to fetch and update print job data in React."
- "How do I deploy a React app on Vercel and an Express backend on Render with MongoDB Atlas?"

## Setup

You'll need Node.js (v18+) and a MongoDB database.

1. Clone the repository and install dependencies:

   ```bash
   npm install
   ```

2. Create `backend/.env`:

   ```env
   DATABASE_URL=mongodb+srv://your-connection-string
   SESSION_SECRET=some-random-string
   PORT=5000
   ```

3. Create a staff account (run once):

   ```bash
   cd backend
   npm run seed
   ```

   The script will prompt for a username and password.

4. Start development servers:
   ```bash
   npm run dev
   ```
   Open http://localhost:5173

## Project Structure

```
Super-Good-UI/
├── backend/
│   ├── server/
│   │   ├── index.js        # Express server
│   │   ├── auth.js         # Authentication
│   │   ├── routes.js       # API routes
│   │   ├── models.js       # MongoDB schemas
│   │   ├── seed.js         # Staff account setup
│   │   └── ...
│   ├── uploads/            # Uploaded files
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── pages/          # Dashboards
│   │   ├── components/     # UI components
│   │   ├── hooks/          # Custom hooks
│   │   └── ...
│   └── vite.config.js
└── shared/
    ├── routes.js           # Shared route definitions
    └── schema.js           # Zod schemas
```

## Usage

### Student Features

- Register/Login to account
- Upload documents for printing
- Specify copies and print type (B&W or Color)
- Track print job status in real-time
- View estimated wait time
- Update profile and contact information

### Staff Features

- View all pending print jobs
- Start printing jobs
  **Student Features**

- Register and login
- Upload documents for printing
- Choose copies and print type (B&W / Color)
- Track job status
- View estimated wait time
- Update profile information
  Frontend is deployed on Vercel, backend on Render.

**Frontend (Vercel)**

- Root directory
- Environment variable:
  ```
  VITE_API_URL=https://your-backend.onrender.com
  ```

**Backend (Render)**

- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Environment variables:
  ```
  DATABASE_URL=your-mongodb-connection-string
  SESSION_SECRET=random-secure-string
  NODE_ENV=production
  FRONTEND_URL=https://your-vercel-app.vercel.app
  ```

After deployment, run the seed script against the production database to create a staff account.Notes

- Students can only see their own jobs, staff see everything
- Job data is stored in MongoDB, uploaded files are saved on the server disk
- Session cookies handle authentication
- Real-time updates happen through React Query polling
  view their own print jobs
- Staff can view and manage all jobs
- Uploaded files are stored on the server disk
- Authentication uses session cookies
- Real-time updates use
