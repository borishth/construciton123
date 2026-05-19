import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native';
import {
  ChevronDown,
  ChevronRight,
  Eye,
  FileText,
  GitBranch,
  Layers,
  Lock,
  Plus,
  Search,
  Shield,
  TreePine,
  Pencil,
  Trash2,
} from 'lucide-react-native';

import {
  fetchStages,
  fetchStageTree,
  createStage,
  deleteStage,
  updateStage,
  type Stage, type StageNode
} from '@/api/stages';



function flattenTree(nodes: StageNode[]): StageNode[] {
  return nodes.flatMap((node) => [node, ...flattenTree(node.children ?? [])]);
}

function getVisibilityColor(scope: string) {
  if (scope === 'public') {
    return '#22c55e';
  }

  if (scope === 'restricted') {
    return '#f59e0b';
  }

  return '#94a3b8';
}

type TreeNodeProps = {
  node: StageNode;
  level: number;
  expandedIds: Set<string>;
  selectedId?: string;
  onToggle: (stageId: string) => void;
  onSelect: (stage: StageNode) => void;
};

function TreeNode({ node, level, expandedIds, selectedId, onToggle, onSelect }: TreeNodeProps) {
  const children = node.children ?? [];
  const hasChildren = children.length > 0;
  const isExpanded = expandedIds.has(node.stage_id);
  const isSelected = selectedId === node.stage_id;
  const visibilityColor = getVisibilityColor(node.visibility_scope);

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => onSelect(node)}
        style={[
          styles.nodeCard,
          isSelected && styles.nodeCardSelected,
          { marginLeft: Math.min(level * 14, 42) },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => hasChildren && onToggle(node.stage_id)}
          style={styles.expandButton}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown size={17} color="#cbd5e1" />
            ) : (
              <ChevronRight size={17} color="#cbd5e1" />
            )
          ) : (
            <View style={styles.leafDot} />
          )}
        </TouchableOpacity>

        <View style={styles.nodeMain}>
          <View style={styles.nodeTitleRow}>
            <Text style={styles.nodeTitle} numberOfLines={1}>
              {node.stage_name}
            </Text>
            {node.is_root ? (
              <View style={styles.rootBadge}>
                <Text style={styles.rootBadgeText}>ROOT</Text>
              </View>
            ) : null}
          </View>

          <Text style={styles.nodePath} numberOfLines={1}>
            {node.stage_path}
          </Text>
        </View>

        <View style={styles.nodeMeta}>
          <View style={[styles.visibilityDot, { backgroundColor: visibilityColor }]} />
          <Text style={styles.childrenCount}>{node.children_count}</Text>
        </View>
      </TouchableOpacity>

      {hasChildren && isExpanded
        ? children.map((child) => (
          <TreeNode
            key={child.stage_id}
            node={child}
            level={level + 1}
            expandedIds={expandedIds}
            selectedId={selectedId}
            onToggle={onToggle}
            onSelect={onSelect}
          />
        ))
        : null}
    </View>
  );
}

export default function TreeScreen() {
  const [tree, setTree] = useState<StageNode[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);
  const [selectedStage, setSelectedStage] = useState<StageNode | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add these state variables for the form
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formScope, setFormScope] = useState('public');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add these state variables for Editing & Deleting
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editFormName, setEditFormName] = useState('');
  const [editFormScope, setEditFormScope] = useState('public');
  const [isSaving, setIsSaving] = useState(false);



  // 1. Pre-fill the edit form when opening the edit modal
  const handleOpenEditModal = () => {
    if (!selectedStage) return;
    setEditFormName(selectedStage.stage_name);
    setEditFormScope(selectedStage.visibility_scope);
    setIsEditOpen(true);
  };

  // 2. Submit the edit form to the backend
  const handleUpdateStage = async () => {
    if (!selectedStage) return;
    if (!editFormName.trim()) {
      return Alert.alert('Wait!', 'Stage name is required.');
    }

    setIsSaving(true);
    const result = await updateStage(selectedStage.stage_id, {
      stage_name: editFormName.trim(),
      visibility_scope: editFormScope,
    });
    setIsSaving(false);

    if (result) {
      setIsEditOpen(false);

      // Update selected stage state locally so the panel updates immediately
      setSelectedStage({
        ...selectedStage,
        stage_name: editFormName.trim(),
        visibility_scope: editFormScope,
      });

      loadTree(); // Refresh the list
    } else {
      Alert.alert('Error', 'Failed to update stage.');
    }
  };

  // 3. Prompt user for deletion confirmation, then execute
  const handleDeleteStage = () => {
    if (!selectedStage) return;

    Alert.alert(
      'Delete Stage',
      `Are you sure you want to delete "${selectedStage.stage_name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteStage(selectedStage.stage_id);
            if (result) {
              setSelectedStage(null); // Clear selection since it's deleted
              loadTree(); // Refresh tree
            } else {
              Alert.alert('Error', 'Failed to delete stage.');
            }
          },
        },
      ]
    );
  };

  const handleCreateStage = async () => {
    if (!formName.trim()) {
      return Alert.alert('Wait!', 'Stage name is required.');
    }

    setIsSubmitting(true);
    const result = await createStage({
      stage_name: formName.trim(),
      parent_stage_id: selectedStage?.stage_id || null, // Uses the selected stage!
      visibility_scope: formScope,
    });
    setIsSubmitting(false);

    if (result) {
      setIsCreateOpen(false); // Close modal
      setFormName(''); // Reset input
      loadTree(); // Refresh the tree to show the new stage!
    } else {
      Alert.alert('Error', 'Failed to create stage.');
    }
  };




  const loadTree = useCallback(async () => {
    setError(null);

    const [treeData, stagesData] = await Promise.all([
      fetchStageTree(),
      fetchStages(100),
    ]);

    if (!treeData) {
      setError('Could not load the stage tree. Check that the backend is running.');
      setTree([]);
      setStages([]);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    const flatTree = flattenTree(treeData);
    const nextStages = Array.isArray(stagesData) ? stagesData : flatTree;

    setTree(treeData);
    setStages(nextStages);
    setSelectedStage((current) => current ?? flatTree[0] ?? null);
    setExpandedIds(new Set(treeData.map((stage) => stage.stage_id)));
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadTree();
  }, [loadTree]);

  const onRefresh = () => {
    setRefreshing(true);
    loadTree();
  };

  const toggleNode = (stageId: string) => {
    setExpandedIds((current) => {
      const next = new Set(current);

      if (next.has(stageId)) {
        next.delete(stageId);
      } else {
        next.add(stageId);
      }

      return next;
    });
  };



  const filteredStages = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return [];
    }

    return stages.filter((stage) => {
      return (
        stage.stage_name.toLowerCase().includes(query) ||
        stage.stage_path.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, stages]);

  const stats = useMemo(() => {
    return {
      total: stages.length,
      roots: stages.filter((stage) => stage.is_root).length,
      leaves: stages.filter((stage) => stage.is_leaf).length,
    };
  }, [stages]);

  const hasSearch = searchQuery.trim().length > 0;

  return (
    <>
      <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#38bdf8" />
      }
    >
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>STAGE MAP</Text>
          <Text style={styles.title}>Tree</Text>
          <Text style={styles.subtitle}>Browse stages by hierarchy, path, and visibility.</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.addButton}
          onPress={() => setIsCreateOpen(true)}
        >
          <Plus size={22} color="#f8fafc" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBox}>
        <Search size={18} color="#64748b" />
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by stage name or path"
          placeholderTextColor="#64748b"
        />
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Layers size={18} color="#38bdf8" />
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statCard}>
          <TreePine size={18} color="#22c55e" />
          <Text style={styles.statValue}>{stats.roots}</Text>
          <Text style={styles.statLabel}>Roots</Text>
        </View>
        <View style={styles.statCard}>
          <FileText size={18} color="#f59e0b" />
          <Text style={styles.statValue}>{stats.leaves}</Text>
          <Text style={styles.statLabel}>Leaves</Text>
        </View>
      </View>

      {selectedStage ? (
        <View style={styles.selectedPanel}>
          <View style={styles.panelHeader}>
            <View>
              <Text style={styles.panelLabel}>Selected Stage</Text>
              <Text style={styles.selectedTitle} numberOfLines={1}>
                {selectedStage.stage_name}
              </Text>
            </View>
            <View
              style={[
                styles.scopeBadge,
                { borderColor: `${getVisibilityColor(selectedStage.visibility_scope)}66` },
              ]}
            >
              {selectedStage.visibility_scope === 'private' ? (
                <Lock size={13} color={getVisibilityColor(selectedStage.visibility_scope)} />
              ) : (
                <Eye size={13} color={getVisibilityColor(selectedStage.visibility_scope)} />
              )}
              <Text
                style={[
                  styles.scopeText,
                  { color: getVisibilityColor(selectedStage.visibility_scope) },
                ]}
              >
                {selectedStage.visibility_scope}
              </Text>
            </View>
          </View>

          <Text style={styles.selectedPath} numberOfLines={2}>
            {selectedStage.stage_path}
          </Text>

          <View style={styles.detailGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailValue}>{selectedStage.depth_level}</Text>
              <Text style={styles.detailLabel}>Depth</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailValue}>{selectedStage.children_count}</Text>
              <Text style={styles.detailLabel}>Children</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailValue}>{selectedStage.formtype_count}</Text>
              <Text style={styles.detailLabel}>Forms</Text>
            </View>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              activeOpacity={0.75}
              style={styles.editBtnTrigger}
              onPress={handleOpenEditModal}
            >
              <Pencil size={16} color="#38bdf8" />
              <Text style={styles.editBtnText}>Edit Stage</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.75}
              style={styles.deleteBtnTrigger}
              onPress={handleDeleteStage}
            >
              <Trash2 size={16} color="#ef4444" />
              <Text style={styles.deleteBtnText}>Delete Stage</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{hasSearch ? 'Search Results' : 'Hierarchy'}</Text>
        {loading ? <ActivityIndicator color="#38bdf8" /> : <Shield size={17} color="#64748b" />}
      </View>

      {error ? (
        <View style={styles.emptyPanel}>
          <Text style={styles.emptyTitle}>Tree unavailable</Text>
          <Text style={styles.emptyText}>{error}</Text>
        </View>
      ) : hasSearch ? (
        <View style={styles.searchResults}>
          {filteredStages.length > 0 ? (
            filteredStages.map((stage) => (
              <TouchableOpacity
                key={stage.stage_id}
                activeOpacity={0.75}
                style={styles.resultCard}
                onPress={() => setSelectedStage(stage as StageNode)}
              >
                <View style={styles.resultIcon}>
                  <GitBranch size={18} color="#38bdf8" />
                </View>
                <View style={styles.resultText}>
                  <Text style={styles.resultTitle} numberOfLines={1}>
                    {stage.stage_name}
                  </Text>
                  <Text style={styles.resultPath} numberOfLines={1}>
                    {stage.stage_path}
                  </Text>
                </View>
                <ChevronRight size={18} color="#64748b" />
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyPanel}>
              <Text style={styles.emptyTitle}>No matching stages</Text>
              <Text style={styles.emptyText}>Try another stage name or path.</Text>
            </View>
          )}
        </View>
      ) : tree.length > 0 ? (
        <View style={styles.treePanel}>
          {tree.map((node) => (
            <TreeNode
              key={node.stage_id}
              node={node}
              level={0}
              expandedIds={expandedIds}
              selectedId={selectedStage?.stage_id}
              onToggle={toggleNode}
              onSelect={setSelectedStage}
            />
          ))}
        </View>
      ) : (
        <View style={styles.emptyPanel}>
          <Text style={styles.emptyTitle}>No stages yet</Text>
          <Text style={styles.emptyText}>Create your first root stage to start the hierarchy.</Text>
        </View>
      )}
      {/* ADD THIS RIGHT BEFORE </ScrollView> */}
      <Modal visible={isCreateOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Stage</Text>

            <Text style={styles.modalLabel}>Parent Stage</Text>
            <Text style={styles.modalValue}>
              {selectedStage ? selectedStage.stage_name : 'None (Root Stage)'}
            </Text>

            <Text style={styles.modalLabel}>Stage Name</Text>
            <TextInput
              style={styles.modalInput}
              value={formName}
              onChangeText={setFormName}
              placeholder="e.g. Production Phase"
              placeholderTextColor="#64748b"
            />

            <Text style={styles.modalLabel}>Visibility Scope</Text>
            <View style={styles.scopeButtons}>
              {['public', 'private', 'restricted'].map(scope => (
                <TouchableOpacity
                  key={scope}
                  style={[styles.scopeBtn, formScope === scope && styles.scopeBtnActive]}
                  onPress={() => setFormScope(scope)}
                >
                  <Text style={[styles.scopeBtnText, formScope === scope && styles.scopeBtnTextActive]}>
                    {scope}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsCreateOpen(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={handleCreateStage} disabled={isSubmitting}>
                {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Create Stage</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </ScrollView>
    {/* Edit Stage Modal */ }
  <Modal visible={isEditOpen} transparent animationType="fade">
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Edit Stage</Text>

        <Text style={styles.modalLabel}>Stage Name</Text>
        <TextInput
          style={styles.modalInput}
          value={editFormName}
          onChangeText={setEditFormName}
          placeholder="Stage Name"
          placeholderTextColor="#64748b"
        />

        <Text style={styles.modalLabel}>Visibility Scope</Text>
        <View style={styles.scopeButtons}>
          {['public', 'private', 'restricted'].map(scope => (
            <TouchableOpacity
              key={scope}
              style={[styles.scopeBtn, editFormScope === scope && styles.scopeBtnActive]}
              onPress={() => setEditFormScope(scope)}
            >
              <Text style={[styles.scopeBtnText, editFormScope === scope && styles.scopeBtnTextActive]}>
                {scope}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.modalActions}>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsEditOpen(false)}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitBtn} onPress={handleUpdateStage} disabled={isSaving}>
            {isSaving ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Save Changes</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1117',
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 58,
    paddingBottom: 108,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
  },
  headerCopy: {
    flex: 1,
  },
  eyebrow: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 6,
  },
  title: {
    color: '#f8fafc',
    fontSize: 31,
    fontWeight: '800',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 5,
  },
  addButton: {
    width: 46,
    height: 46,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
  },
  searchBox: {
    minHeight: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#242b38',
    backgroundColor: '#151a23',
    paddingHorizontal: 14,
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    color: '#f8fafc',
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    minHeight: 94,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#242b38',
    backgroundColor: '#171b24',
    padding: 12,
    justifyContent: 'space-between',
  },
  statValue: {
    color: '#f8fafc',
    fontSize: 24,
    fontWeight: '800',
    marginTop: 8,
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
  },
  selectedPanel: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#263244',
    backgroundColor: '#171b24',
    padding: 15,
    marginTop: 16,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  panelLabel: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 5,
  },
  selectedTitle: {
    color: '#f8fafc',
    fontSize: 19,
    fontWeight: '800',
    maxWidth: 210,
  },
  scopeBadge: {
    minHeight: 30,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  scopeText: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'capitalize',
  },
  selectedPath: {
    color: '#94a3b8',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 10,
  },
  detailGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  detailItem: {
    flex: 1,
    minHeight: 62,
    borderRadius: 8,
    backgroundColor: '#111722',
    padding: 10,
  },
  detailValue: {
    color: '#e2e8f0',
    fontSize: 18,
    fontWeight: '800',
  },
  detailLabel: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 4,
  },
  sectionHeader: {
    minHeight: 32,
    marginTop: 24,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '800',
  },
  treePanel: {
    gap: 9,
  },
  nodeCard: {
    minHeight: 68,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#242b38',
    backgroundColor: '#171b24',
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 9,
  },
  nodeCardSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#182237',
  },
  expandButton: {
    width: 30,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leafDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#475569',
  },
  nodeMain: {
    flex: 1,
    minWidth: 0,
  },
  nodeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nodeTitle: {
    flexShrink: 1,
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '800',
  },
  nodePath: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 4,
  },
  rootBadge: {
    borderRadius: 6,
    backgroundColor: '#2563eb22',
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  rootBadgeText: {
    color: '#60a5fa',
    fontSize: 10,
    fontWeight: '900',
  },
  nodeMeta: {
    minWidth: 34,
    alignItems: 'center',
    gap: 6,
  },
  visibilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  childrenCount: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '800',
  },
  searchResults: {
    gap: 10,
  },
  resultCard: {
    minHeight: 70,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#242b38',
    backgroundColor: '#171b24',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultIcon: {
    width: 42,
    height: 42,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#38bdf820',
    marginRight: 12,
  },
  resultText: {
    flex: 1,
    minWidth: 0,
  },
  resultTitle: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '800',
  },
  resultPath: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 4,
  },
  emptyPanel: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#242b38',
    backgroundColor: '#171b24',
    padding: 16,
  },
  emptyTitle: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 5,
  },
  emptyText: {
    color: '#64748b',
    fontSize: 13,
    lineHeight: 19,
  },


  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  editBtnTrigger: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#38bdf844',
    backgroundColor: '#38bdf810',
  },
  editBtnText: {
    color: '#38bdf8',
    fontSize: 14,
    fontWeight: '700',
  },
  deleteBtnTrigger: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ef444444',
    backgroundColor: '#ef444410',
  },
  deleteBtnText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '700',
  },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#171b24', borderRadius: 12, padding: 20, borderWidth: 1, borderColor: '#242b38' },
  modalTitle: { color: '#f8fafc', fontSize: 20, fontWeight: '800', marginBottom: 10 },
  modalLabel: { color: '#94a3b8', fontSize: 13, fontWeight: '700', marginBottom: 8, marginTop: 16 },
  modalValue: { color: '#e2e8f0', fontSize: 16, fontWeight: '600', marginBottom: 4 },
  modalInput: { backgroundColor: '#0f1117', borderWidth: 1, borderColor: '#242b38', borderRadius: 8, padding: 14, color: '#f8fafc', fontSize: 16 },
  scopeButtons: { flexDirection: 'row', gap: 10 },
  scopeBtn: { flex: 1, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#242b38', alignItems: 'center' },
  scopeBtnActive: { backgroundColor: '#38bdf820', borderColor: '#38bdf8' },
  scopeBtnText: { color: '#94a3b8', fontSize: 13, fontWeight: '700', textTransform: 'capitalize' },
  scopeBtnTextActive: { color: '#38bdf8', fontWeight: '800' },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 32 },
  cancelBtn: { padding: 12, borderRadius: 8, minWidth: 80, alignItems: 'center', justifyContent: 'center' },
  cancelBtnText: { color: '#94a3b8', fontWeight: '700', fontSize: 15 },
  submitBtn: { backgroundColor: '#2563eb', padding: 12, borderRadius: 8, minWidth: 100, alignItems: 'center', justifyContent: 'center' },
  submitBtnText: { color: '#f8fafc', fontWeight: '700', fontSize: 15 },
});
