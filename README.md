# Drop - Digital Wall for Messages

Drop is a modern web application that allows users to leave messages on a digital wall. Users can create, position, edit, and view messages in an interactive space. It's like a virtual canvas where people can express themselves and share thoughts.

![Drop Digital Wall](https://via.placeholder.com/800x400?text=Drop+Digital+Wall)

> **Try it live:** [drop-kappa.vercel.app](https://drop-kappa.vercel.app/)

## ✨ Features

- **Interactive Digital Wall**: Leave messages anywhere on the canvas
- **Customizable Messages**: Choose colors, font sizes, and rotations for messages
- **Drag & Drop Interface**: Easily position messages where you want them
- **User Authentication**: Secure authentication with Clerk
- **Responsive Design**: Works great on desktop and mobile devices
- **Real-time Updates**: Changes to messages appear instantly
- **Persistent Storage**: Messages are saved in a PostgreSQL database
- **Open Source**: Community-driven development, contributions welcome!

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

We welcome contributions from everyone! Drop is an open-source project and we'd love your help to make it better.

### How to Contribute

1. **Find an Issue**: Browse through our [issues](https://github.com/Saunakghosh10/drop/issues) to find something to work on, or open a new issue to discuss your ideas.

2. **Fork the Repository**: Click the "Fork" button at the top right of this repository to create your own copy.

3. **Clone Your Fork**:
   ```bash
   git clone https://github.com/YOUR-USERNAME/drop.git
   cd drop
   ```

4. **Create a Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

5. **Make Your Changes**: Implement your feature or fix the bug.

6. **Follow Coding Standards**:
   - Write clean, readable code
   - Add comments where necessary
   - Follow the existing code style
   - Run `npm run lint` to ensure your code meets our style guidelines

7. **Test Your Changes**:
   - Make sure your changes don't break existing functionality
   - Add tests if applicable

8. **Commit Your Changes**:
   ```bash
   git commit -m "Add a descriptive commit message"
   ```

9. **Push to Your Fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

10. **Submit a Pull Request**: Go to the original Drop repository and click "New Pull Request" to submit your changes for review.

### What We're Looking For

- Bug fixes
- New features
- Performance improvements
- Documentation updates
- UI/UX enhancements
- Accessibility improvements
- Test coverage

### Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📃 Roadmap

Here are some features and improvements we're planning to add:

- [ ] Message reactions/likes
- [ ] Rich text formatting
- [ ] Image support
- [ ] User profiles
- [ ] Message threads/comments
- [ ] Dark mode support
- [ ] Keyboard shortcuts
- [ ] Improved mobile experience

Feel free to pick up any of these items or suggest new ones!

## 👨‍💻 Author and Maintainers

- **Saunak Ghosh** - *Initial work* - [GitHub](https://github.com/Saunakghosh10)

### Community Contributors

We appreciate all contributors who help make Drop better! 
Contributors will be listed here as they join the project.

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Clerk](https://clerk.dev/)
- [Neon DB](https://neon.tech/)
- [TypeScript](https://www.typescriptlang.org/)
- All our open-source contributors

## 💬 Community and Support

- Use the [GitHub Issues](https://github.com/Saunakghosh10/drop/issues) for bug reports and feature requests
- For more general questions, start a [GitHub Discussion](https://github.com/Saunakghosh10/drop/discussions)

---

Built with ❤️ by the Drop community
#   d r o p 
 
 