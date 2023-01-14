function prijava(){
    username = document.getElementById('username').value;
    password = document.getElementById('password').value;
    
    PoziviAjax.postLogin(username,password, (err, data) => {
        if(err){
            let poruka = document.getElementById('poruka');  
            poruka.innerHTML = err
        }

    });

    
}