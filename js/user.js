export class User{
    constructor(identification,email, password){
        this.identification = identification;
        this.email = email
        this.password = password;
        this.apiurl = 'https://sistemareservasback-production.up.railway.app/api'

    }

    getIdentification(){
        return this.identification;
    }

    getPassword(){
        return this.password;
    }

    setIdentification(identification){
        this.identification = identification;
    }

    setPassword(password){
        this.password = password;
    }

    getEmail(){
        return this.email;
    }

    setEmail(email){
        this.email = email;
    }

    async logIn(identification, password){

        const user = await this.getUserById(identification);

        if(user.password == password){
            return user;
        } else{
            return false;
        }

    }

    async getUserById(identification){

        const response = await fetch(`${this.apiurl}/users/${identification}`);
        let user = await response.json();
        user = user[0];

        return user;

    }

    async changePassword(identification,password1){
        const response = await fetch(`${this.apiurl}/users/password/${identification}`,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                password: password1
            })
        });

        const data = await response.json();
        console.log('CONSOLE LOG DESDE USERS.JS',data);
    }

    async sendEmail(user) {
    const email = user.email
    const password = user.password

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

    await fetch("https://api.emailjs.com/api/v1.0/email/send", {
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