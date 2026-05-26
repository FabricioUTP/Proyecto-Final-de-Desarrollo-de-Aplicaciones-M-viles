// src/screens/TeamScreen.jsx
// Directorio corporativo del equipo
// Criterio 2 — Consumo de API (JSONPlaceholder /users)
// Criterio 3 — Estados de carga, error y vacío

import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
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
import { fetchMemberById, fetchMemberTasks, fetchTeamMembers } from "../services/api";
import useApi from "../hooks/useApi";
import { colors } from "../theme/colors";

const { width } = Dimensions.get("window");

// ── Colores de avatar por índice ─────────────────────────
const AVATAR_COLORS = [
  "#4F46E5", "#10B981", "#F59E0B", "#EF4444",
  "#8B5CF6", "#06B6D4", "#EC4899", "#84CC16",
  "#F97316", "#6366F1",
];

// ── Componente: Estado de carga ──────────────────────────
const LoadingState = () => (
  <View style={styles.centerState}>
    <ActivityIndicator size="large" color={colors.primary} />
    <Text style={styles.loadingText}>Cargando directorio del equipo...</Text>
    <Text style={styles.loadingSubtext}>Conectando con el servidor</Text>
  </View>
);

// ── Componente: Estado de error ──────────────────────────
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

// ── Componente: Estado vacío ─────────────────────────────
const EmptyState = () => (
  <View style={styles.centerState}>
    <Text style={styles.emptyIcon}>👥</Text>
    <Text style={styles.emptyTitle}>Sin miembros</Text>
    <Text style={styles.emptySubtitle}>
      No se encontraron miembros en el directorio.
    </Text>
  </View>
);

// ── Componente: Skeleton de carga ────────────────────────
const SkeletonCard = () => {
  const shimmer = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, [shimmer]);

  const opacity = shimmer.interpolate({
    inputRange: [0, 1], outputRange: [0.4, 0.9],
  });

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

// ── Componente: Tarjeta de miembro ───────────────────────
const MemberCard = ({ member, index, onPress }) => {
  const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const scaleAnim   = useRef(new Animated.Value(1)).current;
  const entranceAnim = useRef(new Animated.Value(0)).current;

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
          transform: [{
            translateY: entranceAnim.interpolate({
              inputRange: [0, 1], outputRange: [20, 0],
            }),
          }, { scale: scaleAnim }],
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
        {/* Avatar con iniciales */}
        <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
          <Text style={styles.avatarText}>{member.initials}</Text>
        </View>

        {/* Información */}
        <View style={styles.memberInfo}>
          <Text style={styles.memberName} numberOfLines={1}>{member.name}</Text>
          <Text style={styles.memberDept} numberOfLines={1}>{member.department}</Text>
          <Text style={styles.memberEmail} numberOfLines={1}>{member.email}</Text>
        </View>

        {/* Flecha */}
        <Text style={styles.memberArrow}>›</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ── Modal de detalle de miembro ──────────────────────────
const MemberDetailModal = ({ memberId, onClose }) => {
  const {
    data: member,
    loading: memberLoading,
    error: memberError,
  } = useApi(
    useCallback(() => fetchMemberById(memberId), [memberId]),
    [memberId]
  );

  const {
    data: memberTasks,
    loading: tasksLoading,
    error: tasksError,
  } = useApi(
    useCallback(() => fetchMemberTasks(memberId), [memberId]),
    [memberId]
  );

  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8,   useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 0,   duration: 200, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 300,  duration: 200, useNativeDriver: true }),
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
          {memberLoading ? (
            <View style={styles.modalLoading}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Cargando perfil...</Text>
            </View>
          ) : memberError ? (
            <View style={styles.modalLoading}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorMessage}>{memberError}</Text>
            </View>
          ) : member ? (
            <>
              {/* Header del perfil */}
              <View style={styles.profileHeader}>
                <View style={[styles.profileAvatar, { backgroundColor: colors.primary }]}>
                  <Text style={styles.profileAvatarText}>{member.initials}</Text>
                </View>
                <Text style={styles.profileName}>{member.name}</Text>
                <Text style={styles.profileDept}>{member.department}</Text>
                <View style={styles.profileRoleBadge}>
                  <Text style={styles.profileRoleText}>{member.role}</Text>
                </View>
              </View>

              {/* Info de contacto */}
              <View style={styles.infoSection}>
                <Text style={styles.infoSectionTitle}>📋 Información de contacto</Text>
                {[
                  { icon: "✉️", label: "Correo",    value: member.email    },
                  { icon: "📞", label: "Teléfono",  value: member.phone    },
                  { icon: "📍", label: "Ciudad",    value: member.city     },
                  { icon: "🌐", label: "Web",       value: member.website  },
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

              {/* Tareas del miembro */}
              <View style={styles.infoSection}>
                <Text style={styles.infoSectionTitle}>✅ Tareas asignadas</Text>
                {tasksLoading ? (
                  <View style={{ paddingVertical: 16, alignItems: "center" }}>
                    <ActivityIndicator size="small" color={colors.primary} />
                    <Text style={[styles.loadingSubtext, { marginTop: 8 }]}>
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
                          { backgroundColor: task.completed ? colors.secondary : colors.priorityMed },
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
                          task.completed ? styles.taskBadgeDone : styles.taskBadgePending,
                        ]}
                      >
                        <Text
                          style={[
                            styles.taskBadgeText,
                            { color: task.completed ? colors.secondary : colors.priorityMed },
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
            </>
          ) : null}
        </ScrollView>
      </Animated.View>
    </Animated.View>
  );
};

// ─────────────────────────────────────────────────────────
// PANTALLA PRINCIPAL
// ─────────────────────────────────────────────────────────
const TeamScreen = () => {
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [refreshing,       setRefreshing]       = useState(false);
  const [searchQuery,      setSearchQuery]      = useState("");

  const { data: members, loading, error, refetch } = useApi(fetchTeamMembers);

  // ── Pull-to-refresh ──────────────────────────────────────
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  // ── Filtro de búsqueda ───────────────────────────────────
  const filteredMembers = members
    ? members.filter(
        (m) =>
          m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // ── Estadísticas del equipo ──────────────────────────────
  const totalMembers = members?.length ?? 0;

  // ─────────────────────────────────────────────────────────
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* ── HEADER ──────────────────────────────────────── */}
      <View style={styles.header}>
        <View style={styles.headerDecor1} />
        <View style={styles.headerDecor2} />

        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerLabel}>Directorio</Text>
            <Text style={styles.headerTitle}>Equipo</Text>
          </View>
          {!loading && !error && (
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeNumber}>{totalMembers}</Text>
              <Text style={styles.headerBadgeLabel}>miembros</Text>
            </View>
          )}
        </View>

        {/* Buscador */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <Text
            style={styles.searchPlaceholder}
            onPress={() => {}}
          >
            {searchQuery || "Buscar por nombre, área o correo..."}
          </Text>
        </View>
      </View>

      {/* ── CONTENIDO ───────────────────────────────────── */}
      {loading && !refreshing ? (
        <ScrollView contentContainerStyle={styles.skeletonList}>
          {[1, 2, 3, 4, 5].map((i) => <SkeletonCard key={i} />)}
        </ScrollView>
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : (
        <FlatList
          data={filteredMembers}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item, index }) => (
            <MemberCard
              member={item}
              index={index}
              onPress={(m) => setSelectedMemberId(m.id)}
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
                  {filteredMembers.length} colaborador
                  {filteredMembers.length !== 1 ? "es" : ""} encontrado
                  {filteredMembers.length !== 1 ? "s" : ""}
                </Text>
                <Text style={styles.listHeaderSub}>
                  Datos obtenidos en tiempo real
                </Text>
              </View>
            ) : null
          }
        />
      )}

      {/* ── MODAL DE DETALLE ────────────────────────────── */}
      {selectedMemberId !== null && (
        <MemberDetailModal
          memberId={selectedMemberId}
          onClose={() => setSelectedMemberId(null)}
        />
      )}
    </View>
  );
};

// ── ESTILOS ───────────────────────────────────────────────
const styles = StyleSheet.create({

  root: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // ── Header ───────────────────────────────────────────────
  header: {
    backgroundColor: colors.primary,
    paddingTop: Platform.OS === "android" ? 16 : 20,
    paddingHorizontal: 24,
    paddingBottom: 20,
    overflow: "hidden",
  },

  headerDecor1: {
    position: "absolute",
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: colors.primaryDark,
    top: -50, right: -40, opacity: 0.4,
  },

  headerDecor2: {
    position: "absolute",
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: colors.primaryDark,
    bottom: -30, left: -20, opacity: 0.3,
  },

  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  headerLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "500",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 2,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FFFFFF",
  },

  headerBadge: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: "center",
  },

  headerBadgeNumber: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FFFFFF",
  },

  headerBadgeLabel: {
    fontSize: 10,
    color: "rgba(255,255,255,0.7)",
    marginTop: 1,
    textTransform: "uppercase",
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    gap: 8,
  },

  searchIcon: { fontSize: 14 },

  searchPlaceholder: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    flex: 1,
  },

  // ── Lista ─────────────────────────────────────────────────
  listContent: {
    paddingBottom: 32,
    paddingTop: 8,
  },

  listHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },

  listHeaderText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
  },

  listHeaderSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // ── Member Card ───────────────────────────────────────────
  memberCardWrapper: {
    marginHorizontal: 16,
    marginVertical: 5,
  },

  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 14,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  memberInfo: {
    flex: 1,
  },

  memberName: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 3,
  },

  memberDept: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: "600",
    marginBottom: 3,
  },

  memberEmail: {
    fontSize: 11,
    color: colors.textSecondary,
  },

  memberArrow: {
    fontSize: 22,
    color: colors.border,
    fontWeight: "300",
  },

  // ── Skeleton ──────────────────────────────────────────────
  skeletonList: {
    paddingTop: 16,
    paddingBottom: 32,
  },

  skeletonCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 5,
    gap: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },

  skeletonAvatar: {
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: colors.border,
  },

  skeletonContent: { flex: 1 },

  skeletonLine: {
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.border,
    width: "80%",
  },

  // ── Estados: loading / error / vacío ─────────────────────
  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },

  loadingText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
    marginTop: 16,
    textAlign: "center",
  },

  loadingSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 6,
    textAlign: "center",
  },

  errorIconWrapper: {
    width: 72, height: 72,
    borderRadius: 36,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  errorIcon: { fontSize: 32 },

  errorTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: "center",
  },

  errorMessage: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },

  retryBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: 14,
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  retryBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },

  emptyIcon: { fontSize: 52, marginBottom: 16 },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: 8,
  },

  emptySubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },

  // ── Modal ─────────────────────────────────────────────────
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    zIndex: 999,
  },

  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  modalSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: "85%",
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },

  modalHandle: {
    width: 40, height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: "center",
    marginVertical: 12,
  },

  modalLoading: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 12,
  },

  // ── Perfil del modal ──────────────────────────────────────
  profileHeader: {
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 16,
  },

  profileAvatar: {
    width: 80, height: 80, borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  profileAvatarText: {
    fontSize: 30,
    fontWeight: "900",
    color: "#FFFFFF",
  },

  profileName: {
    fontSize: 20,
    fontWeight: "900",
    color: colors.textPrimary,
    marginBottom: 4,
    textAlign: "center",
  },

  profileDept: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: "600",
    marginBottom: 10,
  },

  profileRoleBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
  },

  profileRoleText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: "700",
  },

  // ── Sección de info ───────────────────────────────────────
  infoSection: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },

  infoSectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 12,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 12,
  },

  infoIcon: { fontSize: 16, marginTop: 1 },

  infoContent: { flex: 1 },

  infoLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },

  infoValue: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: "500",
  },

  // ── Tareas del modal ──────────────────────────────────────
  taskRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  taskDot: {
    width: 8, height: 8, borderRadius: 4,
    marginTop: 5,
  },

  taskTitle: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 18,
  },

  taskTitleDone: {
    textDecorationLine: "line-through",
    color: colors.textSecondary,
  },

  taskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },

  taskBadgeDone:    { backgroundColor: colors.secondaryLight },
  taskBadgePending: { backgroundColor: colors.warningLight   },

  taskBadgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
});

export default TeamScreen;
