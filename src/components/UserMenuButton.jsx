// src/components/UserMenuButton.jsx
import { useState } from "react";
import {
  Image,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme/colors";

const UserMenuButton = ({ navigation }) => {
  const { currentUser, logout } = useAuth();
  const [visible, setVisible]   = useState(false);
  
  if (!currentUser) return null;

  const isAdmin  = currentUser.isAdmin;
  const initials = currentUser.fullName
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");

  
  // ── Cerrar sesión ─────────────────────────────────────────
  const handleLogout = async () => {
    setVisible(false);
    await logout();
    // El guard de AppNavigator redirige al Login automáticamente
  };

  return (
    <>
      {/* ── BOTÓN DE AVATAR ─────────────────────────────── */}
      <TouchableOpacity
        onPress={() => setVisible(true)}
        activeOpacity={0.75}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        {isAdmin ? (

          <Image
            source={require("../../assets/images/avatar.png")}
            style={styles.avatarImage}
            resizeMode="contain"
          />
        ) : (

          <View style={styles.avatarInitials}>
            <Text style={styles.avatarInitialsText}>{initials}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* ── MODAL CON MENÚ ──────────────────────────────── */}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setVisible(false)}
      >
        {/*
          Pressable externo: fondo semitransparente que cierra el menú al tocar fuera
          Pressable interno: la tarjeta del menú — detiene la propagación hacia el fondo
        */}
        <Pressable
          style={styles.backdrop}
          onPress={() => setVisible(false)}
        >
          <Pressable
            style={styles.menuCard}
            onPress={() => {}}   // ← evita que el toque en la card cierre el menú
          >
            {/* ── Info del usuario ──────────────────────── */}
            <View style={styles.userSection}>
              {isAdmin ? (
                <Image
                  source={require("../../assets/images/avatar.png")}
                  style={styles.menuAvatar}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.menuAvatarInitials}>
                  <Text style={styles.menuAvatarInitialsText}>{initials}</Text>
                </View>
              )}

              <View style={styles.userTexts}>
                <Text style={styles.userName} numberOfLines={1}>
                  {currentUser.fullName}
                </Text>
                <Text style={styles.userEmail} numberOfLines={1}>
                  {currentUser.email}
                </Text>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleText}>{currentUser.jobTitle}</Text>
                </View>
              </View>
            </View>

            {/* ── Divisor ───────────────────────────────── */}
            <View style={styles.divider} />

            {/* ── Opción: Cerrar sesión ─────────────────── */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemIconWrapper}>
                <Text style={styles.menuItemIcon}>🚪</Text>
              </View>
              <Text style={styles.menuItemText}>Cerrar sesión</Text>
              <Text style={styles.menuItemArrow}>›</Text>
            </TouchableOpacity>

          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

// ── ESTILOS ───────────────────────────────────────────────
const styles = StyleSheet.create({

  // ── Avatar en el header ───────────────────────────────────
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primaryLight,
  },

  avatarInitials: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.secondaryLight,
  },

  avatarInitialsText: {
    fontSize: 13,
    fontWeight: "900",
    color: "#FFFFFF",
  },

  // ── Fondo semitransparente ────────────────────────────────
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
  },

  // ── Tarjeta del menú ──────────────────────────────────────
  menuCard: {
    position: "absolute",
    top: Platform.OS === "android" ? 58 : 90,
    right: 12,
    width: 260,
    backgroundColor: colors.surface,
    borderRadius: 16,
    elevation: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },

  // ── Info del usuario ──────────────────────────────────────
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },

  menuAvatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.primaryLight,
  },

  menuAvatarInitials: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
  },

  menuAvatarInitialsText: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFFFFF",
  },

  userTexts: { flex: 1 },

  userName: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: 2,
  },

  userEmail: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 6,
  },

  roleBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: "flex-start",
  },

  roleText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.primary,
  },

  // ── Divisor ───────────────────────────────────────────────
  divider: {
    height: 1,
    backgroundColor: colors.border
  },

  // ── Opción del menú ───────────────────────────────────────
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },

  menuItemIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
  },

  menuItemIcon: { fontSize: 15 },

  menuItemText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: colors.danger,
  },

  menuItemArrow: {
    fontSize: 18,
    color: colors.border
  }
});

export default UserMenuButton;
