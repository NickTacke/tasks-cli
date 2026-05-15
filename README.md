# tasks-cli

A small CLI for tracking tasks, persisted as JSON in your home directory.

## Install

```bash
bun install
bun link
```

`bun link` registers `tasks-cli` on your `PATH`. To remove it later, `bun unlink` in the repo.

> Note: `bun link` places its shims in `~/.bun/bin`. If that directory isn't on your `PATH`, add it once — Bun's native installer normally does this, but installations done via `npm install -g bun` may not.

## Usage

```bash
tasks-cli <command> [arguments]
```

### Commands

```bash
# Add a task
tasks-cli add "Buy groceries"
# Task added successfully (ID: 1)

# Update / delete
tasks-cli update 1 "Buy groceries and cook dinner"
tasks-cli delete 1

# Change status
tasks-cli mark-in-progress 1
tasks-cli mark-done 1

# List
tasks-cli list
tasks-cli list todo
tasks-cli list in-progress
tasks-cli list done

# Help
tasks-cli help
```

## Development

Without installing, you can run the script directly:

```bash
bun run src/main.ts <command> [arguments]
# or with auto-reload
bun run dev <command> [arguments]
```

## Data

Tasks are persisted to `~/.tasks-cli/tasks.json` by default. Override the location with the `TASKS_CLI_FILE` environment variable, e.g.:

```bash
TASKS_CLI_FILE=./tasks.json tasks-cli list
```

Built with [Bun](https://bun.sh).
