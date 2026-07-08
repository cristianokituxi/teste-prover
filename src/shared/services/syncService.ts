import { storageService } from "@/src/shared/services/storageService";
import { queueService, type QueueItem } from "@/src/shared/services/queueService";
import type { School, SchoolClass, SchoolInput } from "@/src/features/schools/types";
import type { SchoolClassInput } from "@/src/features/classes/types";
import type { Shift } from "@/src/features/schools/types";

const SIMULATED_LATENCY_MS = 600;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export const syncService = {
  async processQueue(): Promise<number> {
    const pending = await queueService.getPending();
    if (pending.length === 0) return 0;

    let synced = 0;
    for (const item of pending) {
      try {
        await delay(SIMULATED_LATENCY_MS);
        await this.processItem(item);
        await queueService.markSynced(item.id);
        synced++;
      } catch {
        // item stays pending for retry
      }
    }

    return synced;
  },

  async processItem(item: QueueItem): Promise<void> {
    const schools = await storageService.getSchools();
    const classes = await storageService.getClasses();

    switch (item.operation) {
      case "CREATE_SCHOOL": {
        const payload = item.payload as SchoolInput;
        const newSchool: School = {
          id: item.entityId,
          name: payload.name,
          address: payload.address,
          classCount: 0,
          createdAt: new Date().toISOString(),
        };
        schools.push(newSchool);
        await storageService.saveSchools(schools);
        break;
      }
      case "UPDATE_SCHOOL": {
        const payload = item.payload as SchoolInput;
        const idx = schools.findIndex((s) => s.id === item.entityId);
        if (idx >= 0) {
          schools[idx] = { ...schools[idx], name: payload.name, address: payload.address };
          await storageService.saveSchools(schools);
        }
        break;
      }
      case "DELETE_SCHOOL": {
        const filtered = schools.filter((s) => s.id !== item.entityId);
        const filteredClasses = classes.filter((c) => c.schoolId !== item.entityId);
        await storageService.saveSchools(filtered);
        await storageService.saveClasses(filteredClasses);
        break;
      }
      case "CREATE_CLASS": {
        const payload = item.payload as SchoolClassInput;
        const newClass: SchoolClass = {
          id: item.entityId,
          schoolId: item.schoolId!,
          name: payload.name,
          shift: payload.shift,
          year: payload.year,
          createdAt: new Date().toISOString(),
        };
        classes.push(newClass);
        await storageService.saveClasses(classes);
        break;
      }
      case "UPDATE_CLASS": {
        const payload = item.payload as SchoolClassInput;
        const idx = classes.findIndex((c) => c.id === item.entityId);
        if (idx >= 0) {
          classes[idx] = {
            ...classes[idx],
            name: payload.name,
            shift: payload.shift,
            year: payload.year,
          };
          await storageService.saveClasses(classes);
        }
        break;
      }
      case "DELETE_CLASS": {
        const filtered = classes.filter((c) => c.id !== item.entityId);
        await storageService.saveClasses(filtered);
        break;
      }
    }
  },
};
