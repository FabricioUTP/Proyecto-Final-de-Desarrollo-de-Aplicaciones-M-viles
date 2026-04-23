import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import { colors } from '../theme/colors';
import { useTasks } from '../context/TaskContext';

const TaskDetailScreen = ({ route, navigation }) => {
  const { taskId } = route.params || {};
  const { getTaskById, toggleTaskStatus, removeTask } = useTasks();

  const task = useMemo(() => getTaskById(taskId), [getTaskById, taskId]);

  if (!task) {
    return (
      <View style={styles.emptyRoot}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <Text style={styles.emptyTitle}>Tarea no encontrada</Text>
        <Text style={styles.emptySubtitle}>La tarea seleccionada ya no está disponible.</Text>
        <TouchableOpacity
          style={styles.returnButton}
          onPress={() => navigation.navigate('Home')}
          activeOpacity={0.85}
        >
          <Text style={styles.returnText}>Volver al inicio</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleToggle = () => toggleTaskStatus(task.id);

  const handleDelete = () => {
    Alert.alert('Eliminar tarea', '¿Estás seguro de que quieres eliminar esta tarea?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => {
          removeTask(task.id);
          navigation.navigate('Home');
        },
      },
    ]);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.header}>
        <Text style={styles.title}>{task.title}</Text>
        <View style={styles.badgesRow}>
          <View style={styles.badgeItem}>
            <Text style={styles.badgeLabel}>{task.category}</Text>
          </View>
          <View style={[styles.badgeItem, task.status === 'completed' ? styles.badgeSuccess : styles.badgePending]}>
            <Text style={styles.badgeLabel}>{task.status === 'completed' ? 'Completada' : 'Pendiente'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionLabel}>Descripción</Text>
        <Text style={styles.description}>{task.description}</Text>

        <View style={styles.infoRow}>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Prioridad</Text>
            <Text style={styles.infoValue}>{task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Creado</Text>
            <Text style={styles.infoValue}>{task.createdAt}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.actionButton} onPress={handleToggle} activeOpacity={0.85}>
          <Text style={styles.actionButtonText}>{task.status === 'completed' ? 'Marcar como pendiente' : 'Marcar como completada'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={handleDelete} activeOpacity={0.85}>
          <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Eliminar tarea</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.surface,
    padding: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 14,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  badgeItem: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
  },
  badgeLabel: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  badgeSuccess: {
    backgroundColor: colors.secondaryLight,
  },
  badgePending: {
    backgroundColor: colors.warningLight,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: colors.textPrimary,
    lineHeight: 22,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 24,
  },
  infoBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  infoValue: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  actionButton: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  deleteButton: {
    backgroundColor: colors.danger,
  },
  deleteButtonText: {
    color: '#FFFFFF',
  },
  emptyRoot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 20,
  },
  returnButton: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 30,
  },
  returnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default TaskDetailScreen;
