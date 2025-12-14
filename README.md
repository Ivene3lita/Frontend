# Digital Library Catalogue System - Frontend

Frontend application for the Digital Library Catalogue System built with HTML, CSS, and Vanilla JavaScript.

## 🛠️ Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS variables and flexbox/grid
- **JavaScript** - Vanilla JavaScript 
- **Fetch API** - Asynchronous HTTP requests

## 🚀 Features

### Authentication & User Management
- 🔐 Secure user registration and login system
- 👤 Student account creation
- 👨‍💼 Admin user role support with protected routes
- 📱 Responsive authentication UI

### Book Catalogue (All Users)
- 📚 View all books in a beautiful, responsive grid layout
- 🔍 Real-time search by title, author, or ISBN
- 🏷️ Filter books by genre and availability status
- 📊 Comprehensive book details display:
  - Title, Author, ISBN
  - Genre, Publication Year, Publisher
  - Description and availability status
- ✅ Real-time availability status indicators
- 🎨 Modern card-based UI with hover effects

### Admin Features (Admin Only)
- ➕ Add new books to the catalogue
- ✏️ Edit existing book information
- 🗑️ Delete books from the catalogue with confirmation
- 📋 View all borrowed books across all users
- 👥 See user information for each borrowing

### Student Features
- 📖 Borrow available books with one click
- 📅 Automatic 14-day period tracking
- 🔄 Return borrowed books
- 📋 Personal borrowing history in dedicated "My Books" page
- ⚠️ Visual overdue book tracking and status indicators
- 📊 View borrowing dates, due dates, and return dates

### User Experience
- 🎯 Toast notifications for all user actions
- ⚡ Fast, responsive interface
- 📱 Mobile-friendly responsive design
- 🎨 Clean, modern UI with smooth animations
- 🔄 Real-time updates without page refresh
- ⚠️ Clear error messages and validation

## 🌐 Live Deployment

The frontend is currently deployed at:
- **URL:** (https://ivene3lita.github.io/Frontend/)
- **Backend API:** (https://backend-dzci.onrender.com)

## 🔑 Admin Access

Default admin credentials:
- **Username:** `admin`
- **Password:** `admin12`

## 📖 Usage Guide

### For Students

1. **Registration:**
   - Click "Create Account" on the login page
   - Fill in required fields (First Name, Last Name, Username, Email, Password)
   - Optionally add Student ID and Phone number
   - Submit to create your account

2. **Login:**
   - Enter your username/email and password
   - Click "Login" to access the system

3. **Browse Books:**
   - View all books in the catalogue
   - Use the search bar to find books by title, author, or ISBN
   - Filter by genre or availability status
   - Click "Clear Filters" to reset

4. **Borrow Books:**
   - Find an available book
   - Click the "Borrow" button
   - The book will be borrowed for 14 days
   - A toast notification will show the due date

5. **View My Books:**
   - Click the "My Books" tab in the navigation
   - See all your borrowed books
   - View due dates and overdue status
   - Return books by clicking "Return Book"

### For Admins

1. **Login:**
   - Use admin credentials (username: `admin`, password: `admin12`)

2. **Manage Books:**
   - Click "+ Add New Book" to add new books
   - Click "Edit" on any book card to modify book information
   - Click "Delete" to remove books (with confirmation)
   - All new books are automatically set as available

3. **View All Borrowings:**
   - Click "All Borrowed" in the navigation
   - See all borrowing records across all users
   - View user information, book details, and borrowing dates
   - Track overdue books

4. **All Student Features:**
   - Admins can also browse, search, and borrow books
