import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import { colors } from '../theme/colors';
import { useTasks } from '../context/TaskContext';

const CATEGORY_OPTIONS = [
  'Comercial',
  'Diseño',
  'Desarrollo',
  'Gestión',
  'Marketing',
  'Soporte',
];

const PRIORITY_OPTIONS = [
  { key: 'high', label: 'Alta', color: colors.priorityHigh },
  { key: 'medium', label: 'Media', color: colors.priorityMed },
  { key: 'low', label: 'Baja', color: colors.priorityLow },
];

const formatCreatedAt = () => {
  const date = new Date();
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return date
    .toLocaleDateString('es-PE', options)
    .replace(/\./g, '')
    .replace(/\s+/g, ' ');
};

const CreateTaskScreen = ({ navigation }) => {
  const { addTask } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Comercial');
  const [priority, setPriority] = useState('medium');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {};

    if (!title.trim()) nextErrors.title = 'El título es obligatorio.';
    if (!description.trim()) nextErrors.description = 'La descripción es obligatoria.';
    if (!category) nextErrors.category = 'Selecciona una categoría.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    addTask({
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      status: 'pending',
      priority,
      category,
      createdAt: formatCreatedAt(),
    });

    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Crear nueva tarea</Text>
        <Text style={styles.subtitle}>Completa los datos para agregar una tarea al dashboard.</Text>

        <View style={styles.formCard}>
          <View style={styles.field}>
            <Text style={styles.label}>Título</Text>
            <TextInput
              style={[styles.input, errors.title && styles.inputError]}
              placeholder="Nombre de la tarea"
              placeholderTextColor={colors.textSecondary}
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                setErrors((prev) => ({ ...prev, title: '' }));
              }}
              returnKeyType="next"
            />
            {errors.title ? <Text style={styles.errorText}>{errors.title}</Text> : null}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={[styles.input, styles.textArea, errors.description && styles.inputError]}
              placeholder="Detalles de la tarea"
              placeholderTextColor={colors.textSecondary}
              value={description}
              onChangeText={(text) => {
                setDescription(text);
                setErrors((prev) => ({ ...prev, description: '' }));
              }}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            {errors.description ? <Text style={styles.errorText}>{errors.description}</Text> : null}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Categoría</Text>
            <View style={styles.optionsRow}>
              {CATEGORY_OPTIONS.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[styles.optionButton, category === item && styles.optionButtonActive]}
                  onPress={() => setCategory(item)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.optionText, category === item && styles.optionTextActive]}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Prioridad</Text>
            <View style={styles.optionsRow}>
              {PRIORITY_OPTIONS.map((item) => (
                <TouchableOpacity
                  key={item.key}
                  style={[
                    styles.priorityOption,
                    priority === item.key && {
                      backgroundColor: item.color,
                      borderColor: item.color,
                    },
                  ]}
                  onPress={() => setPriority(item.key)}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.priorityOptionText, priority === item.key && { color: '#FFFFFF' }]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.85}>
            <Text style={styles.saveButtonText}>Guardar tarea</Text>
          </TouchableOpacity>
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
    fontWeight: '800',
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
    fontWeight: '700',
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
  textArea: {
    minHeight: 110,
  },
  inputError: {
    borderColor: colors.danger,
  },
  errorText: {
    color: colors.danger,
    marginTop: 6,
    fontSize: 12,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionButton: {
    backgroundColor: colors.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  optionButtonActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  optionText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  optionTextActive: {
    color: colors.primary,
  },
  priorityOption: {
    backgroundColor: colors.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginBottom: 10,
  },
  priorityOptionText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  saveButton: {
    marginTop: 8,
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default CreateTaskScreen;
