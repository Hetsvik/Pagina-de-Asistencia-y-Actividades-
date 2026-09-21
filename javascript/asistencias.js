document.addEventListener('DOMContentLoaded', () => {
    const btnEntrada = document.getElementById('btnEntrada');
    const btnSalida = document.getElementById('btnSalida');
    const tablaAsistencias = document.getElementById('tablaAsistencias');
    const theadTable = document.querySelector('table thead tr'); // Para cambiar los títulos de la tabla

    // Obtenemos el rol y el usuario actual del localStorage
    const userRole = localStorage.getItem('userRole') || 'empleado';
    const usernameActual = localStorage.getItem('username') || 'Usuario';

    // Función para renderizar el historial y adaptar la tabla según el rol
    const renderizarTabla = () => {
        const historial = JSON.parse(localStorage.getItem('historialAsistencias')) || [];
        tablaAsistencias.innerHTML = ''; // Limpiar tabla

        if (userRole === 'admin') {
            // --- VISTA ADMINISTRADOR ---
            // 1. Cambiamos los encabezados de la tabla para incluir al Empleado
            if (theadTable) {
                theadTable.innerHTML = `
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empleado</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                `;
            }

            // 2. Ocultamos los botones de marcar entrada/salida para el admin
            const contenedorBotones = btnEntrada ? btnEntrada.parentElement : null;
            if (contenedorBotones) {
                contenedorBotones.innerHTML = `
                    <div class="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm font-medium w-full">
                        👁️ Panel de Administrador: Visualizando los registros de asistencia de todo el personal.
                    </div>
                `;
            }

            if (historial.length === 0) {
                tablaAsistencias.innerHTML = `<tr><td colspan="4" class="px-6 py-4 text-center text-gray-500">No hay registros de asistencia en el sistema.</td></tr>`;
                return;
            }

            // 3. Renderizamos los datos de TODOS los usuarios
            historial.slice().reverse().forEach(registro => {
                const tr = document.createElement('tr');
                const colorTipo = registro.tipo === 'Entrada' ? 'text-green-600' : 'text-red-600';
                
                tr.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800">${registro.usuario || 'Desconocido'}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${registro.fecha}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${registro.hora}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold ${colorTipo}">${registro.tipo}</td>
                `;
                tablaAsistencias.appendChild(tr);
            });

        } else {
            // --- VISTA EMPLEADO ---
            // Filtramos solo los registros del empleado logueado
            const misRegistros = historial.filter(reg => reg.usuario === usernameActual);

            if (misRegistros.length === 0) {
                tablaAsistencias.innerHTML = `<tr><td colspan="3" class="px-6 py-4 text-center text-gray-500">Aún no tienes registros de asistencia.</td></tr>`;
                return;
            }

            misRegistros.slice().reverse().forEach(registro => {
                const tr = document.createElement('tr');
                const colorTipo = registro.tipo === 'Entrada' ? 'text-green-600' : 'text-red-600';
                
                tr.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${registro.fecha}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${registro.hora}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold ${colorTipo}">${registro.tipo}</td>
                `;
                tablaAsistencias.appendChild(tr);
            });
        }
    };

    // Función para registrar asistencia (Solo para empleados)
    const registrarAsistencia = (tipo) => {
        const fechaActual = new Date();
        const registro = {
            usuario: usernameActual, // Guardamos el nombre del empleado que marca
            tipo: tipo,
            fecha: fechaActual.toLocaleDateString(),
            hora: fechaActual.toLocaleTimeString()
        };

        let historial = JSON.parse(localStorage.getItem('historialAsistencias')) || [];
        historial.push(registro);
        localStorage.setItem('historialAsistencias', JSON.stringify(historial));
        
        alert(`¡${tipo} registrada a las ${registro.hora}!`);
        renderizarTabla();
    };

    // Eventos de los botones (Solo si es empleado)
    if(btnEntrada && userRole !== 'admin') btnEntrada.addEventListener('click', () => registrarAsistencia('Entrada'));
    if(btnSalida && userRole !== 'admin') btnSalida.addEventListener('click', () => registrarAsistencia('Salida'));

    // Renderizar al cargar la página
    renderizarTabla();
});