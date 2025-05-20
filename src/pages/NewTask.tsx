import React from 'react';
import AppLayout from '../components/layout/AppLayout';
import TodoForm from '../components/forms/TodoForm';

const NewTask: React.FC = () => {
    return (
        <AppLayout>
            <TodoForm isEditing={false} />
        </AppLayout>
    );
};

export default NewTask;