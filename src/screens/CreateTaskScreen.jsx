import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import { useTasks } from "../context/TaskContext";
import { colors } from "../theme/colors";
import { normalizeString } from "../utils/normalize";
import { takePhoto, pickPhotoFromGallery, getCurrentLocation } from "../utils/device";
import { showPermissionAlert } from "../utils/permissions";
import { scheduleTaskReminder, cancelTaskReminder } from "../utils/notifications";

const CATEGORY_OPTIONS = [
  { key: "Comercial",   icon: "💼" },
  { key: "Diseño",      icon: "🎨" },
  { key: "Desarrollo",  icon: "💻" },
  { key: "Gestión",     icon: "📊" },
  { key: "Marketing",   icon: "📣" },
  { key: "Soporte",     icon: "🛠️" },
];

const PRIORITY_OPTIONS = [
  { key: "high",   label: "Alta",  color: colors.priorityHigh, bg: "#FEE2E2", icon: "🔴" },
  { key: "medium", label: "Media", color: colors.priorityMed,  bg: "#FEF3C7", icon: "🟡" },
  { key: "low",    label: "Baja",  color: colors.priorityLow,  bg: colors.secondaryLight, icon: "🟢" },
];

const formatCreatedAt = () => {
  const date = new Date();
  return date
    .toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" })
    .replace(/\./g, "")
    .replace(/\s+/g, " ");
};

const CreateTaskScreen = ({ route, navigation }) => {
  const { addTask, updateTask, getTaskById } = useTasks();
  const taskId = route?.params?.taskId ?? null;
  const isEditMode = Boolean(taskId);
  const taskToEdit = React.useMemo(
    () => (taskId ? getTaskById(taskId) : null),
    [taskId, getTaskById],
  );

  const [title,       setTitle]       = useState("");
  const [description, setDescription] = useState("");
  const [category,    setCategory]    = useState("Comercial");
  const [priority,    setPriority]    = useState("medium");
  const [errors,      setErrors]      = useState({});
  const [isLoading,   setIsLoading]   = useState(false);

  // ── Funcionalidades nativas: foto y ubicación ──────────
  const [photoUri,        setPhotoUri]        = useState("");
  const [location,        setLocation]        = useState(null);
  const [isCameraLoading,  setIsCameraLoading]  = useState(false);
  const [isGalleryLoading, setIsGalleryLoading] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [reminderValue, setReminderValue] = useState("");       // número como string
  const [reminderUnit,  setReminderUnit]  = useState("minutes"); // "seconds"|"minutes"|"hours"|"days"
  const [reminderDropdownOpen, setReminderDropdownOpen] = useState(false);
  const [reminderError, setReminderError] = useState("");

  const REMINDER_UNITS = [
    { key: "seconds", label: "Segundos", plural: "seg" },
    { key: "minutes", label: "Minutos",  plural: "min" },
    { key: "hours",   label: "Horas",    plural: "h"   },
    { key: "days",    label: "Días",     plural: "d"   },
  ];

  const getReminderFireDate = () => {
    const n = parseInt(reminderValue, 10);
    const multipliers = { seconds: 1000, minutes: 60000, hours: 3600000, days: 86400000 };
    return new Date(Date.now() + n * multipliers[reminderUnit]);
  };

  const getReminderLabel = () => {
    const unit = REMINDER_UNITS.find((u) => u.key === reminderUnit);
    return `${reminderValue} ${unit?.label.toLowerCase()}`;
  };

  // Función pura que devuelve el error sin tocar el estado —
  // la usamos tanto en onChangeText como en handleSave para evitar
  // el problema de state asíncrono (el error no estaría actualizado
  // al momento de guardar si solo usáramos setState).
  const computeReminderError = (text, unit) => {
    if (!text) return "";
    const n = parseInt(text, 10);
    if (isNaN(n) || n <= 0) return "Ingresa un número mayor a 0.";
    if (unit === "seconds" && n < 5) return "Mínimo 5 segundos.";
    return "";
  };

  const validateReminderValue = (text) => {
    setReminderValue(text);
    setReminderError(computeReminderError(text, reminderUnit));
  };

  // Re-validar cuando cambia la unidad (ej: "1" era válido en minutos
  // pero inválido si cambia a segundos)
  const handleUnitChange = (unitKey) => {
    setReminderUnit(unitKey);
    setReminderDropdownOpen(false);
    if (reminderValue) setReminderError(computeReminderError(reminderValue, unitKey));
  };

  const handleTakePhoto = async () => {
    setIsCameraLoading(true);
    const result = await takePhoto();
    setIsCameraLoading(false);

    if (!result.ok) {
      if (result.reason === "denied" || result.reason === "blocked") {
        showPermissionAlert("la cámara", result.reason);
      }
      return;
    }
    setPhotoUri(result.uri);
  };

  const handlePickFromGallery = async () => {
    setIsGalleryLoading(true);
    const result = await pickPhotoFromGallery();
    setIsGalleryLoading(false);

    if (!result.ok) {
      if (result.reason === "denied" || result.reason === "blocked") {
        showPermissionAlert("la galería", result.reason);
      }
      return;
    }
    setPhotoUri(result.uri);
  };

  const handleGetLocation = async () => {
    setIsLocationLoading(true);
    const result = await getCurrentLocation();
    setIsLocationLoading(false);

    if (!result.ok) {
      if (result.reason === "denied" || result.reason === "blocked") {
        showPermissionAlert("la ubicación", result.reason);
      } else {
        Alert.alert("No se pudo obtener la ubicación", "Verifica que el GPS esté activado e inténtalo de nuevo.");
      }
      return;
    }
    setLocation(result.location);
  };

  React.useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setCategory(taskToEdit.category);
      setPriority(taskToEdit.priority);
      setPhotoUri(taskToEdit.photoUri || "");
      setLocation(taskToEdit.location || null);
      if (taskToEdit.reminderValue) {
        setReminderValue(taskToEdit.reminderValue);
        setReminderUnit(taskToEdit.reminderUnit || "minutes");
      }
    }
  }, [taskToEdit]);

  // ── Animaciones ────────────────────────────────────────
  const shakeAnim   = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const cardAnim    = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(cardAnim, {
      toValue: 1, duration: 400, useNativeDriver: true,
    }).start();
  }, []);

  // ── Validaciones ───────────────────────────────────────
  const validate = () => {
    const next = {};
    if (!title.trim()) {
      next.title = "El título es obligatorio.";
    } else if (title.trim().length < 5) {
      next.title = "El título debe tener al menos 5 caracteres.";
    }
    if (!description.trim()) {
      next.description = "La descripción es obligatoria.";
    } else if (description.trim().length < 10) {
      next.description = "La descripción debe tener al menos 10 caracteres.";
    }
    if (!category) {
      next.category = "Selecciona una categoría.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // ── Shake ──────────────────────────────────────────────
  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10,  duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6,   duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6,  duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0,   duration: 60, useNativeDriver: true }),
    ]).start();
  };

  // ── Animación botón ────────────────────────────────────
  const animatePress = (callback) => {
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.96, duration: 80, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1,    duration: 80, useNativeDriver: true }),
    ]).start(callback);
  };

  // ── Guardar tarea ──────────────────────────────────────
  const handleSave = () => {
    animatePress(() => {
      if (validate()) {
        setIsLoading(true);
        setTimeout(async () => {
          // Si la tarea ya tenía un recordatorio programado y el usuario
          // lo quitó o la está editando, cancelamos el anterior para no
          // dejar notificaciones huérfanas.
          if (taskToEdit?.notificationId) {
            await cancelTaskReminder(taskToEdit.notificationId);
          }

          let reminderAt = "";
          let notificationId = "";
          const reminderNum = parseInt(reminderValue, 10);
          const currentReminderError = computeReminderError(reminderValue, reminderUnit);
          if (reminderValue && !isNaN(reminderNum) && reminderNum > 0 && !currentReminderError) {
            const fireDate = getReminderFireDate();
            const taskForNotification = { id: taskId || Date.now().toString(), title: title.trim() };
            const id = await scheduleTaskReminder(taskForNotification, fireDate);
            if (id) {
              reminderAt = fireDate.toISOString();
              notificationId = id;
            }
          }

          const taskPayload = {
            title: normalizeString(title),
            description: normalizeString(description),
            priority,
            category,
            photoUri,
            location,
            reminderAt,
            notificationId,
            reminderValue: reminderValue && !currentReminderError ? reminderValue : "",
            reminderUnit,
          };

          if (isEditMode && taskToEdit) {
            updateTask({ id: taskId, ...taskPayload });

          } else {
            addTask({
            id:          Date.now().toString(),
            title:       title.trim(),
            description: description.trim(),
            status:      "pending",
            priority,
            category,
            createdAt:   formatCreatedAt(),
            ...taskPayload, 
          });
        }
          setIsLoading(false);
          navigation.goBack();
        }, 600);
      } else {
        triggerShake();
      }
    });
  };

  const clearError = (field) =>
    setErrors((prev) => ({ ...prev, [field]: "" }));

  const selectedPriority = PRIORITY_OPTIONS.find((p) => p.key === priority);
  const pageTitle = isEditMode ? "Editar tarea" : "Nueva Tarea";
  const pageSubtitle = isEditMode
    ? "Actualiza los detalles de la tarea"
    : "Completa los campos para agregar al dashboard";

  // ─────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* ── ENCABEZADO con Image ──────────────────────── */}
        <View style={styles.headerSection}>
          
          <Image
          source={require("../../assets/images/logo.png")}
          style={styles.headerLogo}
          resizeMode="contain"
          />

          <View style={styles.headerTextWrapper}>
            <Text style={styles.pageTitle}>{pageTitle}</Text>
            <Text style={styles.pageSubtitle}>{pageSubtitle}</Text>
          </View>
        </View>

        {/* ── FORMULARIO ──────────────────────────────── */}
        <Animated.View
          style={[
            styles.formCard,
            {
              opacity: cardAnim,
              transform: [{
                translateY: cardAnim.interpolate({
                  inputRange: [0, 1], outputRange: [20, 0],
                }),
              },
              { translateX: shakeAnim }],
            },
          ]}
        >

          {/* Título */}
          <View style={styles.field}>
            <Text style={styles.label}>Título de la tarea *</Text>
            <View style={[styles.inputRow, errors.title && styles.inputRowError]}>
              <Text style={styles.inputIcon}>📝</Text>
              <TextInput
                style={styles.input}
                placeholder="Nombre descriptivo de la tarea"
                placeholderTextColor={colors.textSecondary}
                value={title}
                onChangeText={(t) => { setTitle(t); clearError("title"); }}
                returnKeyType="next"
                maxLength={80}
              />
            </View>
            {errors.title
              ? <Text style={styles.errorText}>⚠ {errors.title}</Text>
              : null}
            <Text style={styles.charCount}>{title.length}/80</Text>
          </View>

          {/* Descripción */}
          <View style={styles.field}>
            <Text style={styles.label}>Descripción *</Text>
            <View style={[styles.textAreaRow, errors.description && styles.inputRowError]}>
              <TextInput
                style={styles.textArea}
                placeholder="Detalla el objetivo, contexto o pasos de la tarea..."
                placeholderTextColor={colors.textSecondary}
                value={description}
                onChangeText={(t) => { setDescription(t); clearError("description"); }}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                maxLength={300}
              />
            </View>
            {errors.description
              ? <Text style={styles.errorText}>⚠ {errors.description}</Text>
              : null}
            <Text style={styles.charCount}>{description.length}/300</Text>
          </View>

          {/* Categoría */}
          <View style={styles.field}>
            <Text style={styles.label}>Categoría *</Text>
            {errors.category
              ? <Text style={styles.errorText}>⚠ {errors.category}</Text>
              : null}
            <View style={styles.optionsGrid}>
              {CATEGORY_OPTIONS.map((item) => {
                const isActive = category === item.key;
                return (
                  <TouchableOpacity
                    key={item.key}
                    style={[styles.categoryBtn, isActive && styles.categoryBtnActive]}
                    onPress={() => { setCategory(item.key); clearError("category"); }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.categoryBtnIcon}>{item.icon}</Text>
                    <Text style={[styles.categoryBtnText, isActive && styles.categoryBtnTextActive]}>
                      {item.key}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Prioridad */}
          <View style={styles.field}>
            <Text style={styles.label}>Prioridad</Text>
            <View style={styles.priorityRow}>
              {PRIORITY_OPTIONS.map((item) => {
                const isActive = priority === item.key;
                return (
                  <TouchableOpacity
                    key={item.key}
                    style={[
                      styles.priorityBtn,
                      isActive && {
                        backgroundColor: item.bg,
                        borderColor: item.color,
                        borderWidth: 2,
                      },
                    ]}
                    onPress={() => setPriority(item.key)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.priorityBtnIcon}>{item.icon}</Text>
                    <Text style={[
                      styles.priorityBtnText,
                      isActive && { color: item.color, fontWeight: "800" },
                    ]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Foto de evidencia (cámara/galería) */}
          <View style={styles.field}>
            <Text style={styles.label}>Foto de evidencia (opcional)</Text>
            {photoUri ? (
              <View style={styles.photoPreviewWrapper}>
                <Image source={{ uri: photoUri }} style={styles.photoPreview} />
                <TouchableOpacity
                  style={styles.photoRemoveBtn}
                  onPress={() => setPhotoUri("")}
                  activeOpacity={0.8}
                >
                  <Text style={styles.photoRemoveBtnText}>✕ Quitar foto</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.photoActionsRow}>
                <TouchableOpacity
                  style={styles.nativeActionBtn}
                  onPress={handleTakePhoto}
                  disabled={isCameraLoading || isGalleryLoading}
                  activeOpacity={0.8}
                >
                  {isCameraLoading ? (
                    <ActivityIndicator color={colors.primary} />
                  ) : (
                    <>
                      <Text style={styles.nativeActionIcon}>📷</Text>
                      <Text style={styles.nativeActionText}>Tomar foto</Text>
                    </>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.nativeActionBtn}
                  onPress={handlePickFromGallery}
                  disabled={isCameraLoading || isGalleryLoading}
                  activeOpacity={0.8}
                >
                  {isGalleryLoading ? (
                    <ActivityIndicator color={colors.primary} />
                  ) : (
                    <>
                      <Text style={styles.nativeActionIcon}>🖼️</Text>
                      <Text style={styles.nativeActionText}>Galería</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Ubicación (GPS) */}
          <View style={styles.field}>
            <Text style={styles.label}>Ubicación (opcional)</Text>
            {location ? (
              <View style={styles.locationCard}>
                <Text style={styles.locationIcon}>📍</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.locationText} numberOfLines={2}>
                    {location.address || `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.locationRemoveBtn}
                  onPress={() => setLocation(null)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.locationRemoveBtnText}>✕ Quitar</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.nativeActionBtn}
                onPress={handleGetLocation}
                disabled={isLocationLoading}
                activeOpacity={0.8}
              >
                {isLocationLoading ? (
                  <ActivityIndicator color={colors.primary} />
                ) : (
                  <>
                    <Text style={styles.nativeActionIcon}>📍</Text>
                    <Text style={styles.nativeActionText}>Usar ubicación actual</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>

          {/* Recordatorio */}
          <View style={styles.field}>
            <Text style={styles.label}>Recordatorio (opcional)</Text>

            <View style={styles.reminderRow}>
              {/* Campo numérico */}
              <TextInput
                style={[
                  styles.reminderInput,
                  reminderError ? styles.inputError : null,
                ]}
                placeholder="Ej: 30"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
                maxLength={4}
                value={reminderValue === "—" ? "" : reminderValue}
                onChangeText={validateReminderValue}
              />

              {/* Dropdown de unidad */}
              <TouchableOpacity
                style={styles.reminderDropdownBtn}
                onPress={() => setReminderDropdownOpen((v) => !v)}
                activeOpacity={0.8}
              >
                <Text style={styles.reminderDropdownLabel}>
                  {REMINDER_UNITS.find((u) => u.key === reminderUnit)?.label}
                </Text>
                <Text style={styles.reminderDropdownArrow}>
                  {reminderDropdownOpen ? "▲" : "▼"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Lista desplegable de unidades */}
            {reminderDropdownOpen && (
              <View style={styles.reminderDropdownList}>
                {REMINDER_UNITS.map((unit, index) => (
                  <TouchableOpacity
                    key={unit.key}
                    style={[
                      styles.reminderDropdownItem,
                      reminderUnit === unit.key && styles.reminderDropdownItemSelected,
                      index === REMINDER_UNITS.length - 1 && { borderBottomWidth: 0 },
                    ]}
                    onPress={() => {
                      handleUnitChange(unit.key);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.reminderDropdownItemText,
                        reminderUnit === unit.key && styles.reminderDropdownItemTextSelected,
                      ]}
                    >
                      {unit.label}
                    </Text>
                    {reminderUnit === unit.key && (
                      <Text style={styles.reminderDropdownCheck}>✓</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Mensaje de error de validación */}
            {reminderError ? (
              <Text style={styles.reminderErrorText}>{reminderError}</Text>
            ) : null}

            {/* Resumen del recordatorio configurado */}
            {reminderValue && !isNaN(parseInt(reminderValue, 10)) && parseInt(reminderValue, 10) > 0 && !reminderError && (
              <View style={styles.reminderSummary}>
                <Text style={styles.reminderSummaryIcon}>🔔</Text>
                <Text style={styles.reminderSummaryText}>
                  Te notificaremos en {getReminderLabel()}
                </Text>
              </View>
            )}
          </View>

          {/* Preview de la tarea */}
          {title.trim().length > 0 && (
            <View style={styles.previewWrapper}>
              <Text style={styles.previewLabel}>Vista previa</Text>
              <View style={[styles.previewCard, { borderLeftColor: selectedPriority?.color }]}>
                <Text style={styles.previewTitle} numberOfLines={1}>{title}</Text>
                <View style={styles.previewRow}>
                  <Text style={styles.previewChip}>{category}</Text>
                  <Text style={[styles.previewPriority, { color: selectedPriority?.color }]}>
                    {selectedPriority?.icon} {selectedPriority?.label}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Botón guardar */}
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={[styles.saveBtn, (isLoading || !!reminderError) && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={isLoading || !!reminderError}
              activeOpacity={0.9}
            >
              <Text style={styles.saveBtnText}>
                {isLoading 
                ? "Guardando..." 
                : isEditMode
                  ? "Actualizar tarea →"
                  : "Guardar tarea →"}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Cancelar */}
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>

        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// ── ESTILOS ──────────────────────────────────────────────
const styles = StyleSheet.create({
  photoActionsRow: { flexDirection: "row", gap: 10 },
  nativeActionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  nativeActionIcon: { fontSize: 18 },
  nativeActionText: { fontSize: 14, fontWeight: "600", color: colors.textPrimary },
  photoPreviewWrapper: { borderRadius: 14, overflow: "hidden" },
  photoPreview: { width: "100%", height: 180, borderRadius: 14, backgroundColor: colors.surface },
  photoRemoveBtn: {
    position: "absolute", bottom: 8, right: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8,
  },
  photoRemoveBtnText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  locationCard: {
    flexDirection: "row", alignItems: "center", gap: 10,
    padding: 14, borderRadius: 12,
    borderWidth: 1.5, borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  locationIcon: { fontSize: 18 },
  locationText: { fontSize: 13, color: colors.textPrimary, fontWeight: "500" },
  locationRemoveBtn: {
    backgroundColor: colors.dangerLight,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8,
  },
  locationRemoveBtnText: { color: colors.danger, fontSize: 12, fontWeight: "700" },
  nativeActionBtnSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}15`,
  },
  nativeActionTextSelected: { color: colors.primary },

  // ── Recordatorio personalizado ─────────────────────────
  reminderRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "stretch",
  },
  reminderInput: {
    flex: 1,
    height: 50,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  reminderDropdownBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    paddingHorizontal: 14,
    height: 50,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 12,
    backgroundColor: `${colors.primary}10`,
    minWidth: 120,
  },
  reminderDropdownLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
  },
  reminderDropdownArrow: {
    fontSize: 10,
    color: colors.primary,
  },
  reminderDropdownList: {
    marginTop: 6,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  reminderDropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  reminderDropdownItemSelected: {
    backgroundColor: `${colors.primary}10`,
  },
  reminderDropdownItemText: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: "500",
  },
  reminderDropdownItemTextSelected: {
    color: colors.primary,
    fontWeight: "700",
  },
  reminderDropdownCheck: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "700",
  },
  reminderErrorText: {
    marginTop: 6,
    fontSize: 12,
    color: colors.danger,
    fontWeight: "500",
  },
  reminderSummary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: `${colors.primary}12`,
    borderWidth: 1,
    borderColor: `${colors.primary}30`,
  },
  reminderSummaryIcon: { fontSize: 16 },
  reminderSummaryText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: "600",
  },

  root: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scroll: {
    paddingBottom: 40,
  },

  // ── Encabezado ───────────────────────────────────────
  headerSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 14,
  },
  
  headerLogo: {
    width: 44,
    height: 44,
    borderRadius: 12,
  },

  headerTextWrapper: {
    flex: 1,
  },

  pageTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.textPrimary,
    letterSpacing: 0.2,
  },

  pageSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // ── Card formulario ───────────────────────────────────
  formCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 24,
    elevation: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },

  // ── Campos ───────────────────────────────────────────
  field: {
    marginBottom: 22,
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
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
    backgroundColor: colors.dangerLight,
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

  textAreaRow: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.background,
    padding: 14,
  },

  textArea: {
    fontSize: 14,
    color: colors.textPrimary,
    minHeight: 100,
    textAlignVertical: "top",
  },

  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 6,
    fontWeight: "500",
  },

  charCount: {
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: "right",
    marginTop: 4,
  },

  // ── Categoría ─────────────────────────────────────────
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },

  categoryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.border,
  },

  categoryBtnActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },

  categoryBtnIcon: {
    fontSize: 13,
  },

  categoryBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },

  categoryBtnTextActive: {
    color: colors.primary,
    fontWeight: "800",
  },

  // ── Prioridad ─────────────────────────────────────────
  priorityRow: {
    flexDirection: "row",
    gap: 10,
  },

  priorityBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.border,
  },

  priorityBtnIcon: {
    fontSize: 13,
  },

  priorityBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
  },

  // ── Preview ───────────────────────────────────────────
  previewWrapper: {
    marginBottom: 20,
  },

  previewLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
  },

  previewCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },

  previewTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 8,
  },

  previewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  previewChip: {
    fontSize: 11,
    color: colors.primary,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    fontWeight: "600",
  },

  previewPriority: {
    fontSize: 11,
    fontWeight: "700",
  },

  // ── Botones ───────────────────────────────────────────
  saveBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },

  saveBtnDisabled: {
    backgroundColor: colors.textSecondary,
    elevation: 0,
    shadowOpacity: 0,
  },

  saveBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  cancelBtn: {
    alignItems: "center",
    marginTop: 14,
    paddingVertical: 10,
  },

  cancelText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "500",
  },

});

export default CreateTaskScreen;
