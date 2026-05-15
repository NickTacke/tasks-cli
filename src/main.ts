import { saveTasks, loadTasks, type Task } from "./storage";

const help = `
Usage: task-cli <command> [arguments]

Commands:
  add <description>                Add a new task
  update <id> <description>        Update an existing task
  delete <id>                      Delete a task
  mark-in-progress <id>            Mark a task as in progress
  mark-done <id>                   Mark a task as done
  list [status]                    List tasks (status: todo, in-progress, done)
  help                             Show this help message
`;

const parseId = (raw: string | undefined): number | null => {
  if (!raw || !/^\d+$/.test(raw)) return null;
  return parseInt(raw, 10);
};

const formatList = (tasks: Task[]): string => {
  if (tasks.length === 0) return "No tasks.";
  const idWidth = Math.max(2, ...tasks.map((t) => String(t.id).length));
  return tasks
    .map(
      (t) =>
        `[${String(t.id).padStart(idWidth)}]  ${t.status.padEnd(11)}  ${t.description}`,
    )
    .join("\n");
};

async function main(): Promise<number> {
  const args = process.argv.slice(2);
  if (args.length === 0 || args[0] === "help") {
    console.log(help);
    return 0;
  }

  let tasks = await loadTasks();
  const [command, ...rest] = args;

  switch (command) {
    case "add": {
      const description = rest.join(" ").trim();
      if (!description) {
        console.log("Usage: add <description>");
        return 1;
      }

      const id =
        (tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) : 0) + 1;

      tasks.push({
        id,
        description,
        status: "todo",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log(`Task added successfully (ID: ${id})`);
      break;
    }
    case "update": {
      const id = parseId(rest[0]);
      const description = rest.slice(1).join(" ").trim();
      if (id === null || !description) {
        console.log("Usage: update <id> <description>");
        return 1;
      }

      if (!tasks.some((t) => t.id === id)) {
        console.log("Task not found");
        return 1;
      }

      tasks = tasks.map((t) =>
        t.id === id ? { ...t, description, updatedAt: new Date() } : t,
      );

      console.log("Task updated successfully");
      break;
    }
    case "delete": {
      const id = parseId(rest[0]);
      if (id === null) {
        console.log("Usage: delete <id>");
        return 1;
      }

      if (!tasks.some((t) => t.id === id)) {
        console.log("Task not found");
        return 1;
      }

      tasks = tasks.filter((t) => t.id !== id);
      console.log("Task deleted successfully");
      break;
    }
    case "mark-in-progress": {
      const id = parseId(rest[0]);
      if (id === null) {
        console.log("Usage: mark-in-progress <id>");
        return 1;
      }

      if (!tasks.some((t) => t.id === id)) {
        console.log("Task not found");
        return 1;
      }

      tasks = tasks.map((t) =>
        t.id === id
          ? { ...t, status: "in-progress", updatedAt: new Date() }
          : t,
      );

      console.log("Task marked as in-progress");
      break;
    }
    case "mark-done": {
      const id = parseId(rest[0]);
      if (id === null) {
        console.log("Usage: mark-done <id>");
        return 1;
      }

      if (!tasks.some((t) => t.id === id)) {
        console.log("Task not found");
        return 1;
      }

      tasks = tasks.map((t) =>
        t.id === id ? { ...t, status: "done", updatedAt: new Date() } : t,
      );

      console.log("Task marked as done");
      break;
    }
    case "list": {
      const status = rest[0];
      const validStatuses = ["todo", "in-progress", "done"];
      if (status && !validStatuses.includes(status)) {
        console.log(
          `Invalid status: ${status} (expected todo, in-progress, done)`,
        );
        return 1;
      }

      const filtered = status
        ? tasks.filter((t) => t.status === status)
        : tasks;
      console.log(formatList(filtered));
      break;
    }
    default:
      console.log(`Unknown command: ${command}\n${help}`);
      return 1;
  }

  await saveTasks(tasks);
  return 0;
}

main().then((result) => {
  process.exit(result);
});
