export type ColumnType = "todo" | "doing" | "done";

export type Priority = "low" | "normal" | "urgent" | "high";

export interface Assignee {
  id: string;
  name: string;
  avatar: string;
  email: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string; // HTML content
  priority: Priority;
  dueDate?: string;
  tags: string[];
  attachees?: string[]; // Assignee IDs
  attachments?: { id: string; type: 'image' | 'file'; url: string; name: string }[];
  createdAt: string;
  column: ColumnType;
}

export interface ActivityLog {
  id: string;
  taskId: string;
  taskTitle: string;
  action: "created" | "updated" | "moved" | "deleted";
  timestamp: string;
  details?: string;
}

