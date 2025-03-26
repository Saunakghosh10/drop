# Drop - Digital Wall for Messages

Drop is a modern web application that allows users to leave messages on a digital wall. Users can create, position, edit, and view messages in an interactive space. It's like a virtual canvas where people can express themselves and share thoughts.

![Drop Digital Wall](https://via.placeholder.com/800x400?text=Drop+Digital+Wall)

## ✨ Features

- **Interactive Digital Wall**: Leave messages anywhere on the canvas
- **Customizable Messages**: Choose colors, font sizes, and rotations for messages
- **Drag & Drop Interface**: Easily position messages where you want them
- **User Authentication**: Secure authentication with Clerk
- **Responsive Design**: Works great on desktop and mobile devices
- **Real-time Updates**: Changes to messages appear instantly
- **Persistent Storage**: Messages are saved in a PostgreSQL database

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Server Actions
- **Database**: PostgreSQL (with Neon DB)
- **Authentication**: Clerk
- **Deployment**: Vercel (recommended)

## 📁 Project Structure

```
drop/
├── .next/                   # Next.js build output
├── node_modules/            # Node.js dependencies
├── public/                  # Static assets
├── src/
│   ├── app/                 # Next.js App Router pages and components
│   │   ├── api/             # API routes
│   │   ├── components/      # UI components
│   │   ├── debug/           # Debug page for development
│   │   ├── wall/            # Main wall page
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page
│   │   └── types.ts         # App-specific types
│   ├── lib/                 # Shared utilities
│   │   ├── db.ts            # Database connection utilities
│   │   └── dbActions.ts     # Server actions for database operations
│   ├── services/            # Service layer
│   │   └── messagesService.ts  # Message CRUD operations
│   └── types/               # Shared TypeScript interfaces
├── .env                     # Environment variables template
├── .env.local               # Local environment variables (git-ignored)
├── .eslintrc.json           # ESLint configuration
├── next.config.mjs          # Next.js configuration
├── package.json             # Project dependencies and scripts
├── tailwind.config.ts       # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- PostgreSQL database (can use Neon DB for serverless PostgreSQL)
- Clerk account for authentication

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Saunakghosh10/drop.git
   cd drop
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # PostgreSQL configuration
   POSTGRES_URL=your_postgres_connection_string
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 💾 Database Setup

The application uses PostgreSQL to store messages. The database schema will be automatically created when the application starts, but here's what it looks like:

```sql
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  position JSONB NOT NULL,
  size JSONB,
  color TEXT NOT NULL,
  user_id TEXT,
  author TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

You can use any PostgreSQL provider, but Neon DB is recommended for its serverless nature and easy setup.

## 🔒 Authentication

This project uses [Clerk](https://clerk.dev/) for authentication. To set it up:

1. Create a Clerk account and set up a new application
2. Configure sign-in and sign-up methods in the Clerk dashboard
3. Get your API keys from the Clerk dashboard
4. Add them to your `.env.local` file

## 📋 Usage

1. **Home Page**: Visitors can access the welcome page
2. **Authentication**: Users can sign up or sign in to access the wall
3. **Wall Page**: After authentication, users can view the digital wall with existing messages
4. **Creating Messages**: Click the "+" button to create a new message
5. **Editing Messages**: Click on a message to edit its content, color, size, or rotation
6. **Positioning Messages**: Drag and drop messages to reposition them
7. **Debug Page**: Access `/debug` to test database connectivity and perform maintenance

## 🧪 Development

### Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build the application for production
- `npm start`: Start the production server
- `npm run lint`: Run ESLint to check for code issues

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public API key | Yes |
| `CLERK_SECRET_KEY` | Clerk secret API key | Yes |
| `POSTGRES_URL` | PostgreSQL connection string | Yes |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

Saunak Ghosh - [GitHub](https://github.com/Saunakghosh10)

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Clerk](https://clerk.dev/)
- [Neon DB](https://neon.tech/)
- [TypeScript](https://www.typescriptlang.org/)

---

Built with ❤️ by Saunak Ghosh
#   d r o p 
 
 