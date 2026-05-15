# tasks-cli

A small CLI for tracking tasks, backed by a local `tasks.json` file in the working directory.

## Setup

```bash
bun install
```

## Usage

```bash
bun run src/main.ts <command> [arguments]
```

Or use the `dev` script during development (auto-reloads on file changes):

```bash
bun run dev <command> [arguments]
```

### Commands

```bash
# Add a task
bun run src/main.ts add "Buy groceries"
# Task added successfully (ID: 1)

# Update / delete
bun run src/main.ts update 1 "Buy groceries and cook dinner"
bun run src/main.ts delete 1

# Change status
bun run src/main.ts mark-in-progress 1
bun run src/main.ts mark-done 1

# List
bun run src/main.ts list
bun run src/main.ts list todo
bun run src/main.ts list in-progress
bun run src/main.ts list done

# Help
bun run src/main.ts help
```

## Data

Tasks are persisted to `tasks.json` in the current working directory. The file is created on first write and is gitignored.

Built with [Bun](https://bun.sh).
