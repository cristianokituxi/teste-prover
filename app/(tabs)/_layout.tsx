import { Ionicons } from "@expo/vector-icons";
import { Tabs, usePathname, useRouter } from "expo-router";
import { Pressable } from "react-native";

export default function TabsLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const currentSchoolId = pathname.match(/\/schools\/([^/]+)\//)?.[1] ?? null;

  return (
    <Tabs
      screenOptions={{
        headerStyle: { height: 80 },
        headerTitleStyle: { fontWeight: "600", fontSize: 20 },
        headerTitleAlign: "left",
        headerLeftContainerStyle: { paddingLeft: 8 },
        headerRightContainerStyle: { paddingRight: 8 },
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "#64748b",
      }}
    >
      <Tabs.Screen
        name="schools/list"
        options={{
          title: "Escolas",
          tabBarLabel: "Escolas",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="school-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="schools/create"
        options={{
          title: "Nova Escola",
          tabBarLabel: "Cadastrar",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Conta",
          tabBarLabel: "Conta",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="schools/[schoolId]/edit"
        options={{
          href: null,
          title: "",
          headerTitle: "",
          headerLeft: () => (
            <Pressable onPress={() => router.replace("/(tabs)/schools/list")} hitSlop={12}>
              <Ionicons name="arrow-back" size={26} color="#0f172a" />
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="schools/[schoolId]/classes"
        options={{
          href: null,
          title: "",
          headerTitle: "",
          headerLeft: () => (
            <Pressable onPress={() => router.replace("/(tabs)/schools/list")} hitSlop={12}>
              <Ionicons name="arrow-back" size={26} color="#0f172a" />
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="schools/[schoolId]/classes-create"
        options={{
          href: null,
          title: "",
          headerTitle: "",
          headerLeft: () => (
            <Pressable
              onPress={() => {
                if (currentSchoolId) {
                  router.replace(`/(tabs)/schools/${currentSchoolId}/classes`);
                  return;
                }
                router.replace("/(tabs)/schools/list");
              }}
              hitSlop={12}
            >
              <Ionicons name="arrow-back" size={26} color="#0f172a" />
            </Pressable>
          ),
        }}
      />
    </Tabs>
  );
}
