


const listaAlumnos = JSON.parse(localStorage.getItem('listaAlumnos'));
const grupos = JSON.parse(localStorage.getItem('grupos'));

// Ahora puedes usar listaAlumnos y grupos aquí en esta página
console.log('Lista de alumnos:', listaAlumnos);
console.log('Grupos:', grupos);



// Código JavaScript para implementar las funcionalidades requeridas
// Define las funciones para buscar por nombre y apellido, obtener promedio, y ordenar alumnos
// Asegúrate de tener acceso a las variables listaAlumnos y grupos

function buscarPorNombre() {
    const buscarNombre = document.getElementById('buscarNombre').value;
    const resultadosBusqueda = document.getElementById('resultadosBusqueda');

    // Filtrar la lista de alumnos por nombre
    const alumnosFiltrados = listaAlumnos.filter(alumno =>
        alumno.nombre.toLowerCase().includes(buscarNombre.toLowerCase())
    );

    // Mostrar los resultados de la búsqueda
    resultadosBusqueda.innerHTML = '';
    alumnosFiltrados.forEach(alumno => {
        resultadosBusqueda.innerHTML += `${alumno.nombre} ${alumno.apellidos}<br>`;
    });
}

function buscarPorApellido() {
    const buscarApellido = document.getElementById('buscarApellido').value;
    const resultadosBusqueda = document.getElementById('resultadosBusqueda');

    // Filtrar la lista de alumnos por apellido
    const alumnosFiltrados = listaAlumnos.filter(alumno =>
        alumno.apellidos.toLowerCase().includes(buscarApellido.toLowerCase())
    );

    // Mostrar los resultados de la búsqueda
    resultadosBusqueda.innerHTML = '';
    alumnosFiltrados.forEach(alumno => {
        resultadosBusqueda.innerHTML += `${alumno.nombre} ${alumno.apellidos}<br>`;
    });
}

function buscarCalificacionPorNombre() {
    const nombreBuscado = document.getElementById('buscarNombreAlumno').value.toLowerCase();

    // Buscar al alumno por su nombre
    const alumnoEncontrado = listaAlumnos.find(alumno =>
        alumno.nombre.toLowerCase() === nombreBuscado
    );

    if (alumnoEncontrado) {
        // Si se encuentra el alumno, obtener su calificación
        const calificacion = obtenerCalificacionAlumno(alumnoEncontrado);
        document.getElementById('promedioAlumno').textContent = `La calificación de ${alumnoEncontrado.nombre} es: ${calificacion}`;
    } else {
        document.getElementById('promedioAlumno').textContent = `El alumno no fue encontrado`;
    }
}

function obtenerCalificacionAlumno(alumno) {
    const calificaciones = Object.values(alumno.calificaciones);
    const promedio = calificaciones.reduce((acc, calif) => acc + calif, 0) / calificaciones.length;
    return promedio.toFixed(2);
}

function obtenerPromedioGrupo() {
    const grupoSelect = document.getElementById('grupoSelect');
    const nombreGrupo = grupoSelect.value;

    if (!grupos || !grupos[nombreGrupo] || grupos[nombreGrupo].length === 0) {
        document.getElementById('promedioGrupo').textContent = `No hay alumnos en el grupo ${nombreGrupo}`;
        return;
    }

    const alumnosGrupo = grupos[nombreGrupo];
    let totalCalificaciones = 0;
    let totalAlumnos = 0;

    // Calcular el promedio del grupo
    alumnosGrupo.forEach(alumno => {
        const calificaciones = Object.values(alumno.calificaciones);
        totalCalificaciones += calificaciones.reduce((acc, calif) => acc + calif, 0);
        totalAlumnos += calificaciones.length;
    });

    const promedio = totalCalificaciones / totalAlumnos;

    document.getElementById('promedioGrupo').textContent = `El promedio del grupo ${nombreGrupo} es: ${promedio.toFixed(2)}`;
}


function obtenerCalificacionAlumno(alumno) {
    const calificaciones = Object.values(alumno.calificaciones);
    if (calificaciones.length === 0) {
        return 0; // Retornar 0 si no hay calificaciones
    }
    const sumaCalificaciones = calificaciones.reduce((acc, calif) => acc + calif, 0);
    const promedio = sumaCalificaciones / calificaciones.length;
    return isNaN(promedio) ? 0 : promedio; // Retornar el promedio o 0 si no es un número
}

function ordenarAlumnos() {
    const checkboxes = document.querySelectorAll('input[name="grupo"]');
    const seleccionados = [...checkboxes].filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);

    let alumnosFiltrados = [];
    if (seleccionados.includes('todos')) {
        // Obtener todos los alumnos si se seleccionan todos los grupos
        alumnosFiltrados = listaAlumnos.slice();
    } else {
        // Filtrar los alumnos por los grupos seleccionados
        seleccionados.forEach(grupo => {
            if (grupos[grupo]) {
                alumnosFiltrados = alumnosFiltrados.concat(grupos[grupo]);
            }
        });
    }

    const orden = document.querySelector('input[name="orden"]:checked').value;

    if (alumnosFiltrados.length === 0) {
        document.getElementById('alumnosOrdenados').textContent = 'No hay alumnos en el grupo seleccionado';
        return;
    }

    if (orden === 'ascendente') {
        alumnosFiltrados.sort((a, b) => obtenerCalificacionAlumno(a) - obtenerCalificacionAlumno(b));
    } else {
        alumnosFiltrados.sort((a, b) => obtenerCalificacionAlumno(b) - obtenerCalificacionAlumno(a));
    }

    const alumnosOrdenados = document.getElementById('alumnosOrdenados');
    alumnosOrdenados.innerHTML = '';

    alumnosFiltrados.forEach(alumno => {
        let nombreGrupo = '';
        if (!seleccionados.includes('todos')) {
            // Obtener el grupo al que pertenece el alumno si no se han seleccionado todos los grupos
            nombreGrupo = Object.keys(grupos).find(grupo => grupos[grupo].includes(alumno)) || '';
            nombreGrupo = ` - Grupo: ${nombreGrupo}`;
        }
        const promedio = obtenerCalificacionAlumno(alumno);
        alumnosOrdenados.innerHTML += `${alumno.nombre} ${alumno.apellidos} - Promedio: ${promedio.toFixed(2)}${nombreGrupo}<br>`;
    });
}

function redirigirAPagina() {
    // Cambiar la ubicación de la página
    localStorage.setItem('listaAlumnos', JSON.stringify(listaAlumnos));
    localStorage.setItem('grupos', JSON.stringify(grupos));
    window.location.href = 'index.html';
}