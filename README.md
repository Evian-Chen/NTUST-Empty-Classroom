# NTUST Empty Classroom Finder

A web application designed to help NTUST (National Taiwan University of Science and Technology) students and faculty find available classrooms on campus.
This tool crawls classroom schedules and provides an interface to search for empty rooms by building, date, or specific criteria.

## Features

- **Building-based Search**: Find empty rooms in specific buildings (T4, T3, E1, E2, EE, MA, TR, IB)
- **Date-based Search**: Search for available rooms on specific weekdays
- **Room-specific Search**: Check the schedule for a particular room
- **Time Slot Filtering**: Filter results by specific time periods (1-14 time slots)
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Data**: Automated weekly data updates via web crawling

## Tech Stack

### Frontend
- **Vue 3** 
- **Vite** 
- **Tailwind CSS** 
- **Vue Router** 

### Backend
- **Node.js** 
- **Express.js** 
- **MongoDB** 
- **Mongoose** 

### DevOps & Automation
- **GitHub Actions** - Update data weekly
- **Selenium** - Web crawling automation

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB instance
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Evian-Chen/NTUST-Empty-Classroom.git
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend/app
   npm install
   
   # Install frontend dependencies
   cd ../../frontend
   npm install
   ```

3. **Environment Configuration**
   
   Create `.env` file in the backend directory:
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   SCHOOL_START_DAY=2024-09-01
   SCHOOL_END_DAY=2025-06-30
   ```
   
   Create `.env` file in the frontend directory:
   ```env
   VITE_API_BASE=/api
   ```

4. **Start the application**
   
   **Development mode:**
   ```bash
   # Terminal 1 - Start backend
   cd backend/app
   npm start
   
   # Terminal 2 - Start frontend
   cd frontend
   npm run dev
   ```

5. **Access the application**
   - Development: `http://localhost:5173`
   - Production: `http://localhost:3000`

## Usage

### Search Methods

1. **Building + Date Search**
   - Select a building from the dropdown
   - Choose a weekday
   - Optionally specify time slots
   - Click "Search" to find available rooms

2. **Weekday Search**
   - Select a specific weekday
   - Optionally filter by time slots
   - View all available rooms across campus

3. **Room-specific Search**
   - Enter a room code (e.g., "TR-312")
   - Select a weekday
   - View the room's schedule


## Automated Data Updates

The system includes an automated web crawler that runs weekly to update classroom schedules:

- **Schedule**: Every Saturday at 9:00 AM (Taiwan time)
- **Source**: NTUST official classroom system
- **Technology**: Selenium WebDriver with headless Chrome
- **Coverage**: 8 campus buildings with 5 weekdays each

### Manual Crawler Execution

```bash
cd backend
python3 crawler.py
```


## Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set root directory to `frontend`
3. Configure build settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. Set environment variables:
   - `VITE_API_BASE`: Your backend API URL

### Backend (Render)
1. Deploy the `backend/app` directory
2. Set environment variables:
   - `MONGO_URI`: MongoDB connection string
   - `PORT`: Application port (usually auto-assigned)
   - `SCHOOL_START_DAY` & `SCHOOL_END_DAY`: Academic year dates


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
