import { useRef, useState } from "react";
import {
  Animated,
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
import { colors } from "../theme/colors";

const TEMP_EMAIL = "admin@kronotask.com";
const TEMP_PASSWORD = "admin123";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  const validate = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "El correo es obligatorio.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Ingresa un correo corporativo válido.";
    } else if (email.trim() !== TEMP_EMAIL) {
      newErrors.email = "Correo no registrado en el sistema.";
    }

    if (!password.trim()) {
      newErrors.password = "La contraseña es obligatoria.";
    } else if (password.length < 6) {
      newErrors.password = "Debe tener al menos 6 caracteres.";
    } else if (password !== TEMP_PASSWORD) {
      newErrors.password = "Contraseña incorrecta.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 6,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -6,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 60,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animatePress = (callback) => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.96,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start(callback);
  };

  const handleLogin = () => {
    animatePress(() => {
      if (validate()) {
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          navigation.replace("Home");
        }, 1200);
      } else {
        triggerShake();
      }
    });
  };

  const clearError = (field) => setErrors((prev) => ({ ...prev, [field]: "" }));

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

        <View style={styles.hero}>
          <View style={styles.circleLarge} />
          <View style={styles.circleSmall} />

          <View style={styles.logoWrapper}>
            <Text style={styles.logoLetter}>K</Text>
          </View>
          <Text style={styles.appName}>KronoTask</Text>
          <Text style={styles.appTagline}>Gestión de tareas empresariales</Text>
        </View>

        <Animated.View
          style={[styles.card, { transform: [{ translateX: shakeAnim }] }]}
        >

          <Text style={styles.cardTitle}>Iniciar sesión</Text>
          <Text style={styles.cardSubtitle}>
            Accede con tu cuenta corporativa
          </Text>

          <View style={styles.fieldWrapper}>
            <Text style={styles.label}>Correo corporativo</Text>
            <View
              style={[styles.inputRow, errors.email && styles.inputRowError]}
            >
              <Text style={styles.inputIcon}>✉️</Text>
              <TextInput
                style={styles.input}
                placeholder="usuario@empresa.com"
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={(t) => {
                  setEmail(t);
                  clearError("email");
                }}
                returnKeyType="next"
              />
            </View>
            {errors.email ? (
              <Text style={styles.errorText}>⚠ {errors.email}</Text>
            ) : null}
          </View>

          <View style={styles.fieldWrapper}>
            <Text style={styles.label}>Contraseña</Text>
            <View
              style={[styles.inputRow, errors.password && styles.inputRowError]}
            >
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={styles.input}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry={!showPass}
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  clearError("password");
                }}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity
                onPress={() => setShowPass(!showPass)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.eyeIcon}>{showPass ? "👁️‍🗨️" : "👁️"}</Text>
              </TouchableOpacity>
            </View>
            {errors.password ? (
              <Text style={styles.errorText}>⚠ {errors.password}</Text>
            ) : null}
          </View>

          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={[styles.btnPrimary, isLoading && styles.btnDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.9}
            >
              <Text style={styles.btnPrimaryText}>
                {isLoading ? "Verificando..." : "Ingresar →"}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>¿No tienes una cuenta? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("CreateAccount")}
              activeOpacity={0.8}
            >
              <Text style={styles.registerLink}>Crear una cuenta</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>plataforma</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.chipsRow}>
            <View style={styles.chip}>
              <Text style={styles.chipText}>🔐 Acceso seguro</Text>
            </View>
            <View style={styles.chip}>
              <Text style={styles.chipText}>🏢 Uso corporativo</Text>
            </View>
            <View style={styles.chip}>
              <Text style={styles.chipText}>📊 Gestión de equipos</Text>
            </View>
          </View>
        </Animated.View>

        <Text style={styles.footer}>
          © 2026 KronoTask · Todos los derechos reservados
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scroll: {
    flexGrow: 1,
    paddingBottom: 32,
  },

  hero: {
    backgroundColor: colors.primary,
    paddingTop: 64,
    paddingBottom: 56,
    alignItems: "center",
    overflow: "hidden",
  },

  circleLarge: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: colors.primaryDark,
    top: -80,
    right: -60,
    opacity: 0.5,
  },

  circleSmall: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.primaryDark,
    bottom: -40,
    left: -30,
    opacity: 0.4,
  },

  logoWrapper: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  logoLetter: {
    fontSize: 42,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -1,
  },

  appName: {
    fontSize: 30,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 1.5,
  },

  appTagline: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
    marginTop: 6,
    letterSpacing: 0.5,
  },

  card: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginTop: -24,
    borderRadius: 20,
    padding: 28,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: 4,
    textAlign: "center",
  },

  cardSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 28,
    textAlign: "center",
  },

  fieldWrapper: {
    marginBottom: 18,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 8,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.background,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 14 : 0,
  },

  inputRowError: {
    borderColor: colors.danger,
    backgroundColor: "#FFF5F5",
  },

  inputIcon: {
    fontSize: 16,
    marginRight: 10,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    paddingVertical: Platform.OS === "android" ? 12 : 0,
  },

  eyeIcon: {
    fontSize: 16,
    paddingLeft: 8,
  },

  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 6,
    fontWeight: "500",
  },

  btnPrimary: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },

  btnDisabled: {
    backgroundColor: colors.textSecondary,
    elevation: 0,
    shadowOpacity: 0,
  },

  btnPrimaryText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
  },

  registerText: {
    fontSize: 13,
    color: colors.textSecondary,
  },

  registerLink: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: "700",
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
    gap: 10,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },

  dividerText: {
    fontSize: 11,
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },

  chip: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#C7D2FE",
  },

  chipText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: "600",
  },

  footer: {
    textAlign: "center",
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 28,
    letterSpacing: 0.3,
  },
});

export default LoginScreen;
