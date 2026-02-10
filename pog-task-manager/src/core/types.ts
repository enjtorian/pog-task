export interface TaskMetadata {
    type: 'metadata';
    version: string;
    project: string;
    module: string;
    file_type: 'regular' | 'agent' | 'review' | 'scheduled';
}

export interface TaskCategory {
    type: 'category';
    id: string;
    name: string;
    description: string;
}

export interface TaskHistory {
    timestamp: string;
    agent: string;
    action: 'created' | 'claimed' | 'progress' | 'completed' | 'blocked' | 'cancelled';
    message: string;
}

export interface TaskChecklistItem {
    text: string;
    completed: boolean;
}

export interface Task {
    type: 'task';
    id: string;
    title: string;
    description: string;
    category: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'pending' | 'in_design' | 'in_planning' | 'in_progress' | 'in_review' | 'blocked' | 'completed' | 'cancelled';

    created_at: string;
    started_at?: string | null;
    completed_at?: string | null;
    estimated_hours?: number;
    actual_hours?: number;

    assigned_to?: string | null;
    claimed_by?: string | null;
    claimed_at?: string | null;

    related_files?: string[];
    context_files?: string[];
    dependencies?: string[];
    blocking?: string[];
    tags?: string[];

    checklist?: TaskChecklistItem[];

    subtasks?: string[];
    parent_task?: string | null;

    notes?: string;
    history: TaskHistory[];

    record_path?: string;

    // Runtime properties (not in YAML)
    _filePath?: string;
    _project?: string;
    _module?: string;
}

export type TaskRecord = TaskMetadata | TaskCategory | Task;
