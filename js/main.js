import { SistemaReservas } from "./sistema_reservas.js";


class Main {

    constructor(){
        
        this.sistemaReservas = new SistemaReservas();
        
        this.sistemaReservas.addUser("1020222955","fvilla955@soyudemedellin.edu.co", "contrasena123");
        this.sistemaReservas.addUser("456","correo@gmail.com", "456");

        this.initLogin();
        this.rememberPassword();
        
    }

    initLogin(){
        const loginButton = document.querySelector(".form-submit-button");

        loginButton.addEventListener("click",(event) =>{
            event.preventDefault();

            const identification = document.querySelector("#identification").value;
            const password = document.querySelector("#password").value;

            const loginSucces = this.sistemaReservas.logIn(identification, password);

            if (loginSucces){
                alert("Inicio de sesión exitoso");
                window.location.href = "../html/home.html";
            } else{
                alert("Usuario o contraseña incorrectos");
            }
        })
    }

    rememberPassword(){
        const rememberPassword = document.querySelector("#remember-btn");

        rememberPassword.addEventListener("click", (event) =>{
            event.preventDefault();

            const identification = document.querySelector("#identification").value;

            const user = this.sistemaReservas.findUser(identification);

            if(user == null){
                alert("Lo siento el usuario no existe");
            } else{
                window.location.href = "../html/recordar_contrasena2.html";
                this.sistemaReservas.sendEmail(user);
                alert("Se ha enviado un correo notificandote tu contraseña");
            }
        })

        
    }


}

document.addEventListener("DOMContentLoaded", () => {
    new Main();
});