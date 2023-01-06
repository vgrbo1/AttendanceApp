function prijava(){
    username = document.getElementById('username').value;
    password = document.getElementById('password').value;
    
    PoziviAjax.postLogin(username,password," ");

    
}