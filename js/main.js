import { User } from "./user.js";
import { Reserva } from "./reserva.js";


class Main {

    constructor() {
        this.userService = this.getUser();
        this.reservationService = new Reserva();
        this.spaceId = null;
        this.isLoggedIn();
        this.isLoggedOut();
        this.init();
    }

    init() {
        // Detecta la vista actual según la URL y ejecuta el método correspondiente
        const path = window.location.pathname;

        if (path.includes("login.html")) {
            this.initLogin();
        } else if (path.includes("recordar_contrasena.html")) {
            this.rememberPassword();
        } else if (path.includes("cambio_de_contrasena.html")) {
            this.changePassword();
        } else if (path.includes("pagina_reservas1.html")) {
            this.makeReservation();
        } else if (path.includes("mis_reservas.html")) {
            this.getMyReservations();
        }
        // Agrega más condiciones si tienes otras vistas específicas
    }

    getUser() {
        const user = localStorage.getItem("user");
        if (user != null) {
            return this.factory(JSON.parse(user));
        }
        return new User('temporal', 'temporal', 'temporal');
    }

    factory(user) {
        return new User(user.identification, user.email, user.password);
    }

    isLoggedIn() {
        const loggedIn = this.userService.getEmail() !== 'temporal'
        const path = window.location.pathname;
        if (loggedIn && path.includes("login.html")) {
            window.location.href = "../html/home.html";
        }
    }

    isLoggedOut() {
        const loggedOut = this.userService.getEmail() === 'temporal';
        const path = window.location.pathname;

        // Definir las rutas a las que pueden acceder usuarios no logueados
        const allowedPathsForLoggedOut = [
            '/html/login.html',
            '/html/cambio_de_contrasena.html',  // Por ejemplo, si tienes una página de registro
            '/html/recordar_contrasena.html',
            '/html/recordar_contrasena2.html'
        ]

        // Verificar si la ruta actual es una de las permitidas
        const isAllowedPath = allowedPathsForLoggedOut.some(allowedPath => path.includes(allowedPath));

        // Si está deslogueado y no está en una de las rutas permitidas, redirigir a login
        if (loggedOut && !isAllowedPath) {
            window.location.href = "../html/login.html";
        }
    }


    logout() {
        localStorage.removeItem("user");
        window.location.href = "../html/login.html";
    }

    initLogin() {
        const loginButton = document.querySelector("#login-form");


        loginButton.addEventListener("submit", async (event) => {
            event.preventDefault();

            const identification = document.querySelector("#identification").value;
            const password = document.querySelector("#password").value;

            const loginSucces = await this.userService.logIn(identification, password);

            if (loginSucces != false) {
                localStorage.setItem("user", JSON.stringify(loginSucces));
                alert("Inicio de sesión exitoso");
                window.location.href = "../html/home.html";
            } else {
                alert("Usuario o contraseña incorrectos");
            }
        })
    }

    rememberPassword() {
        const rememberPassword = document.querySelector("#remember-form");

        rememberPassword.addEventListener("submit", async (event) => {
            event.preventDefault();

            const identification = document.querySelector("#identification").value;

            const user = await this.userService.getUserById(identification);

            if (user == null) {
                alert("Lo siento el usuario no existe");
            } else {
                await this.userService.sendEmail(user);
                window.location.href = "../html/recordar_contrasena2.html";
            }
        })


    }

    changePassword() {
        const changePassword = document.querySelector("#changepass-form");

        changePassword.addEventListener("submit", async (event) => {
            event.preventDefault();


            const identification = document.querySelector("#identification").value;
            const oldPassword = document.querySelector("#old-password").value;
            const password1 = document.querySelector("#password1").value;
            const password2 = document.querySelector("#password2").value;

            console.log(identification);
            console.log(oldPassword);

            const user = await this.userService.getUserById(identification);

            if (user.password != oldPassword) {
                document.querySelector("#old-password").value = "";
                document.querySelector("#password1").value = "";
                document.querySelector("#password2").value = "";
                alert("La contraseña antigua no coincide, intenta de nuevo");
            } else if (password1 != password2) {
                document.querySelector("#password1").value = "";
                document.querySelector("#password2").value = "";
                alert("Las contraseñas no coinciden");
            } else if (user == null) {
                alert("Lo siento el usuario no existe");

            } else {
                const response = await this.userService.changePassword(identification, password1);
                console.log(response);
                alert("Contraseña cambiada exitosamente");
                window.location.href = "../html/login.html";
            }
        });

    };


    async makeReservation() {
        const $spaces = document.querySelectorAll('.space')
        $spaces.forEach(space => {
            space.addEventListener('click', async () => {
                const spaceId = space.getAttribute('data-id')
                const $reservationForm = document.querySelector(`#${spaceId}ReservationForm`);
                this.spaceId = spaceId
                const $dialog = document.querySelector(`#${spaceId}Modal`)
                const $cancel = document.querySelector(`#${spaceId}Modalcancel`)
                this.agregarEvento($reservationForm)
                $dialog.showModal()
                $cancel.addEventListener('click', () => $dialog.close())

                this.generateScheduleTable(spaceId)
                const date = new Date().toLocaleDateString('en-CA');
                console.log("🚀 ~ Main ~ space.addEventListener ~ date:", date)
            })
        })

    };

    agregarEvento(element) {
        element.addEventListener('submit', async (event) => {
            event.preventDefault();
            const timeInput = document.querySelector('input[name="time"]:checked');
            const time = timeInput.value;

            const { startTime, endTime } = this.convertToTimeRange(time);

            const payload = {
                identification: this.userService.getIdentification(),
                fechaReserva: new Date().toLocaleDateString('en-CA'),
                startTime,
                endTime,
                spaceId: this.spaceId
            };


            const response = await this.reservationService.makeReservation(payload);
            if (response.affectedRows > 0) {
                alert("Reserva exitosa");
                window.location.reload();
            }
        })
    }


    generateScheduleTable(spaceId) {
        const reservations = [
            { espacio_reserva: "gym", fecha_de_reserva: "2024-10-29", hora_fin_reserva: "08:00:00", hora_inicio_reserva: "06:00:00", id_reserva: 12, id_usuario: "1020222955" },
            { espacio_reserva: "gym", fecha_de_reserva: "2024-10-29", hora_fin_reserva: "08:00:00", hora_inicio_reserva: "06:00:00", id_reserva: 13, id_usuario: "1020222956" },
            { espacio_reserva: "gym", fecha_de_reserva: "2024-11-01", hora_fin_reserva: "12:00:00", hora_inicio_reserva: "10:00:00", id_reserva: 14, id_usuario: "1020222957" },
            { espacio_reserva: "coliseo", fecha_de_reserva: "2024-11-02", hora_fin_reserva: "14:00:00", hora_inicio_reserva: "12:00:00", id_reserva: 15, id_usuario: "1020222958" },
            { espacio_reserva: "gym", fecha_de_reserva: "2024-11-03", hora_fin_reserva: "16:00:00", hora_inicio_reserva: "14:00:00", id_reserva: 16, id_usuario: "1020222959" },
            { espacio_reserva: "pool", fecha_de_reserva: "2024-11-04", hora_fin_reserva: "18:00:00", hora_inicio_reserva: "16:00:00", id_reserva: 17, id_usuario: "1020222960" },
            { espacio_reserva: "cancha", fecha_de_reserva: "2024-11-05", hora_fin_reserva: "20:00:00", hora_inicio_reserva: "18:00:00", id_reserva: 18, id_usuario: "1020222961" }
        ];

        switch (spaceId) {
            case 'gym':
                const gymReservations = reservations.filter(reservation => reservation.espacio_reserva === 'gym');
                const MAX_CAPACITY_PER_HOUR = 2;
                const hourBlocks = {
                    "06:00:00": 0,
                    "08:00:00": 0,
                    "10:00:00": 0,
                    "12:00:00": 0,
                    "14:00:00": 0,
                    "16:00:00": 0,
                    "18:00:00": 0
                }

                const hours = [
                    "06:00 - 08:00", "08:00  - 10:00", "10:00 - 12:00",
                    "12:00 - 14:00", "14:00  - 16:00", "16:00 - 18:00", "18:00 - 20:00"
                ]

                gymReservations.forEach(reservation => {
                    hourBlocks[reservation.hora_inicio_reserva] += 1;
                })

                const modalTableContainer = document.querySelector(`#${spaceId}Modal`);

                // const calendar = document.createElement('input')
                // calendar.type = 'date'
                // calendar.min = new Date().toLocaleDateString('en-CA')
                // calendar.max= new Date(new Date().toLocaleDateString('en-CA') + 86400000)
                // modalTableContainer.appendChild(calendar)

                // calendar.addEventListener('change',(e)=>{
                //     console.log(e.target.value)
                // })

                const calendar = document.createElement('input');
                calendar.type = 'date';

                // Obtén fecha actual
                const fechaActual = new Date();
                
                console.log("🚀 ~ Main ~ generateScheduleTable ~ fechaActual:", fechaActual)
                const diaActual = fechaActual.getDay(); // 0 = domingo, 1 = lunes, ..., 6 = sábado
                console.log("🚀 ~ Main ~ generateScheduleTable ~ diaActual:", diaActual)

                // Calcula fecha del día siguiente
                const diaSiguiente = new Date(fechaActual.getTime() + 86400000);

                // Asigna fecha mínima y máxima
                // calendar.min = fechaActual.toLocaleDateString('en-CA');
                // calendar.max = diaSiguiente.toLocaleDateString('en-CA');

                // Agrega evento de cambio
                calendar.addEventListener('change', (event) => {
                const fechaSeleccionada = new Date(event.target.value);
                const diaSeleccionado = fechaSeleccionada.getDay();
                console.log("🚀 ~ Main ~ calendar.addEventListener ~ diaSeleccionado:", diaSeleccionado)

                // Restringe sábados y domingos
                if (diaSeleccionado === 3 || diaSeleccionado === 4) {
                    alert('No se puede seleccionar fines de semana');
                    event.target.value = ''; // Limpia selección
                }

                // Viernes permite seleccionar lunes
                if (diaActual === 2 && diaSeleccionado === 5) {
                    console.log("MELO")
                    return;
                }

                // Solo permite seleccionar día actual o siguiente
                // if (
                //     fechaSeleccionada.getTime() !== fechaActual.getTime() &&
                //     fechaSeleccionada.getTime() !== diaSiguiente.getTime()
                // ) {
                //     alert('Solo se puede seleccionar hoy o mañana');
                //     event.target.value = ''; // Limpia selección
                // }
                });

                modalTableContainer.prepend(calendar);

                /************************************* */

                const tableBody = modalTableContainer.querySelector("tbody");
                tableBody.innerHTML = "";

                hours.forEach((hourBlock, rowIndex) => {
                    const row = document.createElement("tr");
                    const hourCell = document.createElement("td");
                    hourCell.textContent = hourBlock;
                    row.appendChild(hourCell);

                    for (let i = 0; i < 1; i++) {
                        const statusCell = document.createElement("td")
                        const status = hourBlocks[`${hourBlock.slice(0, 5)}:00`] < MAX_CAPACITY_PER_HOUR ? 'Disponible' : 'Ocupado';
                        statusCell.classList.add(status)

                        if (status === 'Disponible') {
                            statusCell.innerHTML = `<input name="time" type="radio" class="${status}" value="${hourBlock}" >`;

                        }else{
                            statusCell.innerText = 'No disponible'
                        }
                        row.appendChild(statusCell);
                    }
                    tableBody.appendChild(row);
                })
            case 'pool':
            //codigo
            case 'cancha':
            //codigo
            case 'coliseo':
            //codigo
        }

        // const modalTableContainer = document.querySelector(`#${spaceId}Modal`);

        // const tableBody = modalTableContainer.querySelector("tbody");
        // tableBody.innerHTML = "";

        // hours.forEach((hourBlock, rowIndex) => {
        //     const row = document.createElement("tr");
        //     const hourCell = document.createElement("td");
        //     hourCell.textContent = hourBlock;
        //     row.appendChild(hourCell);

        //     for (let i = 0; i < 1; i++) {
        //         const statusCell = document.createElement("td")
        //         const status = "Disponible";
        //         statusCell.classList.add(status)

        //         if (status === 'Disponible') {
        //             statusCell.innerHTML = `<input name="time" type="radio" class="${status}" value="${hourBlock}" >`;

        //         }
        //         row.appendChild(statusCell);
        //     }
        //     tableBody.appendChild(row);
        // })

    }

    convertToTimeRange(timeRange) {
        // Separar el rango en dos partes
        let [startTime, endTime] = timeRange.split(" - ");

        // Función para convertir el formato "6:00 am" a un objeto Date con la hora correspondiente
        function parseTime(timeStr) {
            let [time, period] = timeStr.split(" ");
            let [hours, minutes] = time.split(":").map(Number);

            // Ajustar la hora para AM/PM
            if (period.toLowerCase() === "pm" && hours !== 12) {
                hours += 12;
            } else if (period.toLowerCase() === "am" && hours === 12) {
                hours = 0; // Medianoche es 00:00
            }

            // Devolver una cadena en formato 'HH:MM'
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        }

        // Convertir ambos tiempos a formato 'HH:MM'
        let startTimeFormatted = parseTime(startTime);
        let endTimeFormatted = parseTime(endTime);

        return { startTime: startTimeFormatted, endTime: endTimeFormatted };
    }

    async getReservationsForSpaceByDate(date, spaceId) {
        const response = await this.reservationService.getReservationsForSpaceByDate(date, spaceId);
        console.log("🚀 ~ Main ~ getReservationsForSpaceByDate ~ response:", response)

        return response
    }

    async getMyReservations() {
        const identification = this.userService.getIdentification();
        const currentDate = new Date().toLocaleDateString('en-CA')
        const reservations = await this.reservationService.getReservationsById(identification, currentDate);
        console.log("🚀 ~ Main ~ getMyReservations ~ reservations:", reservations)
        this.showReservations(reservations)

    }

    showReservations(reservations) {

        if (reservations.length > 0) {

            const $noReservations = document.querySelector("#noReservas");
            $noReservations.style.display = "none";  // Ocultar mensaje de "No hay reservas"
            const $divReservations = document.querySelector("#reservations");
            $divReservations.style.display = "grid";  // Mostrar contenedor de reservas

            const $reservations = document.querySelector('#reservations');

            // Recorrer cada reserva y crear un botón para cada una
            reservations.forEach(reservation => {
                let space = '';

                // Switch para determinar el espacio de la reserva
                switch (reservation.espacio_reserva) {
                    case 'gym':
                        space = 'en el Gimnasio';
                        break;
                    case 'pool':
                        space = 'en la Piscina';
                        break;
                    case 'cancha':
                        space = 'en la Cancha';
                        break;
                    case 'coliseo':
                        space = 'en el Coliseo';
                        break;
                }

                // Crear el botón
                const reservationInfoDiv = document.createElement('div');
                reservationInfoDiv.classList.add('card');
                // Añadir el contenido del botón
                const date = new Date(reservation.fecha_de_reserva);
                const formattedDate = date.toISOString().slice(0, 10)
                reservationInfoDiv.innerHTML = `<div  class="card c1">
                <div class="card-content">
                    <p>Tiene una reserva ${space} para la fecha: ${formattedDate} de ${reservation.hora_inicio_reserva} hasta las ${reservation.hora_fin_reserva}</p>
                </div>
                <div class="info__description">
                    <button id="${reservation.id_reserva}">Cancelar Reserva</button>
                </div>`;

                // Añadir el botón al contenedor
                $reservations.appendChild(reservationInfoDiv);

                const cancelButton = reservationInfoDiv.querySelector('button');
                cancelButton.addEventListener('click', () => this.deleteReservation(reservation.id_reserva));
            });
        }

    }

    async deleteReservation(id_reserva) {
        console.log("🚀 ~ Main ~ deleteReservation ~ id_reserva:", id_reserva)
        const identification = this.userService.getIdentification();
        const response = await this.reservationService.deleteReservationById(id_reserva, identification);
        if (response.affectedRows > 0) {
            window.location.reload();
        }

        console.log("🚀 ~ Main ~ deleteReservation ~ response:", response)

    }


}

document.addEventListener("DOMContentLoaded", () => {
    new Main();
});

