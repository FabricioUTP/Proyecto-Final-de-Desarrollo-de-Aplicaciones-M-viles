import { useEffect, useMemo, useRef } from "react";
import {
  Alert,
  Animated,
  Button,
  Image,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTasks } from "../context/TaskContext";
import { colors } from "../theme/colors";

const PRIORITY_CONFIG = {
  high:   { label: "Alta",  color: colors.priorityHigh, bg: "#FEE2E2", icon: "🔴" },
  medium: { label: "Media", color: colors.priorityMed,  bg: "#FEF3C7", icon: "🟡" },
  low:    { label: "Baja",  color: colors.priorityLow,  bg: colors.secondaryLight, icon: "🟢" },
};

const CATEGORY_ICONS = {
  Comercial:  "💼",
  Diseño:     "🎨",
  Desarrollo: "💻",
  Gestión:    "📊",
  Marketing:  "📣",
  Soporte:    "🛠️",
  default:    "📋",
};

const TaskDetailScreen = ({ route, navigation }) => {
  const { taskId } = route.params || {};
  const { getTaskById, toggleTaskStatus, removeTask } = useTasks();
  const task = useMemo(() => getTaskById(taskId), [getTaskById, taskId]);

  // ── Animaciones ────────────────────────────────────────
  const fadeAnim   = useRef(new Animated.Value(0)).current;
  const slideAnim  = useRef(new Animated.Value(30)).current;
  const btnScale   = useRef(new Animated.Value(1)).current;
  const statusAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    Animated.spring(statusAnim, {
      toValue: task?.status === "completed" ? 1 : 0,
      friction: 5,
      useNativeDriver: false,
    }).start();
  }, [task?.status]);

  const animateBtn = (callback) => {
    Animated.sequence([
      Animated.timing(btnScale, { toValue: 0.96, duration: 80, useNativeDriver: true }),
      Animated.timing(btnScale, { toValue: 1,    duration: 80, useNativeDriver: true }),
    ]).start(callback);
  };

  // ── Pantalla de tarea no encontrada ────────────────────
  if (!task) {
    return (
      <View style={styles.notFoundRoot}>
        <StatusBar 
          barStyle="dark-content" 
          backgroundColor={colors.background} 
        />
        <Text style={styles.notFoundIcon}>📭</Text>
        <Text style={styles.notFoundTitle}>Tarea no encontrada</Text>
        <Text style={styles.notFoundSubtitle}>
          La tarea seleccionada ya no está disponible.
        </Text>
        <TouchableOpacity
          style={styles.returnBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
        >
          <Text style={styles.returnBtnText}>Volver al inicio</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isCompleted  = task.status === "completed";
  const priorityInfo = PRIORITY_CONFIG[task.priority] ?? PRIORITY_CONFIG.medium;
  const categoryIcon = CATEGORY_ICONS[task.category] ?? CATEGORY_ICONS.default;

  const handleToggle = () => {
    animateBtn(() => toggleTaskStatus(task.id));
  };

  const handleDelete = () => {
    Alert.alert(
      "Eliminar tarea",
      `¿Estás seguro de que deseas eliminar "${task.title}"? Esta acción no se puede deshacer.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            removeTask(task.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  // ── Color del header según estado ─────────────────────
  const headerBg = statusAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: [colors.primary, colors.secondary],
  });

  // ─────────────────────────────────────────────────────
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >

        {/* ── HEADER animado ──────────────────────────── */}
        <Animated.View style={[styles.header, { backgroundColor: headerBg }]}>
          <View style={styles.headerDecor1} />
          <View style={styles.headerDecor2} />

          {/* Image + logo */}
          <View style={styles.headerTop}>

            <Image
            source={require("../../assets/images/logo.png")}
            style={styles.headerLogoImg}
            resizeMode="contain"
            />

            {/* Badge de estado */}
            <View style={[
              styles.statusBadge, 
              isCompleted 
                ? styles.statusBadgeDone 
                : styles.statusBadgePending
                ]}
            >
              <Text style={styles.statusBadgeText}>
                {isCompleted ? "✓ Completada" : "⏳ Pendiente"}
              </Text>
            </View>
          </View>

          {/* Título */}
          <Text style={styles.headerTitle}>{task.title}</Text>

          {/* Chips: categoría + prioridad */}
          <View style={styles.headerChips}>
            <View style={styles.headerChip}>
              <Text style={styles.headerChipText}>
                {categoryIcon} {task.category}
              </Text>
            </View>
            <View style={styles.headerChip}>
              <Text style={styles.headerChipText}>
                {priorityInfo.icon} Prioridad {priorityInfo.label}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* ── CONTENIDO ───────────────────────────────── */}
        <Animated.View
          style={[
            styles.contentWrapper,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >

          {/* Descripción */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>📄 Descripción</Text>
            <Text style={styles.descriptionText}>{task.description}</Text>
          </View>

          {/* Metadatos */}
          <View style={styles.metaRow}>
            <View style={[styles.metaCard, { borderTopColor: priorityInfo.color }]}>
              <Text style={styles.metaIcon}>{priorityInfo.icon}</Text>
              <Text style={styles.metaLabel}>Prioridad</Text>
              <Text style={[styles.metaValue, { color: priorityInfo.color }]}>
                {priorityInfo.label}
              </Text>
            </View>
            <View style={[styles.metaCard, { borderTopColor: colors.primary }]}>
              <Text style={styles.metaIcon}>📅</Text>
              <Text style={styles.metaLabel}>Creado</Text>
              <Text style={styles.metaValue}>{task.createdAt}</Text>
            </View>
            <View style={[styles.metaCard, { borderTopColor: colors.secondary }]}>
              <Text style={styles.metaIcon}>{categoryIcon}</Text>
              <Text style={styles.metaLabel}>Categoría</Text>
              <Text style={styles.metaValue} numberOfLines={1}>{task.category}</Text>
            </View>
          </View>

          {/* Foto de evidencia */}
          {task.photoUri ? (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>📷 Foto de evidencia</Text>
              <Image source={{ uri: task.photoUri }} style={styles.evidencePhoto} />
            </View>
          ) : null}

          {/* Ubicación */}
          {task.location ? (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>📍 Ubicación</Text>
              <TouchableOpacity
                style={styles.locationDetailCard}
                activeOpacity={0.8}
                onPress={() => {
                  const { latitude, longitude } = task.location;
                  const url = Platform.select({
                    ios: `maps:0,0?q=${latitude},${longitude}`,
                    android: `geo:0,0?q=${latitude},${longitude}`,
                  });
                  Linking.openURL(url).catch(() => {});
                }}
              >
                <Text style={styles.metaValue}>
                  {task.location.address ||
                    `${task.location.latitude.toFixed(5)}, ${task.location.longitude.toFixed(5)}`}
                </Text>
                <Text style={styles.locationLinkText}>Abrir en mapas ↗</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {/* Recordatorio programado */}
          {task.reminderAt ? (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>🔔 Recordatorio</Text>
              <View style={styles.locationDetailCard}>
                <Text style={styles.metaValue}>
                  {new Date(task.reminderAt).toLocaleString("es-PE", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
                {task.status !== "completed" && (
                  <Text style={styles.reminderActiveText}>Pendiente de disparar</Text>
                )}
              </View>
            </View>
          ) : null}

          {/* Barra de estado visual */}
          <View style={styles.statusBar}>
            <View style={[styles.statusStep, { backgroundColor: colors.primary }]}>
              <Text style={styles.statusStepText}>Creada</Text>
            </View>
            <View style={[styles.statusConnector, isCompleted && { backgroundColor: colors.secondary }]} />
            <View style={[styles.statusStep, isCompleted && { backgroundColor: colors.secondary }]}>
              <Text style={styles.statusStepText}>
                {isCompleted ? "Completada" : "En curso"}
              </Text>
            </View>
          </View>

          {/* Acciones */}
          <View style={styles.actionsWrapper}>
            <Animated.View style={{ transform: [{ scale: btnScale }] }}>
              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  isCompleted ? styles.actionBtnUndo : styles.actionBtnDone,
                ]}
                onPress={handleToggle}
                activeOpacity={0.9}
              >
                <Text style={styles.actionBtnText}>
                  {isCompleted
                    ? "↩  Marcar como pendiente"
                    : "✓  Marcar como completada"}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={{ transform: [{ scale: btnScale }] }}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.actionBtnEdit]}
                onPress={() =>
                  navigation.navigate("CreateTask", { taskId: task.id })
                }
                activeOpacity={0.9}
              >
                <Text style={styles.actionBtnText}>✏️ Editar tarea</Text>
              </TouchableOpacity>
            </Animated.View>

            <View style={styles.deleteBtnWrapper}>
              <Button
              title="🗑  Eliminar tarea "
              color={colors.danger}
              onPress={handleDelete}
              />
            </View>
          </View>

        </Animated.View>
      </ScrollView>
    </View>
  );
};

// ── ESTILOS ──────────────────────────────────────────────
const styles = StyleSheet.create({
  evidencePhoto: { width: "100%", height: 200, borderRadius: 14, backgroundColor: colors.surface },
  locationDetailCard: {
    padding: 14, borderRadius: 12,
    borderWidth: 1.5, borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  locationLinkText: { marginTop: 6, fontSize: 13, color: colors.primary, fontWeight: "700" },
  reminderActiveText: { marginTop: 6, fontSize: 12, color: colors.textSecondary, fontStyle: "italic" },

  root: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scroll: {
    paddingBottom: 40,
  },

  // ── Header ───────────────────────────────────────────
  header: {
    paddingTop: Platform.OS === "android" ? 16 : 20,
    paddingHorizontal: 24,
    paddingBottom: 32,
    overflow: "hidden",
  },

  headerDecor1: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.08)",
    top: -50,
    right: -40,
  },

  headerDecor2: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.06)",
    bottom: -20,
    left: -20,
  },

  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  
  headerLogoImg: {
    width: 36,
    height: 36,
    borderRadius: 10,
  },
  
  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusBadgeDone: {
    backgroundColor: "rgba(255,255,255,0.25)",
  },

  statusBadgePending: {
    backgroundColor: "rgba(255,255,255,0.15)",
  },

  statusBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FFFFFF",
    lineHeight: 30,
    marginBottom: 16,
  },

  headerChips: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },

  headerChip: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },

  headerChipText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "600",
  },

  // ── Contenido ─────────────────────────────────────────
  contentWrapper: {
    padding: 20,
    gap: 16,
  },

  // ── Sección descripción ───────────────────────────────
  section: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },

  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 10,
  },

  descriptionText: {
    fontSize: 15,
    color: colors.textPrimary,
    lineHeight: 24,
  },

  // ── Metadatos ─────────────────────────────────────────
  metaRow: {
    flexDirection: "row",
    gap: 10,
  },

  metaCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    borderTopWidth: 3,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },

  metaIcon: {
    fontSize: 20,
    marginBottom: 6,
  },

  metaLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontWeight: "600",
    marginBottom: 4,
  },

  metaValue: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.textPrimary,
    textAlign: "center",
  },

  // ── Barra de estado ───────────────────────────────────
  statusBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },

  statusStep: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.border,
  },

  statusStepText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  statusConnector: {
    flex: 1,
    height: 3,
    backgroundColor: colors.border,
    marginHorizontal: 8,
    borderRadius: 2,
  },

  // ── Botones de acción ─────────────────────────────────
  actionsWrapper: {
    gap: 12,
  },

  actionBtn: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  actionBtnDone: {
    backgroundColor: colors.secondary,
    shadowColor: colors.secondary,
  },

  actionBtnEdit: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
  },

  actionBtnUndo: {
    backgroundColor: colors.warning,
    shadowColor: colors.warning,
  },

  actionBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  
  deleteBtnWrapper: {
    borderRadius: 14,
    overflow: "hidden",
    elevation: 4,
    shadowColor: colors.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  // ── No encontrada ─────────────────────────────────────
  notFoundRoot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    backgroundColor: colors.background,
  },

  notFoundIcon: {
    fontSize: 52,
    marginBottom: 16,
  },

  notFoundTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: "center",
  },

  notFoundSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
  },

  returnBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 32,
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  returnBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },

});

export default TaskDetailScreen;
