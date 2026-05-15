import { saveTasks, loadTasks } from "./storage";

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

async function main(): Promise<number> {
  const args = process.argv.slice(2);
  if (args.length === 0 || args[0] === "help") {
    console.log(help);
    return 0;
  }

  let tasks = await loadTasks();
  const [command, ...rest] = args;

  switch (command) {
    case "add":
      tasks.push({
        id: crypto.randomUUID(),
        description: rest.join(" "),
        status: "todo",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      break;
    case "update":
      break;
    case "delete":
      break;
    case "mark-in-progress":
      break;
    case "mark-done":
      break;
    case "list":
      break;
    default:
      console.log(help);
      return 0;
  }

  await saveTasks(tasks);
  return 0;
}

main().then((result) => {
  process.exit(result);
});
