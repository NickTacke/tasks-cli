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
    case "add": {
      const id =
        (tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) : 0) + 1;

      tasks.push({
        // Get highest id number & increment by 1
        id: id,
        description: rest.join(" "),
        status: "todo",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log(`Task added successfully (ID: ${id})`);

      break;
    }
    case "update": {
      if (rest.length === 0) {
        console.log("Usage: update <id> <description>");
        return 0;
      }

      const [id, ...description] = rest;

      const taskExists = tasks.some((task) => task.id === parseInt(id!));
      if (!taskExists) {
        console.log("Task not found");
        return 0;
      }

      tasks = tasks.map((task) =>
        task.id === parseInt(id!)
          ? {
              ...task,
              description: description.join(" "),
              updatedAt: new Date(),
            }
          : task,
      );

      console.log("Task updated successfully");

      break;
    }
    case "delete": {
      if (rest.length === 0) {
        console.log("Usage: delete <id>");
        return 0;
      }

      const [idToDelete] = rest;

      const taskExists = tasks.some(
        (task) => task.id === parseInt(idToDelete!),
      );
      if (!taskExists) {
        console.log("Task not found");
        return 0;
      }

      tasks = tasks.filter((task) => task.id !== parseInt(idToDelete!));
      console.log("Task deleted successfully");

      break;
    }
    case "mark-in-progress": {
      if (rest.length === 0) {
        console.log("Usage: mark-in-progress <id>");
        return 0;
      }

      const [idToMarkInProgress] = rest;
      const taskExists = tasks.some(
        (task) => task.id === parseInt(idToMarkInProgress!),
      );
      if (!taskExists) {
        console.log("Task not found");
        return 0;
      }

      tasks = tasks.map((task) =>
        task.id === parseInt(idToMarkInProgress!)
          ? {
              ...task,
              status: "in-progress",
              updatedAt: new Date(),
            }
          : task,
      );

      console.log("Task marked as in-progress");

      break;
    }
    case "mark-done": {
      if (rest.length === 0) {
        console.log("Usage: mark-done <id>");
        return 0;
      }

      const [idToMarkDone] = rest;

      const taskExists = tasks.some(
        (task) => task.id === parseInt(idToMarkDone!),
      );
      if (!taskExists) {
        console.log("Task not found");
        return 0;
      }

      tasks = tasks.map((task) =>
        task.id === parseInt(idToMarkDone!)
          ? {
              ...task,
              status: "done",
              updatedAt: new Date(),
            }
          : task,
      );
      console.log("Task marked as done");

      break;
    }
    case "list": {
      const [status] = rest;
      const filteredTasks = status
        ? tasks.filter((task) => task.status === status)
        : tasks;
      console.log(filteredTasks);
      break;
    }
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
