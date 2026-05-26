// src/components/UserMenuButton.jsx
// Botón de avatar con menú desplegable para ver info del usuario y cerrar sesión

import React, { useRef, useState } from "react";
import {
  Animated,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme/colors";

const UserMenuButton = ({ navigation }) => {
  const { currentUser, logout } = useAuth();
  const [visible, setVisible]   = useState(false);
  const scaleAnim               = useRef(new Animated.Value(0)).current;
  const opacityAnim             = useRef(new Animated.Value(0)).current;

  if (!currentUser) return null;

  const isAdmin = currentUser.isAdmin;

  // ── Iniciales del nombre para el avatar de usuarios nuevos ──
  const initials = currentUser.fullName
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");

  // ── Abrir menú ────────────────────────────────────────────
  const openMenu = () => {
    setVisible(true);
    Animated.parallel([
      Animated.spring(scaleAnim,   { toValue: 1, friction: 6, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 180, useNativeDriver: true }),
    ]).start();
  };

  // ── Cerrar menú ───────────────────────────────────────────
  const closeMenu = (callback) => {
    Animated.parallel([
      Animated.timing(scaleAnim,   { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
    ]).start(() => {
      setVisible(false);
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
      if (callback) callback();
    });
  };

  // ── Cerrar sesión ─────────────────────────────────────────
  const handleLogout = () => {
    closeMenu(async () => {
      await logout();
      navigation.replace("Login");
    });
  };

  return (
    <>
      {/* ── BOTÓN DE AVATAR ─────────────────────────────── */}
      <TouchableOpacity
        onPress={openMenu}
        activeOpacity={0.8}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        {isAdmin ? (
          // Admin → imagen del logo
          <Image
            source={require("../../assets/images/avatar.png")}
            style={styles.avatarImage}
            resizeMode="contain"
          />
        ) : (
          // Usuario nuevo → círculo con iniciales
          <View style={styles.avatarInitials}>
            <Text style={styles.avatarInitialsText}>{initials}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* ── MODAL DEL MENÚ DESPLEGABLE ─────────────────── */}
      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={() => closeMenu()}
      >
        {/* Fondo semitransparente — cerrar al tocar fuera */}
        <TouchableWithoutFeedback onPress={() => closeMenu()}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

        {/* Tarjeta del menú — esquina superior derecha */}
        <Animated.View
          style={[
            styles.menuCard,
            {
              opacity: opacityAnim,
              transform: [
                {
                  scale: scaleAnim.interpolate({
                    inputRange:  [0, 1],
                    outputRange: [0.85, 1],
                  }),
                },
              ],
            },
          ]}
        >
          {/* Info del usuario */}
          <View style={styles.userInfoSection}>
            {isAdmin ? (
              <Image
                source={require("../../assets/images/avatar.png")}
                style={styles.menuAvatar}
                resizeMode="contain"
              />
            ) : (
              <View style={[styles.menuAvatarInitials]}>
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

          {/* Divisor */}
          <View style={styles.divider} />

          {/* Opción: Cerrar sesión */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleLogout}
            activeOpacity={0.75}
          >
            <View style={styles.menuItemIcon}>
              <Text style={styles.menuItemIconText}>🚪</Text>
            </View>
            <Text style={styles.menuItemText}>Cerrar sesión</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>
        </Animated.View>
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

  // ── Modal overlay ─────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
  },

  // ── Tarjeta del menú ──────────────────────────────────────
  menuCard: {
    position: "absolute",
    top: 58,          // justo debajo del header nativo
    right: 12,
    width: 260,
    backgroundColor: colors.surface,
    borderRadius: 16,
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },

  // ── Sección de info del usuario ───────────────────────────
  userInfoSection: {
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

  userTexts: {
    flex: 1,
  },

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
    backgroundColor: colors.border,
    marginHorizontal: 0,
  },

  // ── Opciones del menú ─────────────────────────────────────
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },

  menuItemIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
  },

  menuItemIconText: {
    fontSize: 15,
  },

  menuItemText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: colors.danger,
  },

  menuItemArrow: {
    fontSize: 18,
    color: colors.border,
    fontWeight: "300",
  },
});

export default UserMenuButton;