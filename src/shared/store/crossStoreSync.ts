import { useClassStore } from "@/src/features/classes/store";
import { useSchoolStore } from "@/src/features/schools/store";

/** Notifica a SchoolStore para recarregar classCount após mudanças em turmas */
export function refreshSchoolClassCounts() {
  useSchoolStore.getState().fetchSchools().catch(() => {});
}

/** Remove turmas órfãs da ClassStore quando uma escola é deletada */
export function removeClassesForSchool(schoolId: string) {
  const state = useClassStore.getState();
  const { [schoolId]: _, ...rest } = state.classesBySchool;
  useClassStore.setState({ classesBySchool: rest });
}

/** Limpa o cache de turmas ao sair da tela de uma escola */
export function clearClassCache(schoolId: string) {
  const state = useClassStore.getState();
  if (state.classesBySchool[schoolId]) {
    const { [schoolId]: _, ...rest } = state.classesBySchool;
    useClassStore.setState({ classesBySchool: rest });
  }
}
