import { useState } from "react";
import {
    Alert,
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

const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

const CreateAccountScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const nextErrors = {};

    if (!email.trim()) nextErrors.email = "El correo es obligatorio.";
    else if (!validateEmail(email))
      nextErrors.email = "Ingresa un correo válido.";

    if (!password.trim()) nextErrors.password = "La contraseña es obligatoria.";
    else if (password.length < 6)
      nextErrors.password = "Debe tener al menos 6 caracteres.";

    if (!confirmPassword.trim())
      nextErrors.confirmPassword = "Confirma la contraseña.";
    else if (confirmPassword !== password)
      nextErrors.confirmPassword = "Las contraseñas no coinciden.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleCreate = () => {
    if (!validate()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        "Cuenta creada",
        "Tu cuenta ha sido registrada correctamente.",
        [{ text: "Aceptar", onPress: () => navigation.replace("Home") }],
      );
    }, 1000);
  };

  const clearError = (field) => setErrors((prev) => ({ ...prev, [field]: "" }));

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Crear cuenta</Text>
        <Text style={styles.subtitle}>
          Registra tus datos para acceder al dashboard.
        </Text>

        <View style={styles.formCard}>
          <View style={styles.field}>
            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="usuario@empresa.com"
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                clearError("email");
              }}
              returnKeyType="next"
            />
            {errors.email ? (
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : null}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                clearError("password");
              }}
              returnKeyType="next"
            />
            {errors.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Confirmar contraseña</Text>
            <TextInput
              style={[
                styles.input,
                errors.confirmPassword && styles.inputError,
              ]}
              placeholder="Repite tu contraseña"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                clearError("confirmPassword");
              }}
              returnKeyType="done"
              onSubmitEditing={handleCreate}
            />
            {errors.confirmPassword ? (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            ) : null}
          </View>

          <TouchableOpacity
            style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
            onPress={handleCreate}
            activeOpacity={0.85}
            disabled={isLoading}
          >
            <Text style={styles.saveButtonText}>
              {isLoading ? "Creando cuenta..." : "Crear cuenta"}
            </Text>
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>¿Ya tienes cuenta?</Text>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <Text style={styles.loginLink}>Iniciar sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    padding: 24,
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
    lineHeight: 22,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 18,
    elevation: 4,
  },
  field: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.textPrimary,
    fontSize: 15,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  inputError: {
    borderColor: colors.danger,
  },
  errorText: {
    color: colors.danger,
    marginTop: 6,
    fontSize: 12,
  },
  saveButton: {
    marginTop: 8,
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
  },
  saveButtonDisabled: {
    backgroundColor: colors.primaryDark,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  loginText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  loginLink: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 6,
  },
});

export default CreateAccountScreen;
