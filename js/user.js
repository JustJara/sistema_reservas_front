export class User{

    constructor(identification,email, password){
        this.identification = identification;
        this.email = email
        this.password = password;
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
}