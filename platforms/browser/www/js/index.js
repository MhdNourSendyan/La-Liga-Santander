// Importar las funciones necesarias de firebase.
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getAuth,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GithubAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  onChildAdded,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
// Configuracion de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAd5GVpIHKB0NzZ4MdxHxChNM6Wc-adbY8",
  authDomain: "la-liga-santander-0.firebaseapp.com",
  projectId: "la-liga-santander-0",
  storageBucket: "la-liga-santander-0.appspot.com",
  messagingSenderId: "643741675250",
  appId: "1:643741675250:web:521e97317345e86c50ea6b",
  measurementId: "G-E1Y8853ZJ2",
  databaseURL:
    "https://la-liga-santander-0-default-rtdb.europe-west1.firebasedatabase.app/",
};
// Inicializacion de los diferentes servicios de Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// INICIO DE SESIÓN CON GOOGLE
// Declaración de las variables "user" y "clasificacionEquipos"
let user,
  clasificacionEquipos = null;
// Agregar un evento "deviceready" al documento para llamar a la función "onDeviceReady" cuando el dispositivo esté listo.
document.addEventListener("deviceready", onDeviceReady, false);
// Función que se ejecutará cuando el dispositivo esté listo.
function onDeviceReady() {
  // Llamada a la función "getRed".
  getRed();
  // Agregar un evento "click" botón de Google para iniciar sesión con Google.
  document.querySelector("#googleLogin").addEventListener("click", function () {
    // Crear una instancia del proveedor de autenticación de Google.
    const provider = new GoogleAuthProvider(auth);
    // Iniciar sesión con redireccionamiento y, cuando se complete, llamar a la función "getRed" para actualizar la página.
    signInWithRedirect(auth, provider).then(() => {
      getRed();
    });
  });
  // Definición de la función "getRed".
  function getRed() {
    // Obtener el resultado de la redirección de inicio de sesión de Google.
    getRedirectResult(auth)
      .then((result) => {
        // Extraer la información del usuario del resultado y asignarla a la variable "user_info".
        const user_info = result.user;
        // console.log("User info: ", user_info);
        // Extraer el nombre de usuario a partir de la dirección de correo electrónico y asignarlo a la variable "user".
        user = user_info.email
          .slice(0, user_info.email.indexOf("@"))
          .replaceAll(".", " ");
        // Extraer el nombre del usuario de la información del usuario y asignarlo a la variable "name".
        let name = user_info.displayName;
        // Se ocultan las opciones de inicio de sesión y se muestra la opción de logout.
        const pageLogin = document.querySelectorAll("#page-login li");
        pageLogin[0].classList.add("d-none");
        pageLogin[1].classList.add("d-none");
        pageLogin[2].classList.remove("d-none");
        // Oculta la sección de bienvenida y muestra la sección principal
        const pageWelcome = document.getElementById("page-main-info");
        pageWelcome.classList.remove("d-block");
        pageWelcome.classList.add("d-none");
        const pageMain = document.getElementById("page-main");
        pageMain.classList.remove("d-none");
        pageMain.classList.add("d-block");
        const footer = document.getElementById("footer");
        footer.classList.remove("fixed-bottom");
        // Mostrar un mensaje de bienvenida en la página principal con el nombre del usuario.
        document.getElementById("page-main-welcome").innerHTML =
          "Bienvenido " + name;
        // Obtener una referencia a la base de datos para el usuario actual.
        let root_ref = ref(db, "users/" + user);
        // Establecer los datos del usuario en la base de datos.
        set(root_ref, {
          nombre: name,
          usuario: user,
          email: user_info.email,
        });
        // Llamada a la función "getClasificacionEquipos".
        getClasificacionEquipos();
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
// INICIO DE SESIÓN CON GITHUB
// Se selecciona el botón de Github
const githubButton = document.querySelector("#githubLogin");
// Se añade un evento de clic al botón de Github
githubButton.addEventListener("click", (e) => {
  // Se crea una instancia del proveedor de autenticación de Github
  const provider = new GithubAuthProvider();
  // Se llama a la función signInWithPopup() para autenticar al usuario con Github
  signInWithPopup(auth, provider)
    .then((credentials) => {
      // console.log(credentials);
      // Se cierra el modal de inicio de sesión
      const modal = bootstrap.Modal.getInstance(signInForm.closest(".modal"));
      modal.hide();
      // Se ocultan las opciones de inicio de sesión y se muestra la opción de logout.
      const pageLogin = document.querySelectorAll("#page-login li");
      pageLogin[0].classList.add("d-none");
      pageLogin[1].classList.add("d-none");
      pageLogin[2].classList.remove("d-none");
      // Oculta la sección de bienvenida y muestra la sección principal
      const pageWelcome = document.getElementById("page-main-info");
      pageWelcome.classList.remove("d-block");
      pageWelcome.classList.add("d-none");
      const pageMain = document.getElementById("page-main");
      pageMain.classList.remove("d-none");
      pageMain.classList.add("d-block");
      const footer = document.getElementById("footer");
      footer.classList.remove("fixed-bottom");
      let user = credentials.user.displayName;
      // Mostrar un mensaje de bienvenida en la página principal con el nombre del usuario.
      document.getElementById("page-main-welcome").innerHTML =
        "Bienvenido " + user;
      // Llamada a la función "getClasificacionEquipos".
      getClasificacionEquipos();
    })
    .catch((error) => {
      // Se muestra un modal de error en caso de que ocurra un error durante la autenticación
      console.log(error);
    });
});
// REGISTRARSE CON CORREO Y CONTRASEÑA
// Selecciona el formulario de registro en el HTML
const signUpForm = document.querySelector("#signup-form");
// Añade un evento de "submit" al formulario de registro
signUpForm.addEventListener("submit", (e) => {
  // Previene que se envíe el formulario y se recargue la página.
  e.preventDefault();
  // Obtiene el valor del campo de correo electrónico y de contraseña del formulario.
  const email = signUpForm["signup-email"].value;
  const password = signUpForm["signup-password"].value;
  // Crea un usuario con la dirección de correo electrónico y la contraseña proporcionadas.
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Imprime en la consola el objeto del usuario creado.
      // console.log(userCredential);
      // Cierra la ventana modal de registro.
      const signupModal = document.querySelector("#signupModal");
      const modal = bootstrap.Modal.getInstance(signupModal);
      modal.hide();
      // Reinicia el formulario
      signUpForm.reset();
      // Se ocultan las opciones de inicio de sesión y se muestra la opción de logout.
      const pageLogin = document.querySelectorAll("#page-login li");
      pageLogin[0].classList.add("d-none");
      pageLogin[1].classList.add("d-none");
      pageLogin[2].classList.remove("d-none");
      // Oculta la sección de bienvenida y muestra la sección principal
      const pageWelcome = document.getElementById("page-main-info");
      pageWelcome.classList.remove("d-block");
      pageWelcome.classList.add("d-none");
      const pageMain = document.getElementById("page-main");
      pageMain.classList.remove("d-none");
      pageMain.classList.add("d-block");
      const footer = document.getElementById("footer");
      footer.classList.remove("fixed-bottom");
      // Crea una variable "user" a partir de la dirección de correo electrónico del usuario creado para guradar el nombre de usuario.
      let user = userCredential.user.email
        .slice(0, userCredential.user.email.indexOf("@"))
        .replaceAll(".", " ");
      // Mostrar un mensaje de bienvenida en la página principal con el nombre del usuario.
      document.getElementById("page-main-welcome").innerHTML =
        "Bienvenido " + user;
      // Llamada a la funcion "getClasificacionEquipos".
      getClasificacionEquipos();
    })
    .catch((error) => {
      // Muestra un model con el mensaje de error si se produce algún error durante la creación del usuario.
      if (error.code === "auth/email-already-in-use") {
        lanzarModal("El correo ya está en uso");
      } else if (error.code === "auth/invalid-email") {
        lanzarModal("Correo inválido");
      } else if (error.code === "auth/weak-password") {
        lanzarModal("Contraseña débil");
      } else {
        console.log(error);
      }
    });
});
// INICIO DE SESIÓN CON CORREO Y CONTRASEÑA
// Selecciona el formulario de inicio de sesión en el HTML.
const signInForm = document.querySelector("#login-form");
// Agrega un event listener al formulario de inicio de sesión que se activa cuando se hace clic en "submit".
signInForm.addEventListener("submit", (e) => {
  // Previene que se envíe el formulario y se recargue la página.
  e.preventDefault();
  // Obtiene el valor del campo de correo electrónico y de contraseña del formulario.
  const email = signInForm["login-email"].value;
  const password = signInForm["login-password"].value;
  // Inicia sesión con el correo electrónico y la contraseña proporcionados usando el servicio de autenticación de Firebase y devuelve un objeto userCredential.
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Imprime el objeto userCredential en la consola
      // console.log(userCredential);
      // Cierra el modal de inicio de sesión
      const modal = bootstrap.Modal.getInstance(signInForm.closest(".modal"));
      modal.hide();
      // Restablece el formulario de inicio de sesión
      signInForm.reset();
      // Se ocultan las opciones de inicio de sesión y se muestra la opción de logout.
      const pageLogin = document.querySelectorAll("#page-login li");
      pageLogin[0].classList.add("d-none");
      pageLogin[1].classList.add("d-none");
      pageLogin[2].classList.remove("d-none");
      // Oculta la sección de bienvenida y muestra la sección principal
      const pageWelcome = document.getElementById("page-main-info");
      pageWelcome.classList.remove("d-block");
      pageWelcome.classList.add("d-none");
      const pageMain = document.getElementById("page-main");
      pageMain.classList.remove("d-none");
      pageMain.classList.add("d-block");
      const footer = document.getElementById("footer");
      footer.classList.remove("fixed-bottom");
      // Crea una variable "user" a partir de la dirección de correo electrónico del usuario creado para guradar el nombre de usuario.
      let user = userCredential.user.email
        .slice(0, userCredential.user.email.indexOf("@"))
        .replaceAll(".", " ");
      // Mostrar un mensaje de bienvenida en la página principal con el nombre del usuario.
      document.getElementById("page-main-welcome").innerHTML =
        "Bienvenido " + user + "<br>";
      // Llamada a la funcion "getClasificacionEquipos".
      getClasificacionEquipos();
    })
    .catch((error) => {
      // Si el error es debido a una contraseña incorrecta, lanza un modal con el mensaje "Contraseña incorrecta"
      if (error.code === "auth/wrong-password") {
        lanzarModal("Contraseña incorrecta");
      }
      // Si el error es debido a que el correo electrónico no está registrado, lanza un modal con el mensaje "Correo no encontrado"
      else if (error.code === "auth/user-not-found") {
        lanzarModal("Correo no encontrado");
      }
      // En cualquier otro caso, lanza un modal con el mensaje "Otro error!!!"
      else {
        console.log(error);
      }
    });
});
// LOGOUT
// Se selecciona el botón de logout
const logout = document.querySelector("#logout");
// Añade un evento de clic al botón de logout
logout.addEventListener("click", (e) => {
  // Llama a la función signOut() y devuelve una promesa
  signOut(auth)
    // Si la promesa se resuelve correctamente, ejecuta el siguiente código
    .then(() => {
      // Se muestran las opciones de inicio de sesión y se oculta la opción de logout.
      const pageLogin = document.querySelectorAll("#page-login li");
      pageLogin[0].classList.remove("d-none");
      pageLogin[1].classList.remove("d-none");
      pageLogin[2].classList.add("d-none");
      // Oculta la sección de datos y muestra la sección bienvenida
      const pageWelcome = document.getElementById("page-main-info");
      pageWelcome.classList.remove("d-none");
      pageWelcome.classList.add("d-block");
      const pageMain = document.getElementById("page-main");
      pageMain.classList.remove("d-block");
      pageMain.classList.add("d-none");
      const footer = document.getElementById("footer");
      footer.classList.add("fixed-bottom");
    })
    // Si la promesa se rechaza, ejecuta el siguiente código
    .catch((error) => {
      console.log(error);
    });
});
// IMPRIMIR LOS EQUPOS DESDE LA BASE DE DATOS
// La función getClasificacionEquipos se encarga de obtener los datos de clasificación de equipos desde la base de datos.
function getClasificacionEquipos() {
  // Obtiene una referencia a la clasificación de equipos en la base de datos.
  clasificacionEquipos = ref(db, "/Equipos/");
  // Si la referencia a la clasificación de equipos no es nula, se procede a añadir un escucha de eventos para detectar cuando se añaden nuevos datos.
  if (clasificacionEquipos != null) {
    onChildAdded(clasificacionEquipos, (data) => {
      // Se obtiene el valor de los datos que se han añadido.
      data = data.val();
      // Se obtiene una referencia a la tabla donde se van a añadir los datos.
      const table = document.querySelector("#myTable");
      // Se obtiene una referencia al cuerpo de la tabla donde se van a añadir los datos.
      const tableBody = table.querySelector("tbody");
      // Se construye una nueva fila con los datos que se han obtenido.
      const newRow = `<tr>
                        <td><b>${data.Posicion}</b></td>
                        <td>${data.Nombre_del_equipo}</td>
                        <td class="table-primary"><b>${data.Puntos}</b></td>
                        <td>${data.Partidos_jugados}</td>
                        <td>${data.Partidos_ganados}</td>
                        <td>${data.Partidos_empatados}</td>
                        <td>${data.Partidos_perdidos}</td>
                      </tr>`;
      // Se añade la nueva fila al cuerpo de la tabla.
      tableBody.innerHTML += newRow;
      // Llamada a la función "pintarCelda".
      pintarCelda();
    });
  }
}
// Función para pintar las celdas de la tabla
function pintarCelda() {
  // Obtener la tabla y su cuerpo
  const table = document.querySelector("#myTable");
  const tableBody = table.querySelector("tbody");
  // Obtener todas las filas de la tabla
  let filas = tableBody.getElementsByTagName("tr");
  filas = Array.from(filas);
  // Iterar por cada fila
  for (let i = 0; i < filas.length; i++) {
    let celdas;
    // Si es una de las primeras cuatro filas
    if (i <= 3) {
      // Obtener las primeras dos celdas de la fila y añadirles la clase "blue"
      celdas = filas[i].getElementsByTagName("td");
      celdas = Array.from(celdas).slice(0, 2);
      celdas[0].classList.add("blue");
      celdas[1].classList.add("blue");
    } else if (i === 4) {
      // Si es la quinta fila, obtener las primeras dos celdas y añadirles la clase "yellow"
      celdas = filas[i].getElementsByTagName("td");
      celdas = Array.from(celdas).slice(0, 2);
      celdas[0].classList.add("yellow");
      celdas[1].classList.add("yellow");
    } else if (i === 5) {
      // Si es la sexta fila, obtener las primeras dos celdas y añadirles la clase "green"
      celdas = filas[i].getElementsByTagName("td");
      celdas = Array.from(celdas).slice(0, 2);
      celdas[0].classList.add("green");
      celdas[1].classList.add("green");
    } else if (i >= filas.length - 3) {
      // Si es una de las últimas tres filas, obtener las primeras dos celdas y añadirles la clase "red"
      celdas = filas[i].getElementsByTagName("td");
      celdas = Array.from(celdas).slice(0, 2);
      celdas[0].classList.add("red");
      celdas[1].classList.add("red");
    } else {
      // Si no cumple con las condiciones anteriores, remover la clase "red" de las primeras dos celdas
      celdas = filas[i].getElementsByTagName("td");
      celdas = Array.from(celdas).slice(0, 2);
      celdas[0].classList.remove("red");
      celdas[1].classList.remove("red");
    }
  }
}
// MOSTRAR UN MODAL
// Esta función recibe un parámetro llamado "texto" que será el contenido que se mostrará en el cuerpo del modal.
function lanzarModal(texto) {
  // Crear el elemento del modal
  let modal = document.createElement("div");
  modal.classList.add("modal", "fade");
  // Crear el diálogo del modal
  let dialog = document.createElement("div");
  dialog.classList.add("modal-dialog");
  // Crear el contenido del diálogo del modal
  let content = document.createElement("div");
  content.classList.add("modal-content");
  content.classList.add("bg-danger");
  content.classList.add("text-light");
  // Crear el cuerpo del modal con el texto que se le pasó como parámetro
  let body = document.createElement("div");
  body.classList.add("modal-body");
  body.innerHTML = texto;
  // Agregar el encabezado y el cuerpo al contenido del modal
  content.appendChild(body);
  // Agregar el contenido al diálogo del modal
  dialog.appendChild(content);
  // Agregar el diálogo al modal
  modal.appendChild(dialog);
  // Mostrar el modal
  $(modal).modal("show");
}
