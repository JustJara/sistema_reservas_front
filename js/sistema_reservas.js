import { User } from "./user.js";

export class SistemaReservas {
  constructor() {
    this.reservas = [];
    this.users = [];
  }
  addReserva(reserva) {
    this.reservas.push(reserva);
  }
  getReservas() {
    return this.reservas;
  }

  addUser(identification, email, password) {
    const user = new User(identification, email, password);
    this.users.push(user);
  }

  logIn(identification, password) {
    for (let i = 0; i < this.users.length; i++) {
      if (
        this.users[i].identification == identification &&
        this.users[i].password == password
      ) {
        return true;
      }
    }

    return false;
  }

  findUser(identification) {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].identification == identification) {
        return this.users[i];
      }
    }
    return null;
  }

  sendEmail(user) {
    const email = user.getEmail();
    const password = user.getPassword();

    const serviceID = "service_a9l5gt6";
    const templateID = "template_05y5kvh";

    const data = {
      service_id: serviceID,
      template_id: templateID,
      user_id: "3BGGyuucb7tfX7vpj",
      template_params: {
        email,
        password,
        "g-recaptcha-response": "03AHJ_ASjnLA214KSNKFJAK12sfKASfehbmfd...",
      },
    };

    fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        comsole.log("Your mail is sent!");
      })
      .catch((error) => {
        console.log("Oops... " + error);
      });
  }
}
