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

        document
          .getElementById("page-login")
          .children[0].classList.add("d-none");
        document
          .getElementById("page-login")
          .children[1].classList.add("d-none");

        document.getElementById("page-main").classList.remove("d-none");
        document.getElementById("page-main").classList.add("d-block");
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
      console.log("a", userCredential);

      // Close the signup modal
      const signupModal = document.querySelector("#signupModal");
      const modal = bootstrap.Modal.getInstance(signupModal);
      modal.hide();

      // reset the form
      signUpForm.reset();

      // show welcome message
      alert("Welcome " + userCredential.user.email);

      document.getElementById("page-login").children[0].classList.add("d-none");
      document.getElementById("page-login").children[1].classList.add("d-none");

      document.getElementById("page-main").classList.remove("d-none");
      document.getElementById("page-main").classList.add("d-block");

      let user = userCredential.user.email
        .slice(0, userCredential.user.email.indexOf("@"))
        .replaceAll(".", " ");
      document.getElementById("page-main-welcome").innerHTML =
        "Bienvenido " + user;

      // const root_ref = ref(db, "users/" + user);
      // set(root_ref, {
      //   nombre: name,
      //   usuario: user,
      //   email: user_info.email,
      // });

      const clasificacionEquipos = ref(db, "/Equipos/");
      getClasificacionEquipos(clasificacionEquipos);
    })
    .catch((error) => {
      if (error.code === "auth/email-already-in-use") {
        alert("Email already in use", "error");
      } else if (error.code === "auth/invalid-email") {
        alert("Invalid email", "error");
      } else if (error.code === "auth/weak-password") {
        alert("Weak password", "error");
      } else if (error.code) {
        alert("Something went wrong", "error");
      }
    });
});

// Iniciar sesion con correo y contraseña
const signInForm = document.querySelector("#login-form");
signInForm.addEventListener("submit", (e) => {
  console.log("1");
  e.preventDefault();
  const email = signInForm["login-email"].value;
  const password = signInForm["login-password"].value;
  console.log(email, password);

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log(userCredential);

      // Close the login modal
      const modal = bootstrap.Modal.getInstance(signInForm.closest(".modal"));
      modal.hide();

      // reset the form
      signInForm.reset();

      // show welcome message
      alert("Welcome" + userCredential.user.email);
      document.getElementById("page-login").children[0].classList.add("d-none");
      document.getElementById("page-login").children[1].classList.add("d-none");

      document.getElementById("page-main").classList.remove("d-none");
      document.getElementById("page-main").classList.add("d-block");

      let user = userCredential.user.email
        .slice(0, userCredential.user.email.indexOf("@"))
        .replaceAll(".", " ");
      document.getElementById("page-main-welcome").innerHTML =
        "Bienvenido " + user;

      // const root_ref = ref(db, "users/" + user);
      // set(root_ref, {
      //   nombre: name,
      //   usuario: user,
      //   email: user_info.email,
      // });

      const clasificacionEquipos = ref(db, "/Equipos/");
      getClasificacionEquipos(clasificacionEquipos);
    })
    .catch((error) => {
      if (error.code === "auth/wrong-password") {
        alert("Wrong password", "error");
      } else if (error.code === "auth/user-not-found") {
        alert("User not found", "error");
      } else {
        alert("Something went wrong", "error");
      }
    });
});

// Logout
const logout = document.querySelector("#logout");
logout.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    await signOut(auth);
    document
      .getElementById("page-login")
      .children[0].classList.remove("d-none");
    document
      .getElementById("page-login")
      .children[1].classList.remove("d-none");

    document.getElementById("page-main").classList.remove("d-block");
    document.getElementById("page-main").classList.add("d-none");
  } catch (error) {
    console.log(error);
  }
});

// Imprimir la tabla desde la base de datos realtime
function getClasificacionEquipos(clasificacionEquipos) {
  if (clasificacionEquipos != null) {
    document.getElementById("contenido").innerHTML = "Equipos:<br>";
    onChildAdded(clasificacionEquipos, (data) => {
      console.log(data.val());
      // var tableHtml =
      //   '<table id="' +
      //   data.key +
      //   '" class=""><tr><th>#</th><th>Columna 1</th><th>Columna 2</th><th>Columna 3</th><th>Columna 4</th><th>Columna 5</th><th>Columna 6</th><th>Columna 7</th><th>Columna 8</th><th>Columna 9</th></tr>';
      // tableHtml +=
      //   "<tr><td>1</td><td>Dato 1</td><td>Dato 2</td><td>Dato 3</td><td>Dato 4</td><td>Dato 5</td><td>Dato 6</td><td>Dato 7</td><td>Dato 8</td><td>Dato 9</td></tr>";
      // document.getElementById("contenido").innerHTML += tableHtml;
    });
  }
}
