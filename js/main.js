import { User } from "./user.js";


class Main {

    constructor(){
    
        this.userService = new User('temporal','temporal','temporal');
        this.init();
    }
    
    init(){
        // Detecta la vista actual según la URL y ejecuta el método correspondiente
        const path = window.location.pathname;

        if (path.includes("login.html")) {
            this.initLogin();
        } else if (path.includes("recordar_contrasena.html")) {
            this.rememberPassword();
        } else if (path.includes("cambio_de_contrasena.html")) {
            this.changePassword();
        }
        // Agrega más condiciones si tienes otras vistas específicas
    }

    initLogin(){
        const loginButton = document.querySelector("#login-form");


        loginButton.addEventListener("submit",async(event) =>{
            event.preventDefault();

            const identification = document.querySelector("#identification").value;
            const password = document.querySelector("#password").value;

            const loginSucces = await this.userService.logIn(identification, password);

            if (loginSucces != false){
                this.userService.setIdentification(loginSucces.identification);
                this.userService.setEmail(loginSucces.email);
                this.userService.setPassword(loginSucces.password);
                alert("Inicio de sesión exitoso");
                window.location.href = "../html/home.html";
            } else{
                alert("Usuario o contraseña incorrectos");
            }
        })
    }

    rememberPassword(){
        const rememberPassword = document.querySelector("#remember-form");

        rememberPassword.addEventListener("submit", async(event) =>{
            event.preventDefault();

            const identification = document.querySelector("#identification").value;

            const user = await this.userService.getUserById(identification);

            if(user == null){
                alert("Lo siento el usuario no existe");
            } else{
                await this.userService.sendEmail(user);
                window.location.href = "../html/recordar_contrasena2.html";
            }
        })

        
    }

    changePassword(){
        const changePassword = document.querySelector("#changepass-form");

        changePassword.addEventListener("submit", async(event) =>{
            event.preventDefault();


            const identification = document.querySelector("#identification").value;
            const oldPassword = document.querySelector("#old-password").value;
            const password1 = document.querySelector("#password1").value;
            const password2 = document.querySelector("#password2").value;

            console.log(identification);
            console.log(oldPassword);

            const user = await this.userService.getUserById(identification);

            if (user.password != oldPassword){
                document.querySelector("#old-password").value = "";
                document.querySelector("#password1").value = "";
                document.querySelector("#password2").value = "";
                alert("La contraseña antigua no coincide, intenta de nuevo");
            } else if (password1 != password2){
                document.querySelector("#password1").value = "";
                document.querySelector("#password2").value = "";
                alert("Las contraseñas no coinciden");
            } else if(user == null){
                    alert("Lo siento el usuario no existe");

            } else{
                const response = await this.userService.changePassword(identification,password1);
                console.log(response);
                alert("Contraseña cambiada exitosamente");
                window.location.href = "../html/login.html";
            }
    });
};

}

document.addEventListener("DOMContentLoaded", () => {
    new Main();
});