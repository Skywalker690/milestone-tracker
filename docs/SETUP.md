# Quick Setup Guide

Get Milestone Tracker up and running in minutes with this step-by-step guide.

## Prerequisites Checklist

Before you begin, make sure you have:

- [ ] Java 21 or higher installed (`java -version`)
- [ ] Node.js 18 or higher installed (`node -v`)
- [ ] PostgreSQL 12 or higher installed and running
- [ ] Git installed (`git --version`)
- [ ] A code editor (VS Code, IntelliJ IDEA, etc.)

## 5-Minute Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/Skywalker690/milestone-tracker1.git
cd milestone-tracker1
```

### Step 2: Set Up PostgreSQL Database

1. Start PostgreSQL service
2. Open PostgreSQL command line or pgAdmin
3. Create a new database:

```sql
CREATE DATABASE milestone_tracker;
```

4. Note your PostgreSQL username and password

### Step 3: Configure Backend

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Create a `.env` file:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` and update with your values:
   ```env
   DB_URL=jdbc:postgresql://localhost:5432/milestone_tracker
   DB_USERNAME=your_postgres_username
   DB_PASSWORD=your_postgres_password
   JWT_SECRET=your_secret_key_here_at_least_256_bits_long
   JWT_EXPIRATION=86400000
   ```

   **Generate a secure JWT secret:**
   ```bash
   # On Linux/Mac:
   openssl rand -base64 64
   
   # Or use any long random string (minimum 32 characters)
   ```

4. Start the backend:
   ```bash
   ./mvnw spring-boot:run
   ```
   
   Wait for the message: `Started BackendApplication in X seconds`

### Step 4: Configure Frontend

1. Open a new terminal and navigate to the client directory:
   ```bash
   cd client
   ```

2. Create a `.env` file:
   ```bash
   cp .env.example .env
   ```

3. The default values should work:
   ```env
   REACT_APP_API_BASE_URL=http://localhost:8080
   ```

4. Install dependencies:
   ```bash
   npm install
   ```
   
   This may take 2-3 minutes.

5. Start the frontend:
   ```bash
   npm start
   ```
   
   Your browser should automatically open to `http://localhost:3000`

### Step 5: Create Your First Account

1. Click "Sign Up" or "Register"
2. Fill in your details:
   - Name: Your full name
   - Email: your@email.com
   - Password: A secure password
3. Click "Register"
4. You'll be automatically logged in!

### Step 6: Create Your First Milestone

1. Click the "+" button
2. Fill in the milestone details:
   - **Title**: e.g., "Complete project documentation"
   - **Description**: Details about your milestone
   - **Target Date**: When you want to achieve it
3. Click "Create" or "Save"
4. Your milestone appears on the dashboard!

## 🎉 You're All Set!

The application is now running:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080

## Common Issues and Solutions

### Issue: Port Already in Use

**Backend (Port 8080):**
```bash
# Find process using port 8080
lsof -ti:8080

# Kill the process
kill -9 <PID>
```

**Frontend (Port 3000):**
```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
kill -9 <PID>
```

Or start on a different port:
```bash
PORT=3001 npm start
```

### Issue: Database Connection Failed

1. **Check PostgreSQL is running:**
   ```bash
   # On Linux
   sudo systemctl status postgresql
   
   # On Mac with Homebrew
   brew services list
   
   # On Windows
   # Check Services app for PostgreSQL
   ```

2. **Verify database exists:**
   ```sql
   \l  # In psql command line
   ```

3. **Check credentials in `.env` file**

### Issue: Maven Build Fails

1. **Clear Maven cache:**
   ```bash
   ./mvnw clean
   ```

2. **Update dependencies:**
   ```bash
   ./mvnw clean install -U
   ```

### Issue: Node Modules Issues

1. **Clear npm cache:**
   ```bash
   rm -rf node_modules package-lock.json
   npm cache clean --force
   npm install
   ```

2. **Use yarn instead:**
   ```bash
   npm install -g yarn
   yarn install
   yarn start
   ```

### Issue: JWT Token Errors

Make sure your `JWT_SECRET` in `.env` is:
- At least 256 bits (32 characters) long
- The same between restarts
- Properly set without quotes or spaces

## Development Tips

### Hot Reload

Both frontend and backend support hot reload:
- **Frontend**: Changes auto-refresh in browser
- **Backend**: Use Spring Boot DevTools or restart manually

### Testing API Endpoints

Use tools like:
- **Postman**: Import endpoints from API.md
- **curl**: Command-line testing
- **Thunder Client**: VS Code extension

Example curl command:
```bash
# Login
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"yourpassword"}'
```

### Database GUI Tools

Recommended tools for database management:
- **pgAdmin**: Full-featured PostgreSQL GUI
- **DBeaver**: Universal database tool
- **TablePlus**: Modern, native GUI

## Next Steps

- 📖 Read the full [README.md](README.md) for detailed information
- 🏗️ Check out [ARCHITECTURE.md](ARCHITECTURE.md) to understand the system design
- 🔌 Review [API.md](API.md) for API documentation
- 🤝 See [CONTRIBUTING.md](CONTRIBUTING.md) to contribute
- 📝 Check [CHANGELOG.md](CHANGELOG.md) for version history

## Getting Help

If you encounter issues:

1. **Check Documentation**: README.md, API.md, ARCHITECTURE.md
2. **Search Issues**: [GitHub Issues](https://github.com/Skywalker690/milestone-tracker1/issues)
3. **Ask Questions**: Open a new issue with the `question` label
4. **Read Code of Conduct**: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)

## Stopping the Application

### Stop Frontend
Press `Ctrl + C` in the terminal running npm start

### Stop Backend
Press `Ctrl + C` in the terminal running mvn spring-boot:run

### Stop PostgreSQL (Optional)
```bash
# On Linux
sudo systemctl stop postgresql

# On Mac with Homebrew
brew services stop postgresql
```

---

Happy milestone tracking! 🎯
