document.addEventListener('DOMContentLoaded', () => {
    const btnEntrada = document.getElementById('btnEntrada');
    const btnSalida = document.getElementById('btnSalida');
    const tablaAsistencias = document.getElementById('tablaAsistencias');

    // Este script iría en tu archivo html/asistencias.html
document.addEventListener('DOMContentLoaded', () => {
    const btnMarcar = document.getElementById('btnMarcarEntrada');
    
    if(btnMarcar) {
        btnMarcar.addEventListener('click', () => {
            const fecha = new Date();
            const registro = {
                usuario: localStorage.getItem('username'),
                hora: fecha.toLocaleTimeString(),
                fecha: fecha.toLocaleDateString()
            };
            
            // Guardar en el almacenamiento local (Simulando una base de datos)
            let historial = JSON.parse(localStorage.getItem('historialAsistencias')) || [];
            historial.push(registro);
            localStorage.setItem('historialAsistencias', JSON.stringify(historial));
            
            alert(`Entrada registrada a las ${registro.hora}`);
        });
    }
});
    // Función para obtener y renderizar el historial desde localStorage
    const renderizarTabla = () => {
        const historial = JSON.parse(localStorage.getItem('historialAsistencias')) || [];
        tablaAsistencias.innerHTML = ''; // Limpiar tabla

        // Invertimos para mostrar lo más reciente arriba
        historial.reverse().forEach(registro => {
            const tr = document.createElement('tr');
            const colorTipo = registro.tipo === 'Entrada' ? 'text-green-600' : 'text-red-600';
            
            tr.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${registro.fecha}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${registro.hora}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold ${colorTipo}">${registro.tipo}</td>
            `;
            tablaAsistencias.appendChild(tr);
        });
    };

    // Función genérica para registrar
    const registrarAsistencia = (tipo) => {
        const fechaActual = new Date();
        const registro = {
            tipo: tipo,
            fecha: fechaActual.toLocaleDateString(),
            hora: fechaActual.toLocaleTimeString()
        };

        let historial = JSON.parse(localStorage.getItem('historialAsistencias')) || [];
        historial.push(registro);
        localStorage.setItem('historialAsistencias', JSON.stringify(historial));
        
        renderizarTabla();
    };

    // Eventos de los botones
    if(btnEntrada) btnEntrada.addEventListener('click', () => registrarAsistencia('Entrada'));
    if(btnSalida) btnSalida.addEventListener('click', () => registrarAsistencia('Salida'));

    // Renderizar al cargar la página
    renderizarTabla();
});