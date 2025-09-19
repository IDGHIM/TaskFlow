import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native';

const App = () => {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Apprendre React Native", completed: false, priority: "high", dueDate: "2025-09-20", category: "Développement" },
    { id: 2, text: "Faire les courses", completed: true, priority: "medium", dueDate: "2025-09-18", category: "Personnel" },
    { id: 3, text: "Réunion équipe", completed: false, priority: "high", dueDate: "2025-09-19", category: "Travail" }
  ]);

  const [newTask, setNewTask] = useState('');
  const [newPriority, setNewPriority] = useState('medium');
  const [newDueDate, setNewDueDate] = useState('');
  const [newCategory, setNewCategory] = useState('Personnel');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const categories = ["Personnel", "Travail", "Développement", "Loisirs"];

  // Fonctions utilitaires
  const addTask = () => {
    if (newTask.trim()) {
      const task = {
        id: Date.now(),
        text: newTask.trim(),
        completed: false,
        priority: newPriority,
        dueDate: newDueDate,
        category: newCategory
      };
      setTasks([task, ...tasks]);
      setNewTask('');
      setNewDueDate('');
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    Alert.alert(
      "Supprimer la tâche",
      "Êtes-vous sûr de vouloir supprimer cette tâche ?",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Supprimer", onPress: () => setTasks(tasks.filter(task => task.id !== id)) }
      ]
    );
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, text: editText } : task
    ));
    setEditingId(null);
    setEditText('');
  };

  const getFilteredTasks = () => {
    return tasks.filter(task => {
      const matchesFilter = filter === 'all' || 
                           (filter === 'active' && !task.completed) ||
                           (filter === 'completed' && task.completed);
      const matchesSearch = task.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  };

  const isOverdue = (dueDate) => {
    const today = new Date().toISOString().split('T')[0];
    return dueDate && dueDate < today;
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const theme = darkMode ? darkStyles : lightStyles;

  // Composant Header
  const Header = () => (
    <View style={[styles.header, theme.headerBg]}>
      <View>
        <Text style={[styles.title, theme.titleText]}>TaskFlow</Text>
        <Text style={[styles.subtitle, theme.subtitleText]}>Organisez votre productivité</Text>
      </View>
      <TouchableOpacity 
        style={[styles.themeToggle, theme.toggleBg]} 
        onPress={() => setDarkMode(!darkMode)}
      >
        <Text style={styles.themeIcon}>{darkMode ? '☀️' : '🌙'}</Text>
      </TouchableOpacity>
    </View>
  );

  // Composant Stats
  const Stats = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;

    return (
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, theme.cardBg]}>
          <Text style={styles.statNumber}>{totalTasks}</Text>
          <Text style={[styles.statLabel, theme.text]}>Total</Text>
        </View>
        <View style={[styles.statCard, theme.cardBg]}>
          <Text style={[styles.statNumber, { color: '#10B981' }]}>{completedTasks}</Text>
          <Text style={[styles.statLabel, theme.text]}>Terminées</Text>
        </View>
        <View style={[styles.statCard, theme.cardBg]}>
          <Text style={[styles.statNumber, { color: '#F59E0B' }]}>{pendingTasks}</Text>
          <Text style={[styles.statLabel, theme.text]}>En cours</Text>
        </View>
      </View>
    );
  };

  // Composant Filters
  const Filters = () => (
    <View style={styles.filtersContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {['all', 'active', 'completed'].map(f => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterButton,
              filter === f ? styles.activeFilter : [styles.inactiveFilter, theme.filterBg]
            ]}
            onPress={() => setFilter(f)}
          >
            <Text style={[
              styles.filterText,
              filter === f ? styles.activeFilterText : theme.text
            ]}>
              {f === 'all' ? 'Toutes' : f === 'active' ? 'Actives' : 'Terminées'}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  // Composant Task Item
  const TaskItem = ({ task }) => (
    <View style={[styles.taskItem, theme.cardBg, { borderLeftColor: getPriorityColor(task.priority) }]}>
      <View style={styles.taskContent}>
        <TouchableOpacity
          style={[
            styles.checkbox,
            task.completed ? styles.checkedBox : [styles.uncheckedBox, theme.checkboxBorder]
          ]}
          onPress={() => toggleTask(task.id)}
        >
          {task.completed && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>

        <View style={styles.taskInfo}>
          {editingId === task.id ? (
            <TextInput
              style={[styles.editInput, theme.inputBg, theme.text]}
              value={editText}
              onChangeText={setEditText}
              onBlur={() => saveEdit(task.id)}
              onSubmitEditing={() => saveEdit(task.id)}
              autoFocus
            />
          ) : (
            <View>
              <Text style={[
                styles.taskText,
                theme.text,
                task.completed && styles.completedTask
              ]}>
                {task.text}
              </Text>
              <View style={styles.taskMeta}>
                <Text style={[styles.taskCategory, theme.metaText]}>{task.category}</Text>
                {task.dueDate && (
                  <Text style={[
                    styles.taskDate,
                    theme.metaText,
                    isOverdue(task.dueDate) && !task.completed && styles.overdue
                  ]}>
                    📅 {new Date(task.dueDate).toLocaleDateString('fr-FR')}
                  </Text>
                )}
              </View>
            </View>
          )}
        </View>

        <View style={styles.taskActions}>
          <TouchableOpacity
            style={[styles.actionButton, theme.actionBg]}
            onPress={() => startEdit(task.id, task.text)}
          >
            <Text style={styles.actionText}>✏</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => deleteTask(task.id)}
          >
            <Text style={styles.actionText}>🗑</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const filteredTasks = getFilteredTasks();

  return (
    <SafeAreaView style={[styles.container, theme.background]}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
      
      <Header />
      
      <ScrollView style={styles.scrollView}>
        {/* Formulaire d'ajout */}
        <View style={[styles.card, theme.cardBg]}>
          <TextInput
            style={[styles.input, theme.inputBg, theme.text]}
            value={newTask}
            onChangeText={setNewTask}
            placeholder="Nouvelle tâche..."
            placeholderTextColor={darkMode ? '#9CA3AF' : '#6B7280'}
          />
          <View style={styles.formRow}>
            <TouchableOpacity 
              style={[styles.selectButton, theme.inputBg]}
              onPress={() => Alert.alert("Catégorie", "Sélectionnez une catégorie", 
                categories.map(cat => ({
                  text: cat,
                  onPress: () => setNewCategory(cat)
                }))
              )}
            >
              <Text style={[styles.selectText, theme.text]}>{newCategory}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.selectButton, theme.inputBg]}
              onPress={() => Alert.alert("Priorité", "Sélectionnez une priorité", [
                { text: "Basse", onPress: () => setNewPriority('low') },
                { text: "Moyenne", onPress: () => setNewPriority('medium') },
                { text: "Haute", onPress: () => setNewPriority('high') }
              ])}
            >
              <Text style={[styles.selectText, theme.text]}>
                {newPriority === 'low' ? 'Basse' : newPriority === 'medium' ? 'Moyenne' : 'Haute'}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={addTask}>
            <Text style={styles.addButtonText}>+ Ajouter</Text>
          </TouchableOpacity>
        </View>

        {/* Barre de recherche */}
        <View style={[styles.card, theme.cardBg]}>
          <TextInput
            style={[styles.input, theme.inputBg, theme.text]}
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="🔍 Rechercher..."
            placeholderTextColor={darkMode ? '#9CA3AF' : '#6B7280'}
          />
        </View>

        <Filters />
        <Stats />

        {/* Liste des tâches */}
        <View style={styles.tasksSection}>
          {filteredTasks.length === 0 ? (
            <View style={[styles.emptyState, theme.cardBg]}>
              <Text style={styles.emptyIcon}>📝</Text>
              <Text style={[styles.emptyText, theme.text]}>
                {searchTerm ? 'Aucune tâche trouvée' : 'Aucune tâche pour ce filtre'}
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredTasks}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <TaskItem task={item} />}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  themeToggle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeIcon: {
    fontSize: 20,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginVertical: 4,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  selectButton: {
    flex: 0.48,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  selectText: {
    fontSize: 14,
  },
  addButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  filtersContainer: {
    marginVertical: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  activeFilter: {
    backgroundColor: '#3B82F6',
  },
  inactiveFilter: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterText: {
    fontSize: 14,
  },
  activeFilterText: {
    color: 'white',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 4,
    borderRadius: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  tasksSection: {
    marginVertical: 8,
  },
  taskItem: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 4,
    borderLeftWidth: 4,
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkedBox: {
    backgroundColor: '#10B981',
  },
  uncheckedBox: {
    borderWidth: 2,
  },
  checkmark: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  taskInfo: {
    flex: 1,
  },
  taskText: {
    fontSize: 16,
    marginBottom: 4,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  taskMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  taskCategory: {
    fontSize: 12,
    marginRight: 12,
    marginBottom: 2,
  },
  taskDate: {
    fontSize: 12,
    marginBottom: 2,
  },
  overdue: {
    color: '#EF4444',
    fontWeight: '600',
  },
  taskActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: '#EF4444',
  },
  actionText: {
    fontSize: 14,
  },
  editInput: {
    borderRadius: 6,
    padding: 8,
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    borderRadius: 12,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

// Thèmes
const lightStyles = StyleSheet.create({
  background: { backgroundColor: '#F9FAFB' },
  headerBg: { backgroundColor: '#FFFFFF' },
  titleText: { color: '#111827' },
  subtitleText: { color: '#6B7280' },
  toggleBg: { backgroundColor: '#F3F4F6' },
  cardBg: { backgroundColor: '#FFFFFF' },
  inputBg: { backgroundColor: '#F9FAFB', borderColor: '#E5E7EB', borderWidth: 1 },
  text: { color: '#111827' },
  metaText: { color: '#6B7280' },
  filterBg: { backgroundColor: '#FFFFFF' },
  checkboxBorder: { borderColor: '#D1D5DB' },
  actionBg: { backgroundColor: '#F3F4F6' },
});

const darkStyles = StyleSheet.create({
  background: { backgroundColor: '#111827' },
  headerBg: { backgroundColor: '#1F2937' },
  titleText: { color: '#F9FAFB' },
  subtitleText: { color: '#9CA3AF' },
  toggleBg: { backgroundColor: '#374151' },
  cardBg: { backgroundColor: '#1F2937' },
  inputBg: { backgroundColor: '#374151', borderColor: '#4B5563', borderWidth: 1 },
  text: { color: '#F9FAFB' },
  metaText: { color: '#9CA3AF' },
  filterBg: { backgroundColor: '#1F2937' },
  checkboxBorder: { borderColor: '#6B7280' },
  actionBg: { backgroundColor: '#374151' },
});

export default App;