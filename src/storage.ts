const FILE_PATH = "tasks.json";

type Task = {
  id: number;
  description: string;
  status: "todo" | "in-progress" | "done";
  createdAt: Date;
  updatedAt: Date;
};

const loadTasks = async (): Promise<Task[]> => {
  if (!(await Bun.file(FILE_PATH).exists())) {
    return [];
  }
  const data = await Bun.file(FILE_PATH).json();
  return data as Task[];
};

const saveTasks = async (tasks: Task[]): Promise<void> => {
  await Bun.file(FILE_PATH).write(JSON.stringify(tasks, null, 2));
};

export { loadTasks, saveTasks };
