# SmartPrint - Print Management System

A modern print queue management system built with React, Express, and MongoDB.

## Features

- 🖨️ **Smart Queue Management** - Real-time print job tracking and status updates
- 👥 **Role-Based Access** - Separate interfaces for students and staff
- 📄 **Document Upload** - Support for PDF, DOCX, and image files
- 📊 **Dashboard Analytics** - Track pending, printing, and completed jobs
- 🔐 **Secure Authentication** - Session-based auth with encrypted passwords
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- ⚡ **Real-time Updates** - Live queue status with TanStack Query
- 🎨 **Modern UI** - Beautiful interface with Tailwind CSS and Framer Motion

## Tech Stack

### Frontend

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Wouter** - Lightweight routing
- **TanStack Query** - Server state management
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animations
- **Radix UI** - Accessible components
- **React Hook Form + Zod** - Form validation

### Backend

- **Express 5** - Web framework
- **MongoDB + Mongoose** - Database
- **Passport.js** - Authentication
- **Express Session** - Session management
- **Multer** - File uploads
- **Zod** - Schema validation

## Installation

### Prerequisites

- Node.js v18 or higher
- MongoDB Atlas account (or local MongoDB)

### Setup

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd Super-Good-UI
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create `backend/.env` file:

   ```env
   DATABASE_URL=mongodb+srv://your-connection-string
   SESSION_SECRET=your-secret-key
   PORT=5000
   NODE_ENV=development
   ```

4. **Seed staff account** (optional)

   ```bash
   cd backend
   node server/seed.js
   ```

   Default staff credentials:
   - Username: `staff`
   - Password: `staff123`

5. **Start development servers**

   Terminal 1 (Backend):

   ```bash
   cd backend
   npm run dev
   ```

   Terminal 2 (Frontend):

   ```bash
   cd frontend
   npm run dev
   ```

6. **Open the application**

   Navigate to `http://localhost:5173`

## Project Structure

```
Super-Good-UI/
├── backend/
│   ├── server/
│   │   ├── auth.js          # Authentication logic
│   │   ├── db.js            # Database connection
│   │   ├── index.js         # Express server
│   │   ├── models.js        # Mongoose schemas
│   │   ├── routes.js        # API routes
│   │   ├── seed.js          # Database seeding
│   │   ├── static.js        # Static file serving
│   │   ├── storage.js       # Storage interface
│   │   └── vite.js          # Vite middleware
│   ├── uploads/             # Uploaded files
│   ├── package.json
│   └── .env                 # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── layout.jsx
│   │   │   └── ui/          # UI components
│   │   ├── hooks/           # Custom hooks
│   │   ├── lib/             # Utilities
│   │   ├── pages/           # Page components
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   │   └── favicon.svg      # App icon
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── shared/
    ├── routes.js            # API route definitions
    └── schema.js            # Zod schemas

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
- Mark jobs as ready for pickup
- Complete jobs
- Download uploaded files
- View student contact information
- Search jobs by file name or student

## Deployment

### Frontend (Vercel/Netlify)

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```
2. Deploy the `dist` folder

### Backend (Railway/Render/Heroku)

1. Set environment variables in your hosting platform
2. Deploy the backend directory
3. Update frontend API proxy configuration

### Environment Variables for Production

- `DATABASE_URL` - MongoDB connection string
- `SESSION_SECRET` - Strong random string
- `NODE_ENV=production`
- `PORT` - Server port (often set by host)

## API Endpoints

### Authentication

- `POST /api/register` - Register new user
- `POST /api/login` - Login user
- `POST /api/logout` - Logout user
- `GET /api/user` - Get current user

### Print Jobs

- `GET /api/jobs` - Get all jobs (filtered by role)
- `POST /api/jobs` - Create new print job
- `PATCH /api/jobs/:id` - Update job status
- `GET /uploads/:filename` - Download uploaded file

### User Profile

- `PATCH /api/user/profile` - Update profile
- `PATCH /api/user/password` - Change password

## License

MIT

## Support

For issues and questions, please create an issue in the repository.
