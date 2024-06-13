// Este array no se puede modificar:
const posibilidades = ["piedra", "papel", "tijera"];

// Elementos HTML:
const btnStart = document.getElementById("btn-start");
const btnPlay = document.getElementById("btn-play");
const btnReset = document.getElementById("btn-reset");

const errorNombre = document.getElementById("error-nombre");
const errorNumero = document.getElementById("error-num");

const partidasTotales = document.getElementById("cuadro-partidas");

const nombre = document.querySelector('input[name=nombre]');
const partidas = document.querySelector('input[name=partidas]');

const spanActual = document.getElementById('actual');
const spanTotal = document.getElementById('total');

const imagenes = document.querySelectorAll('#jugador img');
const imagenPC = document.querySelector('#maquina img');

const historial = document.getElementById('partidas');

btnPlay.disabled = true;              // Botón "YA" desactivado, para no poder iniciar el juego hasta que los campos sean válidos

// Mostrar imágenes del jugador:
imagenes.forEach((img, i) => {
    img.src = `img/${posibilidades[i]}Jugador.png`;     // Asigno la ruta de las imágenes usando el array facilitado.

    img.addEventListener('click', () => {
        if (!btnPlay.disabled) {                          // Solo permito seleccionar imágenes si el botón "YA" no está desactivado 
            imagenes.forEach((img) => {                 // Recorro las imágenes con un forEach
                img.classList.remove('seleccionado');   // eliminando la clase 'seleccionado'
                img.classList.add('noSeleccionado');    // y añadiendo la 'noSeleccionado' a todas las img
            });
            img.classList.remove('noSeleccionado');
            img.classList.add('seleccionado');          // Añado la clase 'seleccionado' al evento click
        }
    });
});

// Función para validar el campo y mostrar el mensaje de error:
function validarCampo(campo, valor, mensajeError) {
    if(campo === "nombre") {
        if (valor.length <= 3 || !/^\D/.test(valor)) {
            mensajeError.style.display = 'block';
            return false;
        } else {
            mensajeError.style.display = 'none';
            return true;
        }
    } else if(campo === "partidas") {
        if(valor <= 0) {
            mensajeError.style.display = 'block';
            return false;
        } else {
            mensajeError.style.display = 'none';
            return true;
        }
    }
}

// Evento 'change' del nombre y las partidas:
nombre.addEventListener("change", () => {
    validarCampo("nombre", nombre.value, errorNombre);
});
partidas.addEventListener("change", () => {
    validarCampo("partidas", partidas.value, errorNumero);
});

// Evento 'click' del botón 'Empezar':
btnStart.addEventListener("click", () => {
    // Validar el nombre y las partidas
    const nombreValido = validarCampo("nombre", nombre.value, errorNombre);
    const partidasValidas = validarCampo("partidas", partidas.value, errorNumero);

    // Si ambos campos son válidos, continuar con el proceso
    if(nombreValido && partidasValidas) {
        nombre.disabled = true;
        partidas.disabled = true;
        spanTotal.innerText = partidas.value;
        btnPlay.disabled = false;
        btnStart.style.display = "none";
        btnReset.style.display = "block";
        partidasTotales.style.display = "block";
    }
});

// Botón "YA":
btnPlay.addEventListener("click", () => {
    if (spanActual.innerText >= spanTotal.innerText) {
        return;                 // Si el número actual de partidas jugadas es igual o mayor que el total, no hago nada.
    }
    spanActual.innerText++;
    btnPlay.disabled = true;      // Desactivar la selección de imágenes durante la animación
    
    // Animación para mostrar varias fotos:
    let randomImg;
    const animationImg = setInterval(() => {
        randomImg = Math.floor(Math.random() * posibilidades.length);   // Calculo un número aleatorio
        imagenPC.src = `img/${posibilidades[randomImg]}Ordenador.png`;  // y asigno la imagen a la máquina con el array predefinido
    }, 150);

    setTimeout(() => {
        clearInterval(animationImg);
        // Saber la opción de la máquina (1º consigo el string y luego el índice):
        const stringMaquina = posibilidades[randomImg];
        const tiradaMaquina = posibilidades.indexOf(stringMaquina);

        // Saber el elemento seleccionado por el usuario (por la clase) y conseguir el índice:
        const imgUsuario = document.getElementsByClassName('seleccionado')[0];
        const tiradaUsuario = Array.from(imagenes).indexOf(imgUsuario);

        // Lógica para saber el ganador de la partida:
        let resultado;
        if (tiradaMaquina === tiradaUsuario) {
            resultado = 'Empate';
        } else if ((tiradaUsuario === 0 && tiradaMaquina === posibilidades.length - 1) || (tiradaMaquina === tiradaUsuario - 1)) {
            resultado = `Gana ${nombre.value}`;
        } else {
            resultado = 'Gana la máquina';
        }
        btnPlay.disabled = false;

        // HISTORIAL:
        const jugada = document.createElement('li');    // Creo un elemento <li> para cada tirada
        jugada.textContent = resultado;                 // Le agrego el resultado de la jugada
        historial.appendChild(jugada);                  // Lo añado a la lista 'historial'
    }, 2000);
});

// Botón "RESET":
btnReset.addEventListener("click", () => {
    btnStart.style.display = "block";
    btnReset.style.display = "none";
    nombre.disabled = false;
    partidas.disabled = false;
    partidas.value = 0;
    spanTotal.innerText = 0;
    spanActual.innerText = 0;

    imagenPC.src = 'img/defecto.png';

    const nuevaPartida = document.createElement('li');  // Elemento li para mostrar en la tabla que se realiza una Nueva partida
    nuevaPartida.textContent = 'Nueva partida';
    nuevaPartida.style.fontWeight = 'bold';             // Le cambio el estilo para diferenciar de las jugadas
    nuevaPartida.style.color = "rgb(88, 88, 120)";
    historial.appendChild(nuevaPartida);

    // Para que aparezca la primera imagen seleccionada (como al inicio del juego):
    imagenes.forEach((img) => {
        img.classList.remove('seleccionado');
        img.classList.add('noSeleccionado');
    });
    imagenes[0].classList.remove('noSeleccionado');
    imagenes[0].classList.add('seleccionado');
});