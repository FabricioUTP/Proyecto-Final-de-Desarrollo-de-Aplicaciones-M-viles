import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { colors } from '../theme/colors';

const CATEGORY_ICONS = {
  'Comercial':  '??',
  'Diseño':     '??',
  'Desarrollo': '??',
  'Gestión':    '??',
  'Marketing':  '??',
  'Soporte':    '???',
  'default':    '??',
};

const TaskCard = ({ task, priorityConfig, onPress, onToggle, index = 0 }) => {
  const isCompleted = task.status === 'completed';
  const priority = priorityConfig?.[task.priority] ?? {
    label: 'Normal', color: colors.textSecondary, bg: colors.background,
  };

  const categoryIcon = CATEGORY_ICONS[task.category] ?? CATEGORY_ICONS.default;
  const entranceAnim = useRef(new Animated.Value(0)).current;
  const checkScale = useRef(new Animated.Value(1)).current;
  const cardOpacity = useRef(new Animated.Value(1)).current;
  const pressScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(entranceAnim, {
      toValue: 1,
      duration: 350,
      delay: index * 80,
      useNativeDriver: true,
    }).start();
  }, [entranceAnim, index]);

  const handleToggle = () => {
    Animated.sequence([
      Animated.timing(checkScale, { toValue: 0.75, duration: 100, useNativeDriver: true }),
      Animated.spring(checkScale, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();

    Animated.sequence([
      Animated.timing(cardOpacity, { toValue: 0.6, duration: 120, useNativeDriver: true }),
      Animated.timing(cardOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();

    onToggle();
  };

  const handlePressIn = () => {
    Animated.spring(pressScale, {
      toValue: 0.97,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressScale, {
      toValue: 1,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          opacity: Animated.multiply(entranceAnim, cardOpacity),
          transform: [
            { scale: pressScale },
            {
              translateY: entranceAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [24, 0],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={[styles.card, isCompleted && styles.cardCompleted]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <View style={[styles.priorityBar, { backgroundColor: isCompleted ? colors.secondary : priority.color }]} />
        <View style={styles.content}>
          <View style={styles.topRow}>
            <View style={[styles.categoryBadge, { backgroundColor: priority.bg }]}> 
              <Text style={styles.categoryIcon}>{categoryIcon}</Text>
              <Text style={[styles.categoryText, { color: priority.color }]}> {task.category ?? 'General'} </Text>
            </View>
            <Text style={styles.dateText}>{task.createdAt}</Text>
          </View>
          <Text style={[styles.title, isCompleted && styles.titleCompleted]} numberOfLines={2}>{task.title}</Text>
          <Text style={styles.description} numberOfLines={2}>{task.description}</Text>
          <View style={styles.bottomRow}>
            <View style={[styles.priorityBadge, { backgroundColor: priority.bg }]}> 
              <View style={[styles.priorityDot, { backgroundColor: priority.color }]} />
              <Text style={[styles.priorityText, { color: priority.color }]}>{priority.label}</Text>
            </View>
            <View style={[styles.statusBadge, isCompleted ? styles.statusCompleted : styles.statusPending]}>
              <Text style={[styles.statusText, { color: isCompleted ? colors.secondary : colors.priorityMed }]}> {isCompleted ? '? Completado' : '? Pendiente'} </Text>
            </View>
          </View>
        </View>
        <View style={styles.toggleArea}>
          <Animated.View style={{ transform: [{ scale: checkScale }] }}>
            <TouchableOpacity
              style={[styles.toggleBtn, isCompleted && styles.toggleBtnActive]}
              onPress={handleToggle}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              activeOpacity={0.8}
            >
              {isCompleted ? <Text style={styles.toggleIconDone}>?</Text> : <View style={styles.toggleCircleEmpty} />}
            </TouchableOpacity>
          </Animated.View>
          <Text style={styles.arrowIcon}>›</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginVertical: 5,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardCompleted: {
    backgroundColor: '#FAFFFE',
    borderColor: colors.secondaryLight,
    opacity: 0.92,
  },
  priorityBar: {
    width: 5,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  content: {
    flex: 1,
    padding: 18,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  categoryIcon: {
    marginRight: 8,
    fontSize: 14,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
  },
  dateText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  titleCompleted: {
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 14,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  statusPending: {
    backgroundColor: colors.warningLight,
  },
  statusCompleted: {
    backgroundColor: colors.secondaryLight,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  toggleArea: {
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },
  toggleBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleBtnActive: {
    borderColor: colors.secondary,
    backgroundColor: colors.secondaryLight,
  },
  toggleCircleEmpty: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.textSecondary,
  },
  toggleIconDone: {
    fontSize: 18,
    color: colors.secondary,
    fontWeight: '700',
  },
  arrowIcon: {
    fontSize: 22,
    color: colors.textSecondary,
    marginTop: 8,
  },
});

export default TaskCard;
