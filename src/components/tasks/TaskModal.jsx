import React from 'react';
import { Modal } from '../common/Modal';
import { TaskForm } from './TaskForm';
import { useTaskContext } from '../../context/TaskContext';

export const TaskModal = () => {
  const {
    isTaskModalOpen,
    editingTask,
    closeTaskModal,
    addTask,
    updateTask,
    settings
  } = useTaskContext();

  const handleFormSubmit = (formData) => {
    if (editingTask && editingTask.id) {
      updateTask(editingTask.id, formData);
    } else {
      addTask(formData);
    }
    closeTaskModal();
  };

  const isEditing = Boolean(editingTask && editingTask.id);

  return (
    <Modal
      isOpen={isTaskModalOpen}
      onClose={closeTaskModal}
      title={isEditing ? 'Edit Task' : 'Create New Task'}
      maxWidth="560px"
    >
      <TaskForm
        initialValues={editingTask}
        onSubmit={handleFormSubmit}
        onCancel={closeTaskModal}
        defaultCategory={settings.defaultCategory}
        defaultPriority={settings.defaultPriority}
      />
    </Modal>
  );
};
