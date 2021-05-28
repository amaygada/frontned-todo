import {signin} from './api.js'

class Signin{
    username_input = document.getElementById('username_text');
    password_input = document.getElementById('password_text');
    error_msg_span = document.getElementById('error_text');
    signin_form = document.getElementById('signin_form');

    username = "";
    password = "";

    addEL = () => {
        this.username_input.addEventListener('input' , this.username_comp);
        this.password_input.addEventListener('input' , this.password_comp);
        this.signin_form.addEventListener('submit' , this.signin);
    }

    //EL functions
    username_comp = (e) => {
        //console.log(e.target.value);
        this.clear_error_msg();
        this.username = e.target.value;
    } 

    password_comp = (e) => {
        //console.log(e.target.value);
        this.clear_error_msg();
        this.password = e.target.value;
    }

    signin = async(e) => {
        e.preventDefault();
        //check for errors
        const usernameRegx = /\w{1,}/
        const emailRegx = /^([a-z\d\.-]+)@([a-z\d]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/
        const passwordRegx = /[a-zA-Z0-9%!@#$^&*;:?\/'\"<,>\.(){}\[\]]{8,}/

        if(!usernameRegx.exec(this.username) && this.password === ""){
            this.error_msg_generator("Please fill details");
        }
        else if(!usernameRegx.exec(this.username)){
            this.error_msg_generator("Please enter username");
        }else if(!this.password === ""){
            this.error_msg_generator("Please enter password");
        }else if(!passwordRegx.exec(this.password)){
            this.error_msg_generator("Password must be 8 chars long");
        }else{
            try{
                let response = await signin(this.username, this.password)
                
                if(response.status === 200){
                    let text = await response.text()
                    console.log(JSON.parse(text)["access"])
                    // localStorage.clear()
                    localStorage.setItem("access", JSON.parse(text)["access"]);
                    localStorage.setItem("refresh", JSON.parse(text)["refresh"]);
                    //console.log(localStorage)
                    window.location.href = "./../html/todo.html";
                }
                else if(response.status === 401){
                    this.error_msg_generator("password or username is incorrect");
                }

            }catch(e){
                this.error_msg_generator("network error");
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
let s = new Signin();
s.addEL();