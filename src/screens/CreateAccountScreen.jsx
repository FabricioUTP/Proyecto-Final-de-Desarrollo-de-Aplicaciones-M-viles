// src/screens/CreateAccountScreen.jsx
import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme/colors";

const CreateAccountScreen = ({ navigation }) => {
  const { register } = useAuth();

  const [fullName,        setFullName]        = useState("");
  const [jobTitle,        setJobTitle]        = useState("");
  const [email,           setEmail]           = useState("");
  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass,        setShowPass]        = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [errors,          setErrors]          = useState({});
  const [authError,       setAuthError]       = useState("");  // error de registro (ej: email duplicado)
  const [isLoading,       setIsLoading]       = useState(false);
  const [success,         setSuccess]         = useState(false);

  const shakeAnim   = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const successAnim = useRef(new Animated.Value(0)).current;

  // ── Validación de campos ──────────────────────────────────
  const validate = () => {
    const next = {};

    if (!fullName.trim()) {
      next.fullName = "El nombre completo es obligatorio.";
    } else if (fullName.trim().length < 3) {
      next.fullName = "Debe tener al menos 3 caracteres.";
    } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(fullName.trim())) {
      next.fullName = "Solo se permiten letras y espacios.";
    }

    if (!jobTitle.trim()) {
      next.jobTitle = "El cargo es obligatorio.";
    } else if (jobTitle.trim().length < 2) {
      next.jobTitle = "Debe tener al menos 2 caracteres.";
    }

    if (!email.trim()) {
      next.email = "El correo es obligatorio.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      next.email = "Ingresa un correo corporativo válido.";
    }

    if (!password.trim()) {
      next.password = "La contraseña es obligatoria.";
    } else if (password.length < 6) {
      next.password = "Debe tener al menos 6 caracteres.";
    } else if (!/(?=.*[A-Z])/.test(password)) {
      next.password = "Debe contener al menos una mayúscula.";
    } else if (!/(?=.*[0-9])/.test(password)) {
      next.password = "Debe contener al menos un número.";
    }

    if (!confirmPassword.trim()) {
      next.confirmPassword = "Confirma tu contraseña.";
    } else if (confirmPassword !== password) {
      next.confirmPassword = "Las contraseñas no coinciden.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // ── Shake ─────────────────────────────────────────────────
  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10,  duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6,   duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6,  duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0,   duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const animatePress = (callback) => {
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.96, duration: 80, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1,    duration: 80, useNativeDriver: true }),
    ]).start(callback);
  };

  const triggerSuccess = () => {
    Animated.spring(successAnim, {
      toValue: 1, friction: 5, useNativeDriver: true,
    }).start();
  };

  // ── Crear cuenta ──────────────────────────────────────────
  const handleCreate = () => {
    setAuthError("");
    animatePress(async () => {
      // 1. Validar campos
      if (!validate()) {
        triggerShake();
        return;
      }

      // 2. Registrar en AsyncStorage vía AuthContext
      setIsLoading(true);
      const result = await register({ fullName, jobTitle, email, password });
      setIsLoading(false);

      if (result.success) {
        // Mostrar pantalla de éxito y navegar al Home
        setSuccess(true);
        triggerSuccess();
        // AppNavigator redirige automáticamente — no necesita navigation.replace
      } else {
        // Mostrar error (ej: correo duplicado)
        setAuthError(result.error);
        triggerShake();
      }
    });
  };

  const clearError = (field) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setAuthError("");
  };

  // ── Pantalla de éxito ─────────────────────────────────────
  if (success) {
    return (
      <View style={styles.successRoot}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
        <Animated.View
          style={[
            styles.successCard,
            {
              opacity: successAnim,
              transform: [{
                scale: successAnim.interpolate({
                  inputRange: [0, 1], outputRange: [0.7, 1],
                }),
              }],
            },
          ]}
        >
          <View style={styles.successIconWrapper}>
            <Text style={styles.successIcon}>✓</Text>
          </View>
          <Text style={styles.successTitle}>¡Cuenta creada!</Text>
          <Text style={styles.successSubtitle}>
            Bienvenido a KronoTask.{"\n"}Redirigiendo al dashboard...
          </Text>
        </Animated.View>
      </View>
    );
  }

  // ─────────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── HERO ────────────────────────────────────── */}
        <View style={styles.hero}>
          <View style={styles.circleLarge} />
          <View style={styles.circleSmall} />
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.appName}>KronoTask</Text>
          <Text style={styles.appTagline}>Crea tu cuenta corporativa</Text>
        </View>

        {/* ── FORMULARIO ──────────────────────────────── */}
        <Animated.View
          style={[styles.card, { transform: [{ translateX: shakeAnim }] }]}
        >
          <Text style={styles.cardTitle}>Crear cuenta</Text>
          <Text style={styles.cardSubtitle}>
            Completa tus datos para registrarte
          </Text>

          {/* Banner de error de registro */}
          {authError ? (
            <View style={styles.authErrorBanner}>
              <Text style={styles.authErrorText}>⚠  {authError}</Text>
            </View>
          ) : null}

          {/* Nombre completo */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.label}>Nombre completo</Text>
            <View style={[styles.inputRow, errors.fullName && styles.inputRowError]}>
              <Text style={styles.inputIcon}>👤</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Juan Pérez García"
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="words"
                autoCorrect={false}
                value={fullName}
                onChangeText={(t) => { setFullName(t); clearError("fullName"); }}
                returnKeyType="next"
              />
            </View>
            {errors.fullName ? <Text style={styles.errorText}>⚠ {errors.fullName}</Text> : null}
          </View>

          {/* Cargo */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.label}>Cargo en la empresa</Text>
            <View style={[styles.inputRow, errors.jobTitle && styles.inputRowError]}>
              <Text style={styles.inputIcon}>🏢</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Gerente de Proyectos"
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="words"
                autoCorrect={false}
                value={jobTitle}
                onChangeText={(t) => { setJobTitle(t); clearError("jobTitle"); }}
                returnKeyType="next"
              />
            </View>
            {errors.jobTitle ? <Text style={styles.errorText}>⚠ {errors.jobTitle}</Text> : null}
          </View>

          {/* Correo */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.label}>Correo corporativo</Text>
            <View style={[styles.inputRow, errors.email && styles.inputRowError]}>
              <Text style={styles.inputIcon}>✉️</Text>
              <TextInput
                style={styles.input}
                placeholder="usuario@empresa.com"
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={(t) => { setEmail(t); clearError("email"); }}
                returnKeyType="next"
              />
            </View>
            {errors.email ? <Text style={styles.errorText}>⚠ {errors.email}</Text> : null}
          </View>

          {/* Contraseña */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.label}>Contraseña</Text>
            <View style={[styles.inputRow, errors.password && styles.inputRowError]}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={styles.input}
                placeholder="Mín. 6 caracteres, 1 mayúscula y 1 número"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry={!showPass}
                value={password}
                onChangeText={(t) => { setPassword(t); clearError("password"); }}
                returnKeyType="next"
              />
              <TouchableOpacity
                onPress={() => setShowPass(!showPass)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name={showPass ? "eye-off-outline" : "eye-outline"} size={22} color={colors.textSecondary}/>
              </TouchableOpacity>
            </View>
            {errors.password ? <Text style={styles.errorText}>⚠ {errors.password}</Text> : null}
            {password.length > 0 && !errors.password && (
              <View style={styles.requirementsRow}>
                <Text style={[styles.req, password.length >= 6 && styles.reqMet]}>
                  {password.length >= 6 ? "✓" : "○"} 6+ caracteres
                </Text>
                <Text style={[styles.req, /[A-Z]/.test(password) && styles.reqMet]}>
                  {/[A-Z]/.test(password) ? "✓" : "○"} Mayúscula
                </Text>
                <Text style={[styles.req, /[0-9]/.test(password) && styles.reqMet]}>
                  {/[0-9]/.test(password) ? "✓" : "○"} Número
                </Text>
              </View>
            )}
          </View>

          {/* Confirmar contraseña */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.label}>Confirmar contraseña</Text>
            <View style={[styles.inputRow, errors.confirmPassword && styles.inputRowError]}>
              <Text style={styles.inputIcon}>🔐</Text>
              <TextInput
                style={styles.input}
                placeholder="Repite tu contraseña"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry={!showConfirm}
                value={confirmPassword}
                onChangeText={(t) => { setConfirmPassword(t); clearError("confirmPassword"); }}
                returnKeyType="done"
                onSubmitEditing={handleCreate}
              />
              <TouchableOpacity
                onPress={() => setShowConfirm(!showConfirm)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name={showPass ? "eye-off-outline" : "eye-outline"} size={22} color={colors.textSecondary}/>
              </TouchableOpacity>
            </View>
            {errors.confirmPassword
              ? <Text style={styles.errorText}>⚠ {errors.confirmPassword}</Text>
              : confirmPassword.length > 0 && confirmPassword === password
                ? <Text style={styles.matchText}>✓ Las contraseñas coinciden</Text>
                : null}
          </View>

          {/* Botón crear cuenta */}
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={[styles.btnPrimary, isLoading && styles.btnDisabled]}
              onPress={handleCreate}
              disabled={isLoading}
              activeOpacity={0.9}
            >
              <Text style={styles.btnPrimaryText}>
                {isLoading ? "Creando cuenta..." : "Crear cuenta →"}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Volver al login */}
          <View style={styles.loginRow}>
            <Text style={styles.loginText}>¿Ya tienes una cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8}>
              <Text style={styles.loginLink}>Iniciar sesión</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Text style={styles.footer}>
          © 2026 KronoTask · Todos los derechos reservados
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// ── ESTILOS ───────────────────────────────────────────────
const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, paddingBottom: 32 },

  hero: {
    backgroundColor: colors.primary,
    paddingTop: 64, paddingBottom: 56,
    alignItems: "center", overflow: "hidden",
  },

  circleLarge: {
    position: "absolute", width: 260, height: 260, borderRadius: 130,
    backgroundColor: colors.primaryDark, top: -80, right: -60, opacity: 0.5,
  },

  circleSmall: {
    position: "absolute", width: 140, height: 140, borderRadius: 70,
    backgroundColor: colors.primaryDark, bottom: -40, left: -30, opacity: 0.4,
  },

  logoImage: { width: 80, height: 80, borderRadius: 24, marginBottom: 16 },
  appName:   { fontSize: 30, fontWeight: "800", color: "#FFFFFF", letterSpacing: 1.5 },
  appTagline: { fontSize: 13, color: "rgba(255,255,255,0.75)", marginTop: 6, letterSpacing: 0.5 },

  card: {
    backgroundColor: colors.surface, marginHorizontal: 20, marginTop: -24,
    borderRadius: 20, padding: 28, elevation: 8, shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 16,
  },

  cardTitle:    { fontSize: 22, fontWeight: "800", color: colors.textPrimary, marginBottom: 4, textAlign: "center" },
  cardSubtitle: { fontSize: 13, color: colors.textSecondary, marginBottom: 20, textAlign: "center" },

  authErrorBanner: {
    backgroundColor: "#FEF2F2", borderWidth: 1, borderColor: "#FECACA",
    borderRadius: 10, padding: 12, marginBottom: 16,
  },

  authErrorText: { fontSize: 13, color: colors.danger, fontWeight: "600", textAlign: "center", lineHeight: 18 },

  fieldWrapper: { marginBottom: 18 },

  label: { fontSize: 13, fontWeight: "600", color: colors.textPrimary, marginBottom: 8 },

  inputRow: {
    flexDirection: "row", alignItems: "center", borderWidth: 1.5, borderColor: colors.border,
    borderRadius: 12, backgroundColor: colors.background, paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 14 : 0,
  },

  inputRowError: { borderColor: colors.danger, backgroundColor: colors.dangerLight },
  inputIcon:     { fontSize: 16, marginRight: 10 },
  input:         { flex: 1, fontSize: 15, color: colors.textPrimary, paddingVertical: Platform.OS === "android" ? 12 : 0 }, 
  errorText:     { color: colors.danger, fontSize: 12, marginTop: 6, fontWeight: "500" },
  matchText:     { color: colors.secondary, fontSize: 12, marginTop: 6, fontWeight: "600" },

  requirementsRow: { flexDirection: "row", gap: 12, marginTop: 8, flexWrap: "wrap" },
  req:             { fontSize: 11, color: colors.textSecondary, fontWeight: "500" },
  reqMet:          { color: colors.secondary, fontWeight: "700" },

  btnPrimary: {
    backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 14,
    alignItems: "center", marginTop: 8, elevation: 4, shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8,
  },

  btnDisabled:    { backgroundColor: colors.textSecondary, elevation: 0, shadowOpacity: 0 },
  btnPrimaryText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700", letterSpacing: 0.5 },

  loginRow:  { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 18 },
  loginText: { fontSize: 13, color: colors.textSecondary },
  loginLink: { fontSize: 13, color: colors.primary, fontWeight: "700" },

  footer: { textAlign: "center", fontSize: 11, color: colors.textSecondary, marginTop: 28, letterSpacing: 0.3 },

  successRoot: { flex: 1, backgroundColor: colors.primary, justifyContent: "center", alignItems: "center", padding: 32 },
  successCard: { backgroundColor: colors.surface, borderRadius: 24, padding: 40, alignItems: "center", width: "100%", elevation: 12 },
  successIconWrapper: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.secondaryLight, justifyContent: "center", alignItems: "center", marginBottom: 20 },
  successIcon:    { fontSize: 36, color: colors.secondary, fontWeight: "900" },
  successTitle:   { fontSize: 24, fontWeight: "900", color: colors.textPrimary, marginBottom: 12 },
  successSubtitle: { fontSize: 14, color: colors.textSecondary, textAlign: "center", lineHeight: 22 },
});

export default CreateAccountScreen;