import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../theme/colors";

// React.memo evita que TaskCard se re-renderice cuando el componente
// padre (HomeScreen) actualiza estado no relacionado con esta tarea.
// Solo se vuelve a renderizar si cambian sus props (task, onPress, etc.).

const CATEGORY_ICONS = {
  Comercial:  "💼",
  Diseño:     "🎨",
  Desarrollo: "💻",
  Gestión:    "📊",
  Marketing:  "📣",
  Soporte:    "🛠️",
  default:    "📋",
};

// ─────────────────────────────────────────────────────────
// Props:
//   task           → { id, title, description, status, priority, category, createdAt }
//   priorityConfig → { high, medium, low } con label, color y bg
//   onPress        → navega al detalle
//   onToggle       → cambia estado pendiente ↔ completado
//   index          → posición en lista (animación escalonada)
// ─────────────────────────────────────────────────────────
const TaskCard = ({ task, priorityConfig, onPress, onToggle, index = 0 }) => {
  const isCompleted  = task.status === "completed";
  const priority     = priorityConfig?.[task.priority] ?? {
    label: "Normal", color: colors.textSecondary, bg: colors.background,
  };
  const categoryIcon = CATEGORY_ICONS[task.category] ?? CATEGORY_ICONS.default;

  // ── Animaciones ────────────────────────────────────────
  const entranceAnim = useRef(new Animated.Value(0)).current;
  const checkScale   = useRef(new Animated.Value(1)).current;
  const cardOpacity  = useRef(new Animated.Value(1)).current;
  const pressScale   = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(entranceAnim, {
      toValue:         1,
      duration:        350,
      delay:           index * 80,
      useNativeDriver: true,
    }).start();
  }, [entranceAnim, index]);

  const handleToggle = () => {
    Animated.sequence([
      Animated.timing(checkScale,  { toValue: 0.75, duration: 100, useNativeDriver: true }),
      Animated.spring(checkScale,  { toValue: 1,    friction: 4,   useNativeDriver: true }),
    ]).start();
    Animated.sequence([
      Animated.timing(cardOpacity, { toValue: 0.6,  duration: 120, useNativeDriver: true }),
      Animated.timing(cardOpacity, { toValue: 1,    duration: 200, useNativeDriver: true }),
    ]).start();
    onToggle();
  };

  const handlePressIn  = () =>
    Animated.spring(pressScale, { toValue: 0.97, friction: 8, useNativeDriver: true }).start();

  const handlePressOut = () =>
    Animated.spring(pressScale, { toValue: 1,    friction: 8, useNativeDriver: true }).start();

  // ─────────────────────────────────────────────────────
  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          opacity: Animated.multiply(entranceAnim, cardOpacity),
          transform: [
            { scale: pressScale },
            {
              translateY: entranceAnim.interpolate({
                inputRange:  [0, 1],
                outputRange: [24, 0],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={[styles.card, isCompleted && styles.cardCompleted]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >

        {/* Barra lateral de prioridad */}
        <View
          style={[
            styles.priorityBar,
            { backgroundColor: isCompleted ? colors.secondary : priority.color },
          ]}
        />

        {/* Contenido */}
        <View style={styles.content}>

          {/* Fila superior */}
          <View style={styles.topRow}>
            <View style={[styles.categoryBadge, { backgroundColor: priority.bg }]}>
              <Text style={styles.categoryIcon}>{categoryIcon}</Text>
              <Text style={[styles.categoryText, { color: priority.color }]}>
                {task.category ?? "General"}
              </Text>
            </View>
            <Text style={styles.dateText}>{task.createdAt}</Text>
          </View>

          {/* Título */}
          <Text
            style={[styles.title, isCompleted && styles.titleCompleted]}
            numberOfLines={2}
          >
            {task.title}
          </Text>

          {/* Descripción */}
          <Text style={styles.description} numberOfLines={2}>
            {task.description}
          </Text>

          {/* Fila inferior */}
          <View style={styles.bottomRow}>
            <View style={[styles.priorityBadge, { backgroundColor: priority.bg }]}>
              <View style={[styles.priorityDot, { backgroundColor: priority.color }]} />
              <Text style={[styles.priorityText, { color: priority.color }]}>
                {priority.label}
              </Text>
            </View>
            <View style={[
              styles.statusBadge,
              isCompleted ? styles.statusCompleted : styles.statusPending,
            ]}>
              <Text style={[
                styles.statusText,
                { color: isCompleted ? colors.secondary : colors.priorityMed },
              ]}>
                {isCompleted ? "✓ Completado" : "⏳ Pendiente"}
              </Text>
            </View>
          </View>
        </View>

        {/* Botón toggle */}
        <View style={styles.toggleArea}>
          <Animated.View style={{ transform: [{ scale: checkScale }] }}>
            <TouchableOpacity
              style={[styles.toggleBtn, isCompleted && styles.toggleBtnActive]}
              onPress={handleToggle}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              activeOpacity={0.8}
            >
              {isCompleted
                ? <Text style={styles.toggleIconDone}>✓</Text>
                : <View style={styles.toggleCircleEmpty} />}
            </TouchableOpacity>
          </Animated.View>
          <Text style={styles.arrowIcon}>›</Text>
        </View>

      </TouchableOpacity>
    </Animated.View>
  );
};

// ── ESTILOS ───────────────────────────────────────────────
const styles = StyleSheet.create({

  wrapper: {
    marginHorizontal: 16,
    marginVertical: 5,
  },

  card: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },

  cardCompleted: {
    backgroundColor: "#FAFFFE",
    borderColor: colors.secondaryLight,
    opacity: 0.92,
  },

  priorityBar: {
    width: 5,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },

  content: {
    flex: 1,
    padding: 14,
    gap: 6,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },

  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },

  categoryIcon: {
    fontSize: 11,
  },

  categoryText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  dateText: {
    fontSize: 10,
    color: colors.textSecondary,
  },

  title: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
    lineHeight: 21,
  },

  titleCompleted: {
    textDecorationLine: "line-through",
    color: colors.textSecondary,
  },

  description: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },

  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },

  priorityBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    gap: 5,
  },

  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  priorityText: {
    fontSize: 11,
    fontWeight: "700",
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },

  statusCompleted: {
    backgroundColor: colors.secondaryLight,
  },

  statusPending: {
    backgroundColor: colors.warningLight,
  },

  statusText: {
    fontSize: 10,
    fontWeight: "700",
  },

  toggleArea: {
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 14,
  },

  toggleBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },

  toggleBtnActive: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },

  toggleCircleEmpty: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.border,
  },

  toggleIconDone: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "900",
  },

  arrowIcon: {
    fontSize: 22,
    color: colors.border,
    fontWeight: "300",
    lineHeight: 26,
  },

});

export default React.memo(TaskCard);