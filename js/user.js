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
            method: 'PATCH',
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
}