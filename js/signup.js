import {register} from './api.js'

class Signup{
    username_input = document.getElementById('username_text');
    password_input = document.getElementById('password_text');
    email_input = document.getElementById('email_text');
    error_msg_span = document.getElementById('error_text');
    signup_form = document.getElementById('signup_form');

    username = "";
    email = "";
    password = "";

    addEL = () => {
        this.username_input.addEventListener('input' , this.username_comp);
        this.password_input.addEventListener('input' , this.password_comp);
        this.email_input.addEventListener('input' , this.email_comp);
        this.signup_form.addEventListener('submit' , this.signin);
    }

    //EL functions
    username_comp = e => {
        //console.log(e.target.value);
        this.clear_error_msg();
        this.username = e.target.value;
    } 

    password_comp = e => {
        //console.log(e.target.value);
        this.clear_error_msg();
        this.password = e.target.value;
    }

    email_comp = e => {
        this.clear_error_msg();
        this.email = e.target.value;
    }

    signin = async (e) => {
        e.preventDefault();
        //check for errors
        const usernameRegx = /\w{1,}/
        const emailRegx = /^([a-z\d\.-]+)@([a-z\d]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/
        const passwordRegx = /[a-zA-Z0-9%!@#$^&*;:?\/'\"<,>\.(){}\[\]]{8,}/

        if(!usernameRegx.exec(this.username) && this.password === "" && this.email === ""){
            this.error_msg_generator("Please fill details");
        }
        else if(!emailRegx.exec(this.email)){
            this.error_msg_generator("Please fill valid email");
        }
        else if(!usernameRegx.exec(this.username)){
            this.error_msg_generator("Please enter username");
        }else if(!passwordRegx.exec(this.password)){
            this.error_msg_generator("Password must be 8 chars long");
        }else{
            try{
                let response = await register(this.username, this.email, this.password)
                if(response.status === 200){
                    window.location.href = "./../html/signin.html";
                }
                else if(response.status === 409){
                    this.error_msg_generator("username or email already in use");
                }
            }catch(e){

            }
        }
    }


    //Utility functions
    error_msg_generator(msg){
        this.error_msg_span.style.display = 'block';
        this.error_msg_span.textContent = msg;
    }

    clear_error_msg(){
        this.error_msg_span.style.display = 'none';
    }

}

let s = new Signup();
s.addEL();