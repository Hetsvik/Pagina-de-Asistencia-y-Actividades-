document.addEventListener('DOMContentLoaded', () => {
    const formTarea = document.getElementById('formTarea');
    const inputTarea = document.getElementById('inputTarea');
    const listaTareas = document.getElementById('listaTareas');

    // 1. Obtenemos el rol y el nombre del usuario actual del localStorage
    const userRole = localStorage.getItem('userRole') || 'empleado';
    const usernameActual = localStorage.getItem('username') || 'Usuario';

    // 2. Si es Administrador, necesitamos un campo para elegir a qué empleado asignar la tarea
    if (userRole === 'admin') {
        const contenedorForm = formTarea ? formTarea.parentElement : null;
        if (contenedorForm && !document.getElementById('inputEmpleadoDestino')) {
            // Creamos dinámicamente un input para escribir el usuario destinatario antes del input de la tarea
            const divEmpleado = document.createElement('div');
            divEmpleado.className = 'mb-3';
            divEmpleado.innerHTML = `
                <label class="block text-gray-700 text-sm font-bold mb-1">Asignar a Empleado (Usuario):</label>
                <input type="text" id="inputEmpleadoDestino" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-sm" placeholder="Ej: juan123" required>
            `;
            formTarea.prepend(divEmpleado);
        }
    } else {
        // Si es Empleado, ocultamos el formulario de creación de tareas para que no pueda crear tareas él mismo
        if (formTarea) {
            formTarea.style.display = 'none';
            // Agregamos un mensaje informativo arriba de la lista
            const contenedorPadre = formTarea.parentElement;
            if (contenedorPadre && !document.getElementById('avisoEmpleado')) {
                const aviso = document.createElement('div');
                aviso.id = 'avisoEmpleado';
                aviso.className = 'mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm';
                aviso.innerHTML = `📋 Estás viendo las tareas que te han sido asignadas por la administración.`;
                contenedorPadre.insertBefore(aviso, listaTareas);
            }
        }
    }

    // 3. Cargar y mostrar tareas según el rol
    const renderizarTareas = () => {
        if (!listaTareas) return;
        
        const tareas = JSON.parse(localStorage.getItem('listaDeTareas')) || [];
        listaTareas.innerHTML = '';

        // Filtrar tareas según el rol
        let tareasAVisualizar = [];
        if (userRole === 'admin') {
            tareasAVisualizar = tareas; // El admin ve todas
        } else {
            // El empleado solo ve las que coincidan exactamente con su usuario
            tareasAVisualizar = tareas.filter(t => t.asignadoA && t.asignadoA.toLowerCase() === usernameActual.toLowerCase());
        }

        if(tareasAVisualizar.length === 0) {
            listaTareas.innerHTML = '<p class="text-gray-500 text-sm">No hay tareas pendientes.</p>';
            return;
        }

        tareasAVisualizar.forEach((tarea, indexReal) => {
            // Buscamos el índice real en el array general por si el empleado ve una lista filtrada
            const indexOriginal = tareas.indexOf(tarea);

            const li = document.createElement('li');
            li.className = `flex justify-between items-center p-3 border rounded-lg ${tarea.completada ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`;
            
            // Si es admin, mostramos a qué usuario se le asignó. Si es empleado, solo la descripción.
            const infoAsignacion = userRole === 'admin' ? `<span class="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-semibold mr-2">Para: ${tarea.asignadoA || 'General'}</span>` : '';

            li.innerHTML = `
                <div class="flex items-center gap-3">
                    <input type="checkbox" ${tarea.completada ? 'checked' : ''} onchange="toggleTarea(${indexOriginal})" class="w-5 h-5 text-blue-600">
                    <div>
                        ${infoAsignacion}
                        <span class="${tarea.completada ? 'line-through text-gray-400' : 'text-gray-700'}">${tarea.descripcion}</span>
                    </div>
                </div>
                ${userRole === 'admin' ? `<button onclick="eliminarTarea(${indexOriginal})" class="text-red-500 hover:text-red-700 text-sm font-semibold">Eliminar</button>` : ''}
            `;
            listaTareas.appendChild(li);
        });
    };

    // 4. Agregar nueva tarea (Solo para Admin)
    if(formTarea && userRole === 'admin') {
        formTarea.addEventListener('submit', (e) => {
            e.preventDefault();
            const descripcion = inputTarea.value.trim();
            const inputDestino = document.getElementById('inputEmpleadoDestino');
            const asignadoA = inputDestino ? inputDestino.value.trim() : '';

            if(!descripcion || !asignadoA) return;

            const tareas = JSON.parse(localStorage.getItem('listaDeTareas')) || [];
            tareas.push({ 
                descripcion: descripcion, 
                completada: false, 
                asignadoA: asignadoA 
            });
            
            localStorage.setItem('listaDeTareas', JSON.stringify(tareas));
            inputTarea.value = '';
            if(inputDestino) inputDestino.value = '';
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