# Code Snippets Manager

A full-stack web application for managing and sharing code snippets, built as part of my first-year studies at Linnaeus University. This project demonstrates core web development concepts including CRUD operations, user authentication, and database management.

## 📝 About

This application allows users to create, read, update, and delete code snippets in a persistent database. It features user authentication with secure password hashing, session management, and role-based access control to ensure that only snippet owners can modify or delete their content.

**Created during:** First year as a student at Linnaeus University (2024)  
**Course:** 1DV026 - Server-based Web Programming

## ✨ Features

- **User Authentication**
  - User registration with unique usernames
  - Login/Logout functionality
  - Password encryption using bcrypt
  - Session-based authentication

- **Snippet Management (CRUD)**
  - **Create:** Authenticated users can add new code snippets
  - **Read:** All users (including anonymous) can view snippets
  - **Update:** Only snippet owners can edit their snippets
  - **Delete:** Only snippet owners can delete their snippets
  - Support for multiline code snippets

- **Security Features**
  - Password hashing with bcryptjs
  - Session management with express-session
  - Authorization checks to prevent unauthorized access
  - Proper HTTP status codes (404, 403, 500)

- **User Experience**
  - Flash messages for user feedback
  - Intuitive UI with conditional rendering based on permissions
  - EJS templating for dynamic content

## 🛠️ Technologies Used

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling (ODM)

### Authentication & Security
- **express-session** - Session management
- **bcryptjs** - Password hashing
- **cookie-parser** - Cookie parsing middleware

### Frontend
- **EJS** - Embedded JavaScript templating
- **HTML/CSS** - Structure and styling

### Development Tools
- **Nodemon** - Development server with auto-restart
- **ESLint** - Code linting and quality assurance

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/assignment-b1-crud-snippets.git
cd assignment-b1-crud-snippets
```

2. Install dependencies:
```bash
npm install
```

3. Set up MongoDB:
   - Use MongoDB Atlas (cloud) or a local MongoDB instance
   - Configure your connection string in the application

4. Start the application:
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

5. Access the application at `http://localhost:3000` (or configured port)

## 🚀 Usage

### For Anonymous Users
- View all available code snippets
- Browse snippet details

### For Registered Users
- Create an account with a unique username
- Log in to access full features
- Create new code snippets
- Edit your own snippets
- Delete your own snippets

## 📁 Project Structure

```
assignment-b1-crud-snippets/
├── src/
│   ├── server.js              # Main application entry point
│   ├── controllers/           # Request handlers
│   │   ├── index.controller.js
│   │   ├── snippet.controller.js
│   │   └── user.controller.js
│   ├── models/                # Database models
│   │   ├── snippet.model.js
│   │   └── user.model.js
│   ├── routes/                # Route definitions
│   │   ├── register.js
│   │   └── snippets.js
│   └── views/                 # EJS templates
│       ├── home.ejs
│       ├── register.ejs
│       ├── add.ejs
│       ├── editSnippet.ejs
│       ├── viewSnippet.ejs
│       └── deleteSnippet.ejs
├── package.json
└── README.md
```

## 🧪 Scripts

```bash
npm start          # Start the application
npm run dev        # Start with nodemon for development
npm run lint       # Run ESLint
npm run lint:fix   # Run ESLint with auto-fix
```

## 🔒 Security Considerations

- Passwords are hashed using bcryptjs before storage
- Session-based authentication without external packages (no Passport)
- HTTP-only cookies for session security
- Authorization checks prevent unauthorized snippet modifications
- Proper error handling with appropriate HTTP status codes

## 📄 License

MIT

## 👤 Author

**Max Lindquist**  
First-year student at Linnaeus University

---

*This project was developed as part of Assignment B1 for the course 1DV026 - Server-based Web Programming during my first year at Linnaeus University.*
