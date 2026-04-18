import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Button } from "reactstrap";

import { Board } from "../components/board/Board";
import { TaskModal } from "../components/board/TaskModal";
import { EmptyState } from "../components/common/EmptyState";
import { ROUTES } from "../constants/routes";
import { useTasks } from "../hooks/useTasks";
import { Task } from "../types/task";
import { getErrorMessage } from "../utils/error";

export const ProjectPage = () => {
  const { projectId = "" } = useParams();
  const navigate = useNavigate();
  const { board, isLoading, isError, error, createTask, updateTask, moveTask, deleteTask, isCreatingTask, isUpdatingTask } =
    useTasks(projectId);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [defaultColumnId, setDefaultColumnId] = useState<string | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const sortedColumns = useMemo(
    () => [...(board?.columns ?? [])].sort((left, right) => left.order - right.order),
    [board?.columns],
  );

  const openCreateModal = (columnId: string) => {
    setSubmitError(null);
    setActiveTask(null);
    setDefaultColumnId(columnId);
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setSubmitError(null);
    setActiveTask(task);
    setDefaultColumnId(task.columnId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setActiveTask(null);
    setDefaultColumnId(undefined);
    setSubmitError(null);
  };

  const handleSubmitTask = async (values: {
    columnId: string;
    title: string;
    description: string;
    dueDate: string;
  }) => {
    setSubmitError(null);

    try {
      if (activeTask) {
        await updateTask({
          taskId: activeTask.id,
          payload: {
            title: values.title,
            description: values.description || undefined,
            dueDate: values.dueDate || undefined,
          },
        });

        if (activeTask.columnId !== values.columnId) {
          const targetColumnTasks = board?.tasks.filter((task) => task.columnId === values.columnId) ?? [];
          await moveTask({
            taskId: activeTask.id,
            columnId: values.columnId,
            order: targetColumnTasks.length,
          });
        }
      } else {
        await createTask({
          columnId: values.columnId,
          title: values.title,
          description: values.description || undefined,
          dueDate: values.dueDate || undefined,
        });
      }

      closeModal();
    } catch (taskError) {
      setSubmitError(getErrorMessage(taskError).message);
    }
  };

  const handleDeleteTask = async (task: Task) => {
    try {
      await deleteTask(task.id);
      closeModal();
    } catch (taskError) {
      setSubmitError(getErrorMessage(taskError).message);
    }
  };

  if (isLoading) {
    return (
      <div className="page-section">
        <div className="soft-card bg-white p-5 text-center text-secondary">Loading project board...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="page-section">
        <Alert color="danger">{getErrorMessage(error).message}</Alert>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="page-section">
        <EmptyState
          title="Project not found"
          description="The requested board could not be loaded."
          actionLabel="Go back to dashboard"
          onAction={() => navigate(ROUTES.dashboard)}
        />
      </div>
    );
  }

  return (
    <div className="page-section">
      <div className="mb-4 d-flex flex-wrap align-items-start justify-content-between gap-3">
        <div>
          <Button color="link" className="px-0 text-decoration-none" onClick={() => navigate(ROUTES.dashboard)}>
            Back to dashboard
          </Button>
          <h1 className="h3 mb-1">{board.project.name}</h1>
          <p className="mb-0 text-secondary">
            {board.project.description?.trim() || "Organize tasks by column and keep work progressing clearly."}
          </p>
        </div>

        <Button color="primary" onClick={() => openCreateModal(sortedColumns[0]?.id ?? "")}>
          New task
        </Button>
      </div>

      {submitError ? <Alert color="danger">{submitError}</Alert> : null}

      {!board.columns.length ? (
        <EmptyState
          title="No columns configured"
          description="This project needs columns before tasks can be managed."
        />
      ) : (
        <Board board={board} onCreateTask={openCreateModal} onEditTask={openEditModal} onMoveTask={async (taskId, columnId, order) => {
          try {
            await moveTask({ taskId, columnId, order });
          } catch (moveError) {
            setSubmitError(getErrorMessage(moveError).message);
          }
        }} />
      )}

      <TaskModal
        isOpen={isModalOpen}
        columns={sortedColumns}
        initialTask={activeTask}
        defaultColumnId={defaultColumnId}
        isSubmitting={isCreatingTask || isUpdatingTask}
        onClose={closeModal}
        onSubmit={handleSubmitTask}
        onDelete={handleDeleteTask}
      />
    </div>
  );
};
