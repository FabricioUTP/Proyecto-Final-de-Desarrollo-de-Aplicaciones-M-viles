// src/screens/HomeScreen.jsx
import React, { useEffect, useMemo, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import TaskCard from "../components/TaskCard";
import { useTasks } from "../context/TaskContext";
import { colors } from "../theme/colors";

const { width } = Dimensions.get("window");

const FILTERS = [
  { key: "all",       label: "Todas"       },
  { key: "pending",   label: "Pendientes"  },
  { key: "completed", label: "Completadas" },
];

const PRIORITY_CONFIG = {
  high:   { label: "Alta",  color: colors.priorityHigh, bg: "#FEE2E2"              },
  medium: { label: "Media", color: colors.priorityMed,  bg: "#FEF3C7"              },
  low:    { label: "Baja",  color: colors.priorityLow,  bg: colors.secondaryLight  },
};

const HomeScreen = ({ navigation }) => {
  const { tasks, storageLoading, storageError, clearStorageError } = useTasks();
  const { toggleTaskStatus } = useTasks();
  const [filter, setFilter] = React.useState("all");

  const headerAnim = useRef(new Animated.Value(0)).current;
  const fabAnim    = useRef(new Animated.Value(0)).current;

  // ── useEffect: animación de entrada ──────────────────────
  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerAnim, {
        toValue: 1, duration: 500, useNativeDriver: true,
      }),
      Animated.timing(fabAnim, {
        toValue: 1, duration: 600, delay: 300, useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // ── Filtrado de tareas ────────────────────────────────────
  const filteredTasks = useMemo(() =>
    tasks.filter((t) => {
      if (filter === "pending")   return t.status === "pending";
      if (filter === "completed") return t.status === "completed";
      return true;
    }),
    [tasks, filter]
  );

  // ── Estadísticas ──────────────────────────────────────────
  const totalTasks     = tasks.length;
  const completedTasks = useMemo(() => tasks.filter((t) => t.status === "completed").length, [tasks]);
  const pendingTasks   = useMemo(() => tasks.filter((t) => t.status === "pending").length,   [tasks]);
  const progressPct    = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // ── Barra de progreso animada ─────────────────────────────
  const progressAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progressPct / 100, duration: 600, useNativeDriver: false,
    }).start();
  }, [progressPct]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1], outputRange: ["0%", "100%"],
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "☀️  Buenos días";
    if (hour < 18) return "🌤️  Buenas tardes";
    return "🌙  Buenas noches";
  };

  // ── Estado de carga de AsyncStorage ──────────────────────
  if (storageLoading) {
    return (
      <View style={styles.loadingRoot}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando tus tareas...</Text>
        <Text style={styles.loadingSubtext}>Recuperando datos guardados</Text>
      </View>
    );
  }

  // ── Render header ─────────────────────────────────────────
  const renderHeader = () => (
    <Animated.View
      style={[
        styles.headerContainer,
        {
          opacity: headerAnim,
          transform: [{
            translateY: headerAnim.interpolate({
              inputRange: [0, 1], outputRange: [-20, 0],
            }),
          }],
        },
      ]}
    >
      <View style={styles.decorCircle1} />
      <View style={styles.decorCircle2} />

      <View style={styles.headerTop}>
        <View>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.headerTitle}>Mis Tareas</Text>
          <Text style={styles.headerDate}>
            {new Date().toLocaleDateString("es-PE", {
              weekday: "long", day: "numeric", month: "long",
            })}
          </Text>
        </View>
      </View>

      {/* Banner de error de AsyncStorage */}
      {storageError && (
        <TouchableOpacity
          style={styles.storageErrorBanner}
          onPress={clearStorageError}
          activeOpacity={0.8}
        >
          <Text style={styles.storageErrorText}>⚠ {storageError}  Toca para cerrar.</Text>
        </TouchableOpacity>
      )}

      {/* Estadísticas */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { borderLeftColor: colors.primary }]}>
          <Text style={styles.statNumber}>{totalTasks}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: colors.priorityHigh }]}>
          <Text style={[styles.statNumber, { color: colors.priorityHigh }]}>
            {pendingTasks}
          </Text>
          <Text style={styles.statLabel}>Pendientes</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: colors.secondary }]}>
          <Text style={[styles.statNumber, { color: colors.secondary }]}>
            {completedTasks}
          </Text>
          <Text style={styles.statLabel}>Completadas</Text>
        </View>
      </View>

      {/* Progreso */}
      <View style={styles.progressWrapper}>
        <View style={styles.progressLabelRow}>
          <Text style={styles.progressLabel}>Progreso general</Text>
          <Text style={styles.progressPct}>{progressPct}%</Text>
        </View>
        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: progressWidth,
                backgroundColor: progressPct === 100 ? colors.secondary : colors.primary,
              },
            ]}
          />
        </View>
      </View>

      {/* Acceso al Directorio del Equipo */}
      <TouchableOpacity
        style={styles.teamBanner}
        onPress={() => navigation.navigate("Team")}
        activeOpacity={0.85}
      >
        <View style={styles.teamBannerLeft}>
          <Text style={styles.teamBannerIcon}>👥</Text>
          <View>
            <Text style={styles.teamBannerTitle}>Directorio del Equipo</Text>
            <Text style={styles.teamBannerSub}>Ver colaboradores y sus tareas</Text>
          </View>
        </View>
        <Text style={styles.teamBannerArrow}>›</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderFilters = () => (
    <View style={styles.filtersWrapper}>
      {FILTERS.map((f) => (
        <TouchableOpacity
          key={f.key}
          style={[styles.filterBtn, filter === f.key && styles.filterBtnActive]}
          onPress={() => setFilter(f.key)}
          activeOpacity={0.8}
        >
          <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>
            {f.label}
          </Text>
          {filter === f.key && <View style={styles.filterDot} />}
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyWrapper}>
      <Text style={styles.emptyIcon}>📭</Text>
      <Text style={styles.emptyTitle}>Sin tareas aquí</Text>
      <Text style={styles.emptySubtitle}>
        No hay tareas en esta categoría.{"\n"}
        ¡Crea una nueva con el botón +!
      </Text>
    </View>
  );

  // ─────────────────────────────────────────────────────────
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            {renderHeader()}
            <View style={styles.listSection}>
              {renderFilters()}
              <Text style={styles.sectionTitle}>
                {filter === "all"       ? "Todas las tareas"   :
                 filter === "pending"   ? "Tareas pendientes"  :
                                         "Tareas completadas"}
                {"  "}
                <Text style={styles.sectionCount}>({filteredTasks.length})</Text>
              </Text>
            </View>
          </>
        }
        renderItem={({ item, index }) => (
          <TaskCard
            task={item}
            priorityConfig={PRIORITY_CONFIG}
            onPress={() => navigation.navigate("TaskDetail", { taskId: item.id })}
            onToggle={() => toggleTaskStatus(item.id)}
            index={index}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 2 }} />}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* FAB */}
      <Animated.View
        style={[
          styles.fabWrapper,
          {
            opacity: fabAnim,
            transform: [{
              scale: fabAnim.interpolate({
                inputRange: [0, 1], outputRange: [0.5, 1],
              }),
            }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate("CreateTask")}
          activeOpacity={0.85}
        >
          <Text style={styles.fabIcon}>＋</Text>
        </TouchableOpacity>
        <Text style={styles.fabLabel}>Nueva tarea</Text>
      </Animated.View>
    </View>
  );
};

// ── ESTILOS ───────────────────────────────────────────────
const styles = StyleSheet.create({

  root: { flex: 1, backgroundColor: colors.background },

  // ── Loading de AsyncStorage ───────────────────────────────
  loadingRoot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    gap: 12,
  },

  loadingText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: 8,
  },

  loadingSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
  },

  // ── Header ────────────────────────────────────────────────
  headerContainer: {
    backgroundColor: colors.primary,
    paddingTop: Platform.OS === "android" ? 48 : 56,
    paddingHorizontal: 24,
    paddingBottom: 20,
    overflow: "hidden",
  },

  decorCircle1: {
    position: "absolute",
    width: 220, height: 220, borderRadius: 110,
    backgroundColor: colors.primaryDark,
    top: -70, right: -50, opacity: 0.45,
  },

  decorCircle2: {
    position: "absolute",
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: colors.primaryDark,
    bottom: 10, left: -20, opacity: 0.3,
  },

  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },

  greeting: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    letterSpacing: 0.4,
    marginBottom: 4,
  },

  headerTitle: {
    fontSize: 28, fontWeight: "900", color: "#FFFFFF", letterSpacing: 0.5,
  },

  headerDate: {
    fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 4, textTransform: "capitalize",
  },

  // ── Banner error storage ──────────────────────────────────
  storageErrorBanner: {
    backgroundColor: "rgba(239,68,68,0.2)",
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.4)",
  },

  storageErrorText: {
    fontSize: 12, color: "#FECACA", fontWeight: "500", textAlign: "center",
  },

  // ── Estadísticas ──────────────────────────────────────────
  statsRow: { flexDirection: "row", gap: 10, marginBottom: 20 },

  statCard: {
    flex: 1, backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 12, padding: 12, borderLeftWidth: 3,
  },

  statNumber: { fontSize: 24, fontWeight: "900", color: "#FFFFFF" },

  statLabel: {
    fontSize: 10, color: "rgba(255,255,255,0.7)",
    marginTop: 2, fontWeight: "500", textTransform: "uppercase", letterSpacing: 0.5,
  },

  // ── Progreso ──────────────────────────────────────────────
  progressWrapper: { marginTop: 4, marginBottom: 16 },

  progressLabelRow: {
    flexDirection: "row", justifyContent: "space-between", marginBottom: 8,
  },

  progressLabel: { fontSize: 12, color: "rgba(255,255,255,0.8)", fontWeight: "500" },

  progressPct: { fontSize: 12, color: "#FFFFFF", fontWeight: "700" },

  progressTrack: {
    height: 6, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 3, overflow: "hidden",
  },

  progressFill: { height: 6, borderRadius: 3 },

  // ── Banner Equipo ─────────────────────────────────────────
  teamBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },

  teamBannerLeft: {
    flexDirection: "row", alignItems: "center", gap: 12,
  },

  teamBannerIcon: { fontSize: 24 },

  teamBannerTitle: {
    fontSize: 14, fontWeight: "700", color: "#FFFFFF",
  },

  teamBannerSub: {
    fontSize: 11, color: "rgba(255,255,255,0.65)", marginTop: 2,
  },

  teamBannerArrow: {
    fontSize: 24, color: "rgba(255,255,255,0.6)", fontWeight: "300",
  },

  // ── Lista ─────────────────────────────────────────────────
  listSection: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 },

  sectionTitle: {
    fontSize: 16, fontWeight: "700", color: colors.textPrimary, marginTop: 16, marginBottom: 4,
  },

  sectionCount: { fontSize: 14, fontWeight: "500", color: colors.textSecondary },

  filtersWrapper: { flexDirection: "row", gap: 8 },

  filterBtn: {
    paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20,
    backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border,
    alignItems: "center",
  },

  filterBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },

  filterText: { fontSize: 13, fontWeight: "600", color: colors.textSecondary },

  filterTextActive: { color: "#FFFFFF" },

  filterDot: {
    width: 4, height: 4, borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.7)", marginTop: 3,
  },

  listContent: { paddingBottom: 110 },

  emptyWrapper: {
    alignItems: "center", paddingVertical: 60, paddingHorizontal: 40,
  },

  emptyIcon: { fontSize: 48, marginBottom: 16 },

  emptyTitle: {
    fontSize: 18, fontWeight: "700", color: colors.textPrimary, marginBottom: 8,
  },

  emptySubtitle: {
    fontSize: 14, color: colors.textSecondary, textAlign: "center", lineHeight: 22,
  },

  // ── FAB ───────────────────────────────────────────────────
  fabWrapper: {
    position: "absolute", bottom: 28, right: 22, alignItems: "center",
  },

  fab: {
    width: 60, height: 60, borderRadius: 20,
    backgroundColor: colors.primary, justifyContent: "center", alignItems: "center",
    elevation: 8, shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12,
  },

  fabIcon: { fontSize: 30, color: "#FFFFFF", lineHeight: 34 },

  fabLabel: {
    fontSize: 10, color: colors.textSecondary, fontWeight: "600", marginTop: 5, letterSpacing: 0.3,
  },
});

export default HomeScreen;
