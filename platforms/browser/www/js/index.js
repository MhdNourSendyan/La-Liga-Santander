import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getAuth,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
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
let user = null;
let clasificacionEquipos = null;
document.addEventListener("deviceready", onDeviceReady, false);
// con google
function onDeviceReady() {
  getRed();
  document.querySelector("#googleLogin").addEventListener("click", function () {
    const provider = new GoogleAuthProvider(auth);
    signInWithRedirect(auth, provider).then(() => {
      getRed();
    });
  });
  function getRed() {
    getRedirectResult(auth)
      .then((result) => {
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;
        const user_info = result.user;
        console.log("User info: ", user_info);
        user = user_info.email
          .slice(0, user_info.email.indexOf("@"))
          .replaceAll(".", " ");
        let name = user_info.displayName;

        const pageLogin = document.querySelectorAll("#page-login li");
        pageLogin[0].classList.add("d-none");
        pageLogin[1].classList.add("d-none");
        pageLogin[2].classList.remove("d-none");

        const pageWelcome = document.getElementById("page-main-info");
        pageWelcome.classList.remove("d-block");
        pageWelcome.classList.add("d-none");

        const pageMain = document.getElementById("page-main");
        pageMain.classList.remove("d-none");
        pageMain.classList.add("d-block");

        const footer = document.getElementById("footer");
        footer.classList.remove("fixed-bottom");

        document.getElementById("page-main-welcome").innerHTML =
          "Bienvenido " + name + "<br>";
        let root_ref = ref(db, "users/" + user);
        set(root_ref, {
          nombre: name,
          usuario: user,
          email: user_info.email,
        });
        clasificacionEquipos = ref(db, "/Equipos/");
        getClasificacionEquipos(clasificacionEquipos);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

// Registrarse con correo y contraseña
const signUpForm = document.querySelector("#signup-form");
signUpForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = signUpForm["signup-email"].value;
  const password = signUpForm["signup-password"].value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log(userCredential);

      // Close the signup modal
      const signupModal = document.querySelector("#signupModal");
      const modal = bootstrap.Modal.getInstance(signupModal);
      modal.hide();

      // reset the form
      signUpForm.reset();

      const pageLogin = document.querySelectorAll("#page-login li");
      pageLogin[0].classList.add("d-none");
      pageLogin[1].classList.add("d-none");
      pageLogin[2].classList.remove("d-none");
      const pageWelcome = document.getElementById("page-main-info");
      pageWelcome.classList.remove("d-block");
      pageWelcome.classList.add("d-none");
      const pageMain = document.getElementById("page-main");
      pageMain.classList.remove("d-none");
      pageMain.classList.add("d-block");
      const footer = document.getElementById("footer");
      footer.classList.remove("fixed-bottom");
      let user = userCredential.user.email
        .slice(0, userCredential.user.email.indexOf("@"))
        .replaceAll(".", " ");
      document.getElementById("page-main-welcome").innerHTML =
        "Bienvenido " + user + "<br>";

      const clasificacionEquipos = ref(db, "/Equipos/");
      getClasificacionEquipos(clasificacionEquipos);
    })
    .catch((error) => {
      if (error.code === "auth/email-already-in-use") {
        lanzarModal("El correo ya está en uso");
      } else if (error.code === "auth/invalid-email") {
        lanzarModal("Correo inválido");
      } else if (error.code === "auth/weak-password") {
        lanzarModal("Contraseña débil");
      } else if (error.code) {
        lanzarModal("Otro error!!!");
      }
    });
});

// Iniciar sesion con correo y contraseña
const signInForm = document.querySelector("#login-form");
signInForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = signInForm["login-email"].value;
  const password = signInForm["login-password"].value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log(userCredential);
      // Close the login modal
      const modal = bootstrap.Modal.getInstance(signInForm.closest(".modal"));
      modal.hide();
      // reset the form
      signInForm.reset();

      const pageLogin = document.querySelectorAll("#page-login li");
      pageLogin[0].classList.add("d-none");
      pageLogin[1].classList.add("d-none");
      pageLogin[2].classList.remove("d-none");
      const pageWelcome = document.getElementById("page-main-info");
      pageWelcome.classList.remove("d-block");
      pageWelcome.classList.add("d-none");
      const pageMain = document.getElementById("page-main");
      pageMain.classList.remove("d-none");
      pageMain.classList.add("d-block");
      const footer = document.getElementById("footer");
      footer.classList.remove("fixed-bottom");
      let user = userCredential.user.email
        .slice(0, userCredential.user.email.indexOf("@"))
        .replaceAll(".", " ");
      document.getElementById("page-main-welcome").innerHTML =
        "Bienvenido " + user + "<br>";

      const clasificacionEquipos = ref(db, "/Equipos/");
      getClasificacionEquipos(clasificacionEquipos);
    })
    .catch((error) => {
      if (error.code === "auth/wrong-password") {
        lanzarModal("Contraseña incorrecta");
      } else if (error.code === "auth/user-not-found") {
        lanzarModal("Correo no encontrado");
      } else {
        lanzarModal("Otro error!!!");
      }
    });
});

// Logout
const logout = document.querySelector("#logout");
logout.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    await signOut(auth);
    const pageLogin = document.querySelectorAll("#page-login li");
    pageLogin[0].classList.remove("d-none");
    pageLogin[1].classList.remove("d-none");
    pageLogin[2].classList.add("d-none");
    const pageWelcome = document.getElementById("page-main-info");
    pageWelcome.classList.remove("d-none");
    pageWelcome.classList.add("d-block");
    const pageMain = document.getElementById("page-main");
    pageMain.classList.remove("d-block");
    pageMain.classList.add("d-none");
    const footer = document.getElementById("footer");
    footer.classList.add("fixed-bottom");
  } catch (error) {
    console.log(error);
  }
});

// Imprimir la tabla desde la base de datos realtime
function getClasificacionEquipos(clasificacionEquipos) {
  if (clasificacionEquipos != null) {
    onChildAdded(clasificacionEquipos, (data) => {
      data = data.val();
      const table = document.querySelector("#myTable");
      const tableBody = table.querySelector("tbody");
      const newRow = `<tr>
                        <td><b>${data.Posicion}</b></td>
                        <td>${data.Nombre_del_equipo}</td>
                        <td class="table-primary"><b>${data.Puntos}</b></td>
                        <td>${data.Partidos_jugados}</td>
                        <td>${data.Partidos_ganados}</td>
                        <td>${data.Partidos_empatados}</td>
                        <td>${data.Partidos_perdidos}</td>
                      </tr>`;
      tableBody.innerHTML += newRow;
      pintarCelda();
    });
  }
}

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

function pintarCelda() {
  const table = document.querySelector("#myTable");
  const tableBody = table.querySelector("tbody");

  // Obtener todas las filas de la tabla
  let filas = tableBody.getElementsByTagName("tr");
  filas = Array.from(filas);

  // Iterar por cada fila
  for (let i = 0; i < filas.length; i++) {
    let celdas;
    if (i <= 3) {
      // Obtener las primeras cuatro celdas de la fila
      celdas = filas[i].getElementsByTagName("td");
      celdas = Array.from(celdas).slice(0, 2);
      celdas[0].classList.add("blue");
      celdas[1].classList.add("blue");
    } else if (i === 4) {
      // Obtener la primera celda de la fila 5
      celdas = filas[i].getElementsByTagName("td");
      celdas = Array.from(celdas).slice(0, 2);
      celdas[0].classList.add("yellow");
      celdas[1].classList.add("yellow");
    } else if (i === 5) {
      // Obtener la primera celda de la fila 6
      celdas = filas[i].getElementsByTagName("td");
      celdas = Array.from(celdas).slice(0, 2);
      celdas[0].classList.add("green");
      celdas[1].classList.add("green");
    } else if (i >= filas.length - 3) {
      // Obtener la primera celda de las últimas tres filas
      celdas = filas[i].getElementsByTagName("td");
      celdas = Array.from(celdas).slice(0, 2);
      celdas[0].classList.add("red");
      celdas[1].classList.add("red");
    } else {
      // Remover la clase "bg-danger" de las demás celdas
      celdas = filas[i].getElementsByTagName("td");
      celdas = Array.from(celdas).slice(0, 2);
      celdas[0].classList.remove("red");
      celdas[1].classList.remove("red");
    }
  }
}
