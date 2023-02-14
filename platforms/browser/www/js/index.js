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
let clasificacion = null;
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
        console.log(user_info);
        user = user_info.email
          .slice(0, user_info.email.indexOf("@"))
          .replaceAll(".", "");
        console.log(user);
        let name = user_info.displayName;

        document.getElementById("page-login").classList.add("d-none");

        document.getElementById("page-main").classList.remove("d-none");
        document.getElementById("page-main").classList.add("d-inline");
        document.getElementById("page-main-welcome").innerHTML +=
          "Bienvenido " + name + "<br>";
        let root_ref = ref(db, "users/" + user);
        set(root_ref, {
          nombre: name,
          usuario: user,
          email: user_info.email,
        });
        clasificacion = ref(db, "Equipos/" + user);
        getClasificacion(clasificacion);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  // para imprimir
  // document.getElementById("button-add").addEventListener("click", function () {
  //   let titulo = document.getElementById("title").value;
  //   let nota = document.getElementById("note").value;
  //   if (titulo != "" && nota != "") {
  //     let root_ref = ref(db, "notas/" + user + "/" + titulo);
  //     set(root_ref, {
  //       titulo: titulo,
  //       nota: nota,
  //     });
  //   }
  //   document.getElementById("title").value = "";
  //   document.getElementById("note").value = "";
  //   getClasificacion(clasificacion);
  // });
}
// para coger notas de la base de datos
function getClasificacion(clasificacion) {
  if (clasificacion != null) {
    document.getElementById("contenido").innerHTML = "Notas: <br>";
    onChildAdded(clasificacion, (data) => {
      console.log(data.key);
      console.log(data.val());
      document.getElementById("contenido").innerHTML +=
        '<div id="' +
        data.key +
        '" class="note"> <a>puntos: </a> ' +
        data.val().Puntos +
        "<br><a>posicion: </a> " +
        data.val().Posicion +
        "<br><br></div>";
    });
  }
}
// registrarse con correo y contraseña
const signUpForm = document.querySelector("#signup-form");
signUpForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = signUpForm["signup-email"].value;
  const password = signUpForm["signup-password"].value;

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log(userCredential);

    // Close the signup modal
    const signupModal = document.querySelector("#signupModal");
    const modal = bootstrap.Modal.getInstance(signupModal);
    modal.hide();

    // reset the form
    signUpForm.reset();

    // show welcome message
    alert("Welcome" + userCredentials.user.email);
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      alert("Email already in use", "error");
    } else if (error.code === "auth/invalid-email") {
      alert("Invalid email", "error");
    } else if (error.code === "auth/weak-password") {
      alert("Weak password", "error");
    } else if (error.code) {
      alert("Something went wrong", "error");
    }
  }
});
// iniciar sesion con correo y contraseña
const signInForm = document.querySelector("#login-form");
signInForm.addEventListener("submit", async (e) => {
  console.log("1");
  e.preventDefault();
  const email = signInForm["login-email"].value;
  const password = signInForm["login-password"].value;
  console.log(email, password);

  try {
    console.log("2");
    const userCredentials = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log(userCredentials);

    // Close the login modal
    const modal = bootstrap.Modal.getInstance(signInForm.closest(".modal"));
    modal.hide();

    // reset the form
    signInForm.reset();

    // show welcome message
    alert("Welcome" + userCredentials.user.email);
  } catch (error) {
    if (error.code === "auth/wrong-password") {
      alert("Wrong password", "error");
    } else if (error.code === "auth/user-not-found") {
      alert("User not found", "error");
    } else {
      alert("Something went wrong", "error");
    }
  }
});
// LOgout
const logout = document.querySelector("#logout");
logout.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    await signOut(auth);
    document.getElementById("page-login").classList.remove("d-none");
    document.getElementById("page-main").classList.remove("d-inline");
    document.getElementById("page-main").classList.add("d-none");
  } catch (error) {
    console.log(error);
  }
});
