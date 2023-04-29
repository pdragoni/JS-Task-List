import { React, useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import './App.css';

function App() {
  const setStorage = (tasks) => localStorage.setItem('tasks', JSON.stringify(tasks))
  const saved_tasks = JSON.parse(localStorage.getItem('tasks'));

  const [newTask, setNewTask] = useState({});
  const [tasks, setTasks] = useState(saved_tasks || []);


  const handleNewTask = (text) => {
    const task = {
      text: text,
      done: false,
      createdAt: new Date(),
    };
    setNewTask(task);
  };

  useEffect(() => {
    setStorage(tasks);
  }, [tasks]);

  const addTask = () => {
    if (newTask.text === undefined) {
      alert('Digite uma tarefa!');
    }
    // setStorage([...tasks, newTask]);
    newTask.text.length > 5 && setTasks([...tasks, newTask])
    setNewTask({});
  }

  const deleteTask = (creation_date) => {
    const array = tasks.filter((task) => task.createdAt !== creation_date);
    setTasks(array);
    setStorage(array);
  }

  const deleteAllTasks = () => {
    if (tasks.length > 0) {
      let resposta = window.prompt(`Isso irá deletar todas as tarefas.\nDigite 'remover' para continuar.`)
      if (resposta) { resposta = resposta.toLowerCase() }
      resposta !== 'remover' ? setNewTask({}) : setTasks([]);
    }
  }

  const handleDoubleClick = (creation_date) => {
    const tasks_undone = tasks.map((task) => {
      if (task.createdAt === creation_date) {
        task.done = !task.done;
      }
      return task;
    });
    setTasks(tasks_undone);
    setStorage(tasks_undone);
  }

  const deleteSelected = () => {
    if (tasks.length > 0) {
      let resposta = window.prompt(`Isso irá deletar APENAS tarefas MARCADAS.\nDigite Sim para continuar.`)
      if (resposta && resposta.toLowerCase() === 'sim') {
        const filter = tasks.filter((task) => task.done !== true);
        if (filter.length === tasks.length) {
          alert('Nenhuma tarefa para deletar.')
        }
        setTasks(filter);
        setStorage(filter);
      }
    }
  }

  return (
    <div>
      <header>
        <h3>Lista de Tarefas</h3>
      </header>

      <label htmlFor="texto-tarefa">
        <input id="texto-tarefa" type="text"
          placeholder="Nova tarefa"
          onChange={({ target }) => handleNewTask(target.value)}
        />
      </label>
      <br />
      <div>
        <br />
        <button id="criar-tarefa" onClick={() => addTask()}>+</button>
        <button id="remover-finalizados" onClick={deleteSelected}>Apagar finalizadas</button>
      </div>

      <ul id="lista-tarefas">
        <button id="apaga-tudo" onClick={() => deleteAllTasks()}>Apaga Todas</button>
        <h3>SUAS TAREFAS:</h3>
        {tasks.length ? tasks.map((task, index) => (
          <li key={index} onDoubleClick={() => handleDoubleClick(task.createdAt)} className={`task-${task.done}`}>
            <span>{`${task.text}`}</span>
            <p>{format(parseISO(task.createdAt), 'yyyy, MMMM dd - HH:mm')}</p>
            <button type="button" className="deleteTask" onClick={() => handleDoubleClick(task.createdAt)}>{task.done ? "Desmarcar" : "Marcar"}</button>
            <button type="button" className="deleteTask" onClick={() => deleteTask(task.createdAt)}>Remover</button>
          </li>
        )
        ) : <p>Você não tem tarefas</p>}
      </ul>
    </div >
  );
}

export default App;
