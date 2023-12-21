

function Alumno(nombre, apellidos, edad) {
  this.nombre = nombre;
  this.apellidos = apellidos;
  this.edad = edad;
  this.materiasInscritas = [];
  this.calificaciones = {};
}

const listaAlumnos = [];

const grupos = {
  A: [],
  B: [],
  C: []
};


function guardarDatosEnLocalStorage() {
  localStorage.setItem('listaAlumnos', JSON.stringify(listaAlumnos));
  localStorage.setItem('grupos', JSON.stringify(grupos));
  window.location.href = 'libreria.html'; // Redirige a la nueva página
}

function limpiarSelect(selectId) {
  const select = document.getElementById(selectId);
  while (select.firstChild) {
    select.removeChild(select.firstChild);
  }
}


function llenarAlumnosSelect() {

  const alumnoSelect = document.getElementById('alumnoSelect');
  const alumnoSelectCalif = document.getElementById('alumnoSelectCalif');
  const alumnoSelectGrupo = document.getElementById('alumnoSelectGrupo');

  // Limpiar los selects antes de añadir nuevas opciones
  limpiarSelect('alumnoSelect');
  limpiarSelect('alumnoSelectCalif');
  limpiarSelect('alumnoSelectGrupo');

  listaAlumnos.forEach((alumno, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = `${alumno.nombre} ${alumno.apellidos}`;

    alumnoSelect.appendChild(option.cloneNode(true));
    if (estaInscritoEnMateria(alumno)) {
      alumnoSelectCalif.appendChild(option.cloneNode(true));
    }
    if (!estaEnGrupo(alumno)) {
      alumnoSelectGrupo.appendChild(option.cloneNode(true));
    }
  });
}
//error en ids duplicado materia
function estaInscritoEnMateria(alumno) {
  const materia = document.getElementById('materia').value;
  return alumno.materiasInscritas.includes(materia);
}

function estaEnGrupo(alumno) {
  for (const grupo in grupos) {
    if (grupos[grupo].includes(alumno)) {
      return true;
    }
  }
  return false;
}

function darDeAltaAlumno() {
  const nombre = document.getElementById('nombre').value;
  const apellidos = document.getElementById('apellidos').value;
  const edad = parseInt(document.getElementById('edad').value);

  const nuevoAlumno = new Alumno(nombre, apellidos, edad);
  listaAlumnos.push(nuevoAlumno);
  llenarAlumnosSelect();
  console.log(`Alumno ${nombre} ${apellidos} dado de alta.`);
}



function inscribirAlumnoAClase() {
  const alumnoIndex = parseInt(document.getElementById('alumnoSelect').value);
  const materia = document.getElementById('materia').value;

  if (alumnoIndex >= 0 && alumnoIndex < listaAlumnos.length) {
    const alumno = listaAlumnos[alumnoIndex];
    if (!estaInscritoEnMateria(alumno)) {
      alumno.materiasInscritas.push(materia);
      console.log(`Alumno ${alumno.nombre} inscrito a la materia ${materia}.`);
      llenarAlumnosSelect(); // Actualizar los select después de inscribir al alumno en la materia
    } else {
      console.log(`El alumno ${alumno.nombre} ya está inscrito en la materia ${materia}.`);
    }
  } else {
    console.log("Índice de alumno inválido.");
  }
}

function asignarCalificaciones() {
  const alumnoIndex = parseInt(document.getElementById('alumnoSelectCalif').value);
  const materia = document.getElementById('materiaCalif').value;
  const calif = parseFloat(document.getElementById('calificacion').value);

  if (alumnoIndex >= 0 && alumnoIndex < listaAlumnos.length) {
    const alumno = listaAlumnos[alumnoIndex];
    if (alumno.materiasInscritas.includes(materia)) {
      alumno.calificaciones[materia] = calif;
      console.log(`Calificación ${calif} asignada al alumno ${alumno.nombre} en la materia ${materia}.`);
    } else {
      console.log(`El alumno no está inscrito en la materia ${materia}.`);
    }
  } else {
    console.log("Índice de alumno inválido.");
  }
}



// function crearGrupo() {
//   const nombreGrupo = document.getElementById('nombreGrupo').value;
//   grupos[nombreGrupo] = [];
//   console.log(`Grupo ${nombreGrupo} creado.`);
// }

function asignarAlumnoAGrupo() {
  const alumnoIndex = parseInt(document.getElementById('alumnoSelectGrupo').value);
  const nombreGrupo = document.getElementById('grupo').value;

  if (alumnoIndex >= 0 && alumnoIndex < listaAlumnos.length) {
    const alumno = listaAlumnos[alumnoIndex];
    if (!estaEnGrupo(alumno)) {
      if (nombreGrupo in grupos) {
        grupos[nombreGrupo].push(alumno);
        console.log(`Alumno ${alumno.nombre} asignado al grupo ${nombreGrupo}.`);
        llenarAlumnosSelect(); // Actualizar los select después de asignar el alumno al grupo
      } else {
        console.log(`El grupo ${nombreGrupo} no existe.`);
      }
    } else {
      console.log(`El alumno ${alumno.nombre} ya está en un grupo.`);
    }
  } else {
    console.log("Índice de alumno inválido.");
  }
}

function verAlumnos() {
  console.log(listaAlumnos);
}

function verGrupos() {
  console.log(grupos);
}


//Validar las materias para las calificaciones

//validar que si el alumno ya fue agregado a x grupo no debe de salir y quitarlo del select