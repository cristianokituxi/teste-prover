import AsyncStorage from "@react-native-async-storage/async-storage";

const QUEUE_KEY = "@desafio-prover:sync-queue";

export type QueueOperation =
  | "CREATE_SCHOOL"
  | "UPDATE_SCHOOL"
  | "DELETE_SCHOOL"
  | "CREATE_CLASS"
  | "UPDATE_CLASS"
  | "DELETE_CLASS";

export type QueueItem = {
  id: string;
  operation: QueueOperation;
  entityId: string;
  schoolId?: string;
  payload?: unknown;
  timestamp: number;
  status: "pending" | "synced" | "failed";
};

let idCounter = 0;

export const queueService = {
  async getAll(): Promise<QueueItem[]> {
    const data = await AsyncStorage.getItem(QUEUE_KEY);
    return data ? JSON.parse(data) : [];
  },

  async add(
    operation: QueueOperation,
    entityId: string,
    payload?: unknown,
    schoolId?: string,
  ): Promise<void> {
    const queue = await this.getAll();
    queue.push({
      id: `q-${Date.now()}-${++idCounter}`,
      operation,
      entityId,
      schoolId,
      payload,
      timestamp: Date.now(),
      status: "pending",
    });
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  },

  async markSynced(id: string): Promise<void> {
    const queue = await this.getAll();
    const item = queue.find((q) => q.id === id);
    if (item) item.status = "synced";
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  },

  async getPending(): Promise<QueueItem[]> {
    const all = await this.getAll();
    return all.filter((q) => q.status === "pending");
  },

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(QUEUE_KEY);
  },
};
