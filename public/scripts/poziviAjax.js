const PoziviAjax = (()=>{

    function impl_getPredmet(naziv,fnCallback){
        let ajax = new XMLHttpRequest();
        ajax.open("GET", "http://localhost:3000/predmet/"+naziv, true);
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200){
                fnCallback(null, JSON.parse(ajax.response));
            }
        };
        ajax.send();
    }
    // vraća listu predmeta za loginovanog nastavnika ili grešku da nastavnik nije loginovan
    function impl_getPredmeti(fnCallback){
        let ajax = new XMLHttpRequest();
        ajax.open("GET", "http://localhost:3000/predmeti", true);
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200){
                let div = document.getElementById("meni");
                let predmeti = JSON.parse(ajax.response);
                let listaPredmeta = document.createElement("ul");
        
                predmeti.forEach(element => {
                    let elementListe = document.createElement("li");
                    let link = document.createElement("a");
                    link.href="#";
                    link.textContent = element;
                    elementListe.appendChild(link);
                    listaPredmeta.appendChild(elementListe);
                });
                div.appendChild(listaPredmeta);
            }
        };
        ajax.send();
    }
    function impl_postLogin(username,password,fnCallback){
        let ajax = new XMLHttpRequest();
        ajax.open("POST", "http://localhost:3000/login", true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200){
                let odgovor = JSON.parse(ajax.response);
                if(odgovor.poruka == "Uspješna prijava"){
                    fnCallback(null, odgovor.poruka);
                    window.location = "/predmeti.html";
                }
                else{
                    fnCallback(odgovor.poruka, null);
                }
            }
        };
        ajax.send(JSON.stringify({username: username, password: password}));
    }

    function impl_postLogout(fnCallback){
        let ajax = new XMLHttpRequest();
        ajax.open("POST", "http://localhost:3000/logout", true);
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200){  
                if(JSON.parse(ajax.response).poruka == "Uspješna odjava"){
                    window.location = "/prijava.html";
                }
                else{
                    fnCallback(JSON.parse(ajax.response));
                }

            }
        };
        ajax.send();
    }
    //prisustvo ima oblik {sedmica:N,predavanja:P,vjezbe:V}
    function impl_postPrisustvo(naziv,index,prisustvo,fnCallback){
        let ajax = new XMLHttpRequest();
        ajax.open("POST", "http://localhost:3000/prisustvo/predmet/" + naziv + "/student/" + index, true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200){
                fnCallback(null,JSON.parse(ajax.response));
            }
        };
        ajax.send(JSON.stringify(prisustvo));
    }
    return{
    postLogin: impl_postLogin,
    postLogout: impl_postLogout,
    getPredmet: impl_getPredmet,
    getPredmeti: impl_getPredmeti,
    postPrisustvo: impl_postPrisustvo,
    };
    })();