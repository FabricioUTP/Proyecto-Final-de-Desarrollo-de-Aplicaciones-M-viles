// src/screens/TeamScreen.jsx
// Directorio corporativo del equipo
// API 1: Random User API  → fotos reales de perfil + datos del empleado
// API 2: JSONPlaceholder  → tareas asignadas por miembro

import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import useApi from "../hooks/useApi";
import { fetchMemberTasks, fetchTeamMembers } from "../services/api";
import { colors } from "../theme/colors";

// ── Componente: Estado de carga (skeleton animado) ────────
const SkeletonCard = () => {
  const shimmer = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, [shimmer]);

  const opacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.9] });

  return (
    <Animated.View style={[styles.skeletonCard, { opacity }]}>
      <View style={styles.skeletonAvatar} />
      <View style={styles.skeletonContent}>
        <View style={styles.skeletonLine} />
        <View style={[styles.skeletonLine, { width: "60%", marginTop: 8 }]} />
        <View style={[styles.skeletonLine, { width: "40%", marginTop: 6 }]} />
      </View>
    </Animated.View>
  );
};

// ── Componente: Estado de error ───────────────────────────
const ErrorState = ({ message, onRetry }) => (
  <View style={styles.centerState}>
    <View style={styles.errorIconWrapper}>
      <Text style={styles.errorIcon}>⚠️</Text>
    </View>
    <Text style={styles.errorTitle}>No se pudo cargar</Text>
    <Text style={styles.errorMessage}>{message}</Text>
    <TouchableOpacity style={styles.retryBtn} onPress={onRetry} activeOpacity={0.85}>
      <Text style={styles.retryBtnText}>🔄  Reintentar</Text>
    </TouchableOpacity>
  </View>
);

// ── Componente: Estado vacío ──────────────────────────────
const EmptyState = () => (
  <View style={styles.centerState}>
    <Text style={styles.emptyIcon}>👥</Text>
    <Text style={styles.emptyTitle}>Sin miembros</Text>
    <Text style={styles.emptySubtitle}>
      No se encontraron miembros en el directorio.
    </Text>
  </View>
);

// ── Componente: Tarjeta de miembro con foto real ──────────
const MemberCard = ({ member, index, onPress }) => {
  const entranceAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim    = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.timing(entranceAnim, {
      toValue: 1, duration: 350, delay: index * 60, useNativeDriver: true,
    }).start();
  }, [entranceAnim, index]);

  const handlePressIn  = () =>
    Animated.spring(scaleAnim, { toValue: 0.97, friction: 8, useNativeDriver: true }).start();
  const handlePressOut = () =>
    Animated.spring(scaleAnim, { toValue: 1,    friction: 8, useNativeDriver: true }).start();

  return (
    <Animated.View
      style={[
        styles.memberCardWrapper,
        {
          opacity: entranceAnim,
          transform: [
            {
              translateY: entranceAnim.interpolate({
                inputRange: [0, 1], outputRange: [20, 0],
              }),
            },
            { scale: scaleAnim },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.memberCard}
        onPress={() => onPress(member)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        {/* ── Foto real de perfil (Random User API) ──── */}
        <Image
          source={{ uri: member.photo.medium }}
          style={styles.memberPhoto}
          defaultSource={require("../../assets/images/logo.png")}
        />

        {/* Información */}
        <View style={styles.memberInfo}>
          <Text style={styles.memberName} numberOfLines={1}>
            {member.name}
          </Text>
          <Text style={styles.memberRole} numberOfLines={1}>
            {member.role}
          </Text>
          <Text style={styles.memberDept} numberOfLines={1}>
            🏢 {member.department}
          </Text>
        </View>

        {/* Flecha */}
        <Text style={styles.memberArrow}>›</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ── Modal de detalle del miembro ──────────────────────────
const MemberDetailModal = ({ member, onClose }) => {
  const {
    data:    memberTasks,
    loading: tasksLoading,
    error:   tasksError,
  } = useApi(
    useCallback(() => fetchMemberTasks(member.id), [member.id]),
    [member.id]
  );

  const slideAnim = React.useRef(new Animated.Value(400)).current;
  const fadeAnim  = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8,   useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 0,   duration: 200, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 400,  duration: 200, useNativeDriver: true }),
    ]).start(onClose);
  };

  return (
    <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
      <TouchableOpacity style={styles.modalBackdrop} onPress={handleClose} />
      <Animated.View
        style={[styles.modalSheet, { transform: [{ translateY: slideAnim }] }]}
      >
        {/* Handle */}
        <View style={styles.modalHandle} />

        <ScrollView showsVerticalScrollIndicator={false}>

          {/* ── Foto grande de perfil ─────────────────── */}
          <View style={styles.profileHeader}>
            <Image
              source={{ uri: member.photo.large }}
              style={styles.profilePhoto}
              defaultSource={require("../../assets/images/logo.png")}
            />
            <Text style={styles.profileName}>{member.name}</Text>
            <Text style={styles.profileRole}>{member.role}</Text>
            <View style={styles.profileDeptBadge}>
              <Text style={styles.profileDeptText}>{member.department}</Text>
            </View>
          </View>

          {/* ── Info de contacto ──────────────────────── */}
          <View style={styles.infoSection}>
            <Text style={styles.infoSectionTitle}>📋 Información de contacto</Text>
            {[
              { icon: "✉️", label: "Correo",   value: member.email   },
              { icon: "📞", label: "Teléfono", value: member.phone   },
              { icon: "📍", label: "Ciudad",   value: member.city    },
              { icon: "🌍", label: "País",     value: member.country },
              { icon: "🎂", label: "Edad",     value: `${member.age} años` },
            ].map((item) => (
              <View key={item.label} style={styles.infoRow}>
                <Text style={styles.infoIcon}>{item.icon}</Text>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>{item.label}</Text>
                  <Text style={styles.infoValue}>{item.value}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* ── Tareas asignadas (JSONPlaceholder) ───── */}
          <View style={styles.infoSection}>
            <Text style={styles.infoSectionTitle}>✅ Tareas asignadas</Text>
            {tasksLoading ? (
              <View style={{ paddingVertical: 16, alignItems: "center" }}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={[styles.infoLabel, { marginTop: 8 }]}>
                  Cargando tareas...
                </Text>
              </View>
            ) : tasksError ? (
              <Text style={styles.errorMessage}>{tasksError}</Text>
            ) : memberTasks && memberTasks.length > 0 ? (
              memberTasks.map((task) => (
                <View key={task.id} style={styles.taskRow}>
                  <View
                    style={[
                      styles.taskDot,
                      {
                        backgroundColor: task.completed
                          ? colors.secondary
                          : colors.priorityMed,
                      },
                    ]}
                  />
                  <Text
                    style={[
                      styles.taskTitle,
                      task.completed && styles.taskTitleDone,
                    ]}
                    numberOfLines={2}
                  >
                    {task.title}
                  </Text>
                  <View
                    style={[
                      styles.taskBadge,
                      task.completed
                        ? styles.taskBadgeDone
                        : styles.taskBadgePending,
                    ]}
                  >
                    <Text
                      style={[
                        styles.taskBadgeText,
                        {
                          color: task.completed
                            ? colors.secondary
                            : colors.priorityMed,
                        },
                      ]}
                    >
                      {task.completed ? "Listo" : "Pendiente"}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.emptySubtitle}>Sin tareas asignadas.</Text>
            )}
          </View>

        </ScrollView>
      </Animated.View>
    </Animated.View>
  );
};

// ── PANTALLA PRINCIPAL ────────────────────────────────────
const TeamScreen = () => {
  const { currentUser }                         = useAuth();
  const [selectedMember, setSelectedMember]     = useState(null);
  const [refreshing,     setRefreshing]         = useState(false);

  const userId = currentUser?.id ?? "kronotask";

  const { data: members, loading, error, refetch } = useApi(
    useCallback(() => fetchTeamMembers(userId), [userId])
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);
  
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* ── HEADER ──────────────────────────────────── */}
      <View style={styles.header}>
        <View style={styles.headerDecor1} />
        <View style={styles.headerDecor2} />

        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerLabel}>Directorio</Text>
            <Text style={styles.headerTitle}>Equipo</Text>
          </View>
          {!loading && !error && members && (
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeNumber}>{members.length}</Text>
              <Text style={styles.headerBadgeLabel}>miembros</Text>
            </View>
          )}
        </View>

        {/* Subtítulo de fuente de datos */}
        <View style={styles.apiSourceBadge}>
          <Text style={styles.apiSourceText}>
            🌐 Datos en tiempo real · Random User API
          </Text>
        </View>
      </View>

      {/* ── CONTENIDO ───────────────────────────────── */}
      {loading && !refreshing ? (
        <ScrollView contentContainerStyle={styles.skeletonList}>
          {[1, 2, 3, 4, 5].map((i) => <SkeletonCard key={i} />)}
        </ScrollView>
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : (
        <FlatList
          data={members}
          keyExtractor={(item) => String(item.uuid)}
          renderItem={({ item, index }) => (
            <MemberCard
              member={item}
              index={index}
              onPress={setSelectedMember}
            />
          )}
          ListEmptyComponent={<EmptyState />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          ListHeaderComponent={
            members && members.length > 0 ? (
              <View style={styles.listHeader}>
                <Text style={styles.listHeaderText}>
                  {members.length} colaboradores activos
                </Text>
                <Text style={styles.listHeaderSub}>
                  Toca un miembro para ver su perfil y tareas
                </Text>
              </View>
            ) : null
          }
        />
      )}

      {/* ── MODAL DE DETALLE ────────────────────────── */}
      {selectedMember !== null && (
        <MemberDetailModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </View>
  );
};

// ── ESTILOS ───────────────────────────────────────────────
const styles = StyleSheet.create({

  root: { flex: 1, backgroundColor: colors.background },

  // ── Header ───────────────────────────────────────────────
  header: {
    backgroundColor: colors.primary,
    paddingTop: Platform.OS === "android" ? 16 : 20,
    paddingHorizontal: 24,
    paddingBottom: 20,
    overflow: "hidden",
  },

  headerDecor1: {
    position: "absolute", width: 180, height: 180, borderRadius: 90,
    backgroundColor: colors.primaryDark, top: -50, right: -40, opacity: 0.4,
  },

  headerDecor2: {
    position: "absolute", width: 100, height: 100, borderRadius: 50,
    backgroundColor: colors.primaryDark, bottom: -30, left: -20, opacity: 0.3,
  },

  headerContent: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginBottom: 12,
  },

  headerLabel: {
    fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: "500",
    letterSpacing: 1, textTransform: "uppercase", marginBottom: 2,
  },

  headerTitle: { fontSize: 28, fontWeight: "900", color: "#FFFFFF" },

  headerBadge: {
    backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 10, alignItems: "center",
  },

  headerBadgeNumber: { fontSize: 22, fontWeight: "900", color: "#FFFFFF" },

  headerBadgeLabel: {
    fontSize: 10, color: "rgba(255,255,255,0.7)", marginTop: 1, textTransform: "uppercase",
  },

  apiSourceBadge: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7,
    alignSelf: "flex-start",
  },

  apiSourceText: { fontSize: 11, color: "rgba(255,255,255,0.85)", fontWeight: "500" },

  // ── Lista ─────────────────────────────────────────────────
  listContent: { paddingBottom: 32, paddingTop: 8 },

  listHeader: { paddingHorizontal: 20, paddingVertical: 14 },

  listHeaderText: { fontSize: 14, fontWeight: "700", color: colors.textPrimary },

  listHeaderSub: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },

  // ── Tarjeta de miembro ────────────────────────────────────
  memberCardWrapper: { marginHorizontal: 16, marginVertical: 5 },

  memberCard: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: colors.surface, borderRadius: 16,
    padding: 14, gap: 14,
    elevation: 2, shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8,
    borderWidth: 1, borderColor: colors.border,
  },

  // ── Foto real de perfil ───────────────────────────────────
  memberPhoto: {
    width: 56, height: 56, borderRadius: 18,
    borderWidth: 2, borderColor: colors.primaryLight,
    backgroundColor: colors.border,
  },

  memberInfo: { flex: 1 },

  memberName: { fontSize: 15, fontWeight: "700", color: colors.textPrimary, marginBottom: 3 },

  memberRole: { fontSize: 12, color: colors.primary, fontWeight: "600", marginBottom: 3 },

  memberDept: { fontSize: 11, color: colors.textSecondary },

  memberArrow: { fontSize: 22, color: colors.border, fontWeight: "300" },

  // ── Skeleton ──────────────────────────────────────────────
  skeletonList: { paddingTop: 16, paddingBottom: 32 },

  skeletonCard: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: colors.surface, borderRadius: 16, padding: 14,
    marginHorizontal: 16, marginVertical: 5, gap: 14,
    borderWidth: 1, borderColor: colors.border,
  },

  skeletonAvatar: { width: 56, height: 56, borderRadius: 18, backgroundColor: colors.border },

  skeletonContent: { flex: 1 },

  skeletonLine: { height: 12, borderRadius: 6, backgroundColor: colors.border, width: "80%" },

  // ── Estados ───────────────────────────────────────────────
  centerState: { flex: 1, alignItems: "center", justifyContent: "center", padding: 40 },

  errorIconWrapper: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: "#FEE2E2", justifyContent: "center", alignItems: "center", marginBottom: 16,
  },

  errorIcon: { fontSize: 32 },

  errorTitle: { fontSize: 20, fontWeight: "800", color: colors.textPrimary, marginBottom: 8, textAlign: "center" },

  errorMessage: { fontSize: 13, color: colors.textSecondary, textAlign: "center", lineHeight: 20, marginBottom: 24 },

  retryBtn: {
    backgroundColor: colors.primary, paddingHorizontal: 28, paddingVertical: 13, borderRadius: 14,
    elevation: 4, shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8,
  },

  retryBtnText: { color: "#FFFFFF", fontWeight: "700", fontSize: 14 },

  emptyIcon: { fontSize: 52, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: "800", color: colors.textPrimary, marginBottom: 8 },
  emptySubtitle: { fontSize: 13, color: colors.textSecondary, textAlign: "center", lineHeight: 20 },

  // ── Modal ─────────────────────────────────────────────────
  modalOverlay: {
    ...StyleSheet.absoluteFillObject, justifyContent: "flex-end", zIndex: 999,
  },

  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.45)" },

  modalSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 20, paddingBottom: 40,
    maxHeight: "88%",
    elevation: 20, shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.15, shadowRadius: 20,
  },

  modalHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: colors.border, alignSelf: "center", marginVertical: 12,
  },

  // ── Perfil del modal ──────────────────────────────────────
  profileHeader: {
    alignItems: "center", paddingVertical: 20,
    borderBottomWidth: 1, borderBottomColor: colors.border, marginBottom: 16,
  },

  // ── Foto grande en el modal ───────────────────────────────
  profilePhoto: {
    width: 100, height: 100, borderRadius: 30,
    borderWidth: 3, borderColor: colors.primary,
    marginBottom: 14, backgroundColor: colors.border,
  },

  profileName: { fontSize: 20, fontWeight: "900", color: colors.textPrimary, marginBottom: 4, textAlign: "center" },

  profileRole: { fontSize: 13, color: colors.primary, fontWeight: "600", marginBottom: 10 },

  profileDeptBadge: {
    backgroundColor: colors.primaryLight, paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20,
  },

  profileDeptText: { fontSize: 11, color: colors.primary, fontWeight: "700" },

  // ── Sección de info ───────────────────────────────────────
  infoSection: {
    backgroundColor: colors.background, borderRadius: 16, padding: 16, marginBottom: 12,
  },

  infoSectionTitle: {
    fontSize: 12, fontWeight: "700", color: colors.textSecondary,
    textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 12,
  },

  infoRow: { flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 12 },

  infoIcon: { fontSize: 16, marginTop: 1 },

  infoContent: { flex: 1 },

  infoLabel: {
    fontSize: 10, color: colors.textSecondary, fontWeight: "600",
    textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2,
  },

  infoValue: { fontSize: 13, color: colors.textPrimary, fontWeight: "500" },

  // ── Tareas ────────────────────────────────────────────────
  taskRow: {
    flexDirection: "row", alignItems: "flex-start", gap: 10,
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border,
  },

  taskDot: { width: 8, height: 8, borderRadius: 4, marginTop: 5 },

  taskTitle: { flex: 1, fontSize: 13, color: colors.textPrimary, lineHeight: 18 },

  taskTitleDone: { textDecorationLine: "line-through", color: colors.textSecondary },

  taskBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },

  taskBadgeDone:    { backgroundColor: colors.secondaryLight },
  taskBadgePending: { backgroundColor: colors.warningLight   },

  taskBadgeText: { fontSize: 10, fontWeight: "700" },
});

export default TeamScreen;
