const FILE_PATH = "tasks.json";

export type Task = {
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
  const data = (await Bun.file(FILE_PATH).json()) as Array<
    Omit<Task, "createdAt" | "updatedAt"> & {
      createdAt: string;
      updatedAt: string;
    }
  >;
  return data.map((t) => ({
    ...t,
    createdAt: new Date(t.createdAt),
    updatedAt: new Date(t.updatedAt),
  }));
};

const saveTasks = async (tasks: Task[]): Promise<void> => {
  await Bun.file(FILE_PATH).write(JSON.stringify(tasks, null, 2));
};

export { loadTasks, saveTasks };
