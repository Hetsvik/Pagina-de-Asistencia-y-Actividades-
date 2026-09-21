// Maneja las peticiones GET (Ej: cuando la página carga el historial)
export async function onRequestGet(context) {
    // Aquí irá la lógica para conectar a Clever Cloud usando context.env
    // Simulamos la respuesta de la base de datos por ahora:
    const datosSimulados = [
        { fecha: "2026-09-21", hora: "08:00:00", tipo: "Entrada" }
    ];

    return new Response(JSON.stringify(datosSimulados), {
        headers: { "Content-Type": "application/json" }
    });
}

// Maneja las peticiones POST (Ej: cuando el usuario hace clic en "Marcar Entrada")
export async function onRequestPost(context) {
    try {
        // Obtenemos los datos que envía el frontend (JS)
        const cuerpoPeticion = await context.request.json();
        
        // Aquí irá el código para INSERTAR en Clever Cloud
        console.log("Datos a guardar:", cuerpoPeticion);

        return new Response(JSON.stringify({ mensaje: "Asistencia registrada correctamente" }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Error al procesar la petición" }), { 
            status: 400 
        });
    }
}
const registrarAsistencia = async (tipo) => {
    const fechaActual = new Date();
    const registro = {
        tipo: tipo,
        fecha: fechaActual.toLocaleDateString(),
        hora: fechaActual.toLocaleTimeString()
    };

    try {
        // Enviamos los datos a la nueva API (Backend)
        const respuesta = await fetch('/api/asistencias', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registro)
        });

        if (respuesta.ok) {
            // Si la API responde bien, recargamos la tabla
            renderizarTabla(); 
        } else {
            console.error("Error al registrar en el servidor");
        }
    } catch (error) {
        console.error("Error de conexión:", error);
    }
};