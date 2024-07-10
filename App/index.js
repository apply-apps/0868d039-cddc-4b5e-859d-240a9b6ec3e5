// Filename: index.js
// Combined code from all files

import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, ScrollView, View, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import axios from 'axios';

// Filename: Task.js
const Task = ({ task }) => {
    return (
        <View style={taskStyles.container}>
            <Text style={taskStyles.text}>{task.content}</Text>
        </View>
    );
};

const taskStyles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#455a64',
        borderRadius: 10,
        marginBottom: 10,
    },
    text: {
        color: '#ffffff',
    },
});

export default Task;

// Filename: Column.js
const Column = ({ column, tasks }) => {
    return (
        <View style={columnStyles.container}>
            <Text style={columnStyles.title}>{column.title}</Text>
            {tasks.map(task => (
                <Task key={task.id} task={task} />
            ))}
        </View>
    );
};

const columnStyles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
        padding: 10,
        backgroundColor: '#263238',
        borderRadius: 10,
    },
    title: {
        color: '#ffffff',
        fontSize: 18,
        marginBottom: 10,
    },
});

export default Column;

// Filename: KanbanBoard.js
const initialData = {
    tasks: {
        'task-1': { id: 'task-1', content: 'Task 1' },
        'task-2': { id: 'task-2', content: 'Task 2' },
        'task-3': { id: 'task-3', content: 'Task 3' },
    },
    columns: {
        'column-1': {
            id: 'column-1',
            title: 'To Do',
            taskIds: ['task-1', 'task-2'],
        },
        'column-2': {
            id: 'column-2',
            title: 'In Progress',
            taskIds: ['task-3'],
        },
        'column-3': {
            id: 'column-3',
            title: 'Done',
            taskIds: [],
        },
    },
    columnOrder: ['column-1', 'column-2', 'column-3'],
};

const KanbanBoard = () => {
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const animatedValue = new Animated.Value(0);

    useEffect(() => {
        Animated.spring(animatedValue, {
            toValue: 1,
            friction: 5,
            useNativeDriver: true,
        }).start();
    }, []);

    useEffect(() => {
        const fetchMessageOfTheDay = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://apihub.p.appply.xyz:3300/motd');
                setMessage(response.data.message);
            } catch (error) {
                setMessage('Failed to load message of the day.');
            }
            setLoading(false);
        };
        fetchMessageOfTheDay();
    }, []);

    const handleButtonPress = () => {
        Animated.timing(animatedValue, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            Animated.spring(animatedValue, {
                toValue: 1,
                friction: 5,
                useNativeDriver: true,
            }).start();
        });
    };

    return (
        <View style={kanbanStyles.board}>
            {loading ? <ActivityIndicator size="large" color="#ffffff" /> : <Text style={kanbanStyles.motd}>{message}</Text>}
            <View style={kanbanStyles.columnContainer}>
                {data.columnOrder.map(columnId => {
                    const column = data.columns[columnId];
                    const tasks = column.taskIds.map(taskId => data.tasks[taskId]);
                    return <Column key={column.id} column={column} tasks={tasks} />;
                })}
            </View>
            <TouchableOpacity style={kanbanStyles.button} onPress={handleButtonPress}>
                <Animated.Text style={[kanbanStyles.buttonText, { transform: [{ scale: animatedValue }] }]}>Press Me</Animated.Text>
            </TouchableOpacity>
        </View>
    );
};

const kanbanStyles = StyleSheet.create({
    board: {
        flex: 1,
        padding: 10,
    },
    motd: {
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 20,
    },
    columnContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        backgroundColor: '#3949ab',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginTop: 20,
        alignSelf: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
    },
});

export default KanbanBoard;

// Filename: App.js
const App = () => {
    return (
        <SafeAreaView style={appStyles.container}>
            <Text style={appStyles.title}>CRM Kanban Board</Text>
            <ScrollView>
                <KanbanBoard />
            </ScrollView>
        </SafeAreaView>
    );
}

const appStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        paddingTop: 30,
    },
    title: {
        color: '#ffffff',
        fontSize: 24,
        textAlign: 'center',
        marginVertical: 20,
    },
});

export default App;