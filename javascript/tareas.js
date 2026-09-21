document.addEventListener('DOMContentLoaded', () => {
    const formTarea = document.getElementById('formTarea');
    const inputTarea = document.getElementById('inputTarea');
    const listaTareas = document.getElementById('listaTareas');

    // Cargar y mostrar tareas
    const renderizarTareas = () => {
        const tareas = JSON.parse(localStorage.getItem('listaDeTareas')) || [];
        listaTareas.innerHTML = '';

        if(tareas.length === 0) {
            listaTareas.innerHTML = '<p class="text-gray-500 text-sm">No hay tareas pendientes.</p>';
            return;
        }

        tareas.forEach((tarea, index) => {
            const li = document.createElement('li');
            li.className = `flex justify-between items-center p-3 border rounded-lg ${tarea.completada ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`;
            
            li.innerHTML = `
                <div class="flex items-center gap-3">
                    <input type="checkbox" ${tarea.completada ? 'checked' : ''} onchange="toggleTarea(${index})" class="w-5 h-5 text-blue-600">
                    <span class="${tarea.completada ? 'line-through text-gray-400' : 'text-gray-700'}">${tarea.descripcion}</span>
                </div>
                <button onclick="eliminarTarea(${index})" class="text-red-500 hover:text-red-700 text-sm font-semibold">Eliminar</button>
            `;
            listaTareas.appendChild(li);
        });
    };

    // Agregar nueva tarea
    if(formTarea) {
        formTarea.addEventListener('submit', (e) => {
            e.preventDefault();
            const descripcion = inputTarea.value.trim();
            if(!descripcion) return;

            const tareas = JSON.parse(localStorage.getItem('listaDeTareas')) || [];
            tareas.push({ descripcion: descripcion, completada: false });
            
            localStorage.setItem('listaDeTareas', JSON.stringify(tareas));
            inputTarea.value = '';
            renderizarTareas();
        });
    }

    // Funciones globales (disponibles en el HTML via onclick)
    window.toggleTarea = (index) => {
        const tareas = JSON.parse(localStorage.getItem('listaDeTareas')) || [];
        tareas[index].completada = !tareas[index].completada;
        localStorage.setItem('listaDeTareas', JSON.stringify(tareas));
        renderizarTareas();
    };

    window.eliminarTarea = (index) => {
        const tareas = JSON.parse(localStorage.getItem('listaDeTareas')) || [];
        tareas.splice(index, 1);
        localStorage.setItem('listaDeTareas', JSON.stringify(tareas));
        renderizarTareas();
    };

    // Render inicial
    renderizarTareas();
});