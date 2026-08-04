# QuizArena

A real-time multiplayer quiz battle app built for kids aged 1–16.
Players join live rooms, answer questions against the clock, and
climb a global ELO leaderboard.

**Live Demo:** quizarena-eta.vercel.app

## What it does

- **Solo play** ,pick a category and play alone, your score and ELO still update
- **Host a game** , create a room, get a 6-character code, share it and play with others
- **Join a game** ,enter a room code and jump straight into a live battle
- Questions are pulled live from the Open Trivia API no manual quiz creation needed
- ELO ranking system ,your rating goes up when you win and down when you lose

## Tech stack

**Frontend**
- React + TypeScript
- Vite
- React Router
- CSS Modules
- Socket.io client

**Backend**
- Node.js + Express
- TypeScript
- Socket.io
- Prisma ORM
- PostgreSQL
- JWT authentication
- bcrypt password hashing

Follow these steps to set up QuizArena locally on your machine.
### Installation & Setup
**Clone the repository**
   ```bash
   git clone https://github.com/Grey001-dev/quizarena.git
