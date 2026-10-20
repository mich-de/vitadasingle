# VitaApp

## Project Overview

VitaApp is a comprehensive application designed to manage various aspects of a business, including bookings, expenses, documents, and more. It features a React-based frontend and an Express.js backend, providing a robust and scalable solution for business management.

## Tech Stack

### Frontend

- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Routing**: React Router DOM
- **Icons**: Lucide React

### Backend

- **Framework**: Express.js
- **Language**: JavaScript/Node.js
- **Database**: JSON files (for simplicity, can be extended to a proper database)

## Project Structure

```
vitaapp/
├── 📁 backend/          # Express.js server
│   ├── server.js       # Main server file
│   └── package.json    # Backend dependencies
├── 📁 frontend/         # React application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Application pages
│   │   ├── services/   # API communication
│   │   ├── types/      # TypeScript definitions (common, entities, features)
│   │   ├── hooks/      # Custom React hooks
│   │   ├── utils/      # Utility functions (dateHelpers, formatters)
│   │   └── main.tsx    # Application entry point
│   └── package.json    # Frontend dependencies
├── 📁 data/            # JSON database files
│   ├── bookings.json   # Reservation data
│   ├── expenses.json   # Financial records
│   ├── contacts.json   # Contacts data
│   ├── documents.json  # Documents data
│   ├── events.json     # Events data
│   ├── properties.json  # Properties data
│   ├── deadlines.json   # Deadlines data
│   ├── expenses.json      # Expenses data
│   ├── vehicles.json    # Vehicles data
│   └── workouts.json   # Workouts data
├── scripts/            # Various utility scripts
├── .gitignore          # Git ignore file
├── README.md           # Project documentation (this file)
└── package.json        # Root project dependencies (if any)
```

## Setup Instructions

To get the VitaApp up and running on your local machine, follow these steps:

### Prerequisites

Make sure you have the following installed:

- Node.js (LTS version recommended)
- npm or Yarn

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd vitaapp
    ```

2.  **Install Backend Dependencies:**

    ```bash
    cd backend
    npm install
    cd ..
    ```

3.  **Install Frontend Dependencies:**

    ```bash
    cd frontend
    npm install
    cd ..
    ```

## Running the Application

### Start the Backend Server

From the root directory of the project, navigate to the `backend` directory and start the server:

```bash
cd backend
node server.js
```

The backend server will typically run on `http://localhost:3000`.

### Start the Frontend Development Server

From the root directory of the project, navigate to the `frontend` directory and start the development server:

```bash
cd frontend
npm run dev
```

The frontend application will typically open in your browser at `http://localhost:5173` (or another available port).

## Usage

Once both the backend and frontend servers are running, you can access the application through your web browser. The application provides various modules for managing:

-   **Bookings**: Schedule and manage appointments.
-   **Expenses**: Track and categorize financial expenditures.
-   **Documents**: Store and organize important documents.
-   **Contacts**: Manage client and vendor information.
-   **Events**: Plan and keep track of events.
-   **Properties**: Manage property details.
-   **Deadlines**: Keep track of important due dates.
-   **Vehicles**: Manage vehicle information.
-   **Workouts**: Track workout routines.

Explore the different sections of the application to utilize its full capabilities.