function odjava(){
    PoziviAjax.postLogout((err,data) => {
        if(err){
            console.log(err);
        }
    });
}
function loadaj(){
    PoziviAjax.getPredmeti((err, data) => {
        if(err){
        }
        else{
        let div = document.getElementById("meni");
        let listaPredmeta = document.createElement("ul");

        data.forEach(element => {
            let elementListe = document.createElement("li");
            let link = document.createElement("a");
            link.href="#";
            link.textContent = element;
            elementListe.appendChild(link);
            listaPredmeta.appendChild(elementListe);
        });

        div.appendChild(listaPredmeta);
        }
    });
}
const meni = document.getElementById("meni");
const tabelaPrisustvo = document.getElementById("prisustvo");
meni.addEventListener("click", (Event) => {
    if (Event.target.tagName === "A") {
        const naziv = Event.target.innerText;
        PoziviAjax.getPredmet(naziv,function(err, data){
            if(err){
                console.log(err);
            }
            else{
                let prisustvo = TabelaPrisustvo(tabelaPrisustvo, data);
            }
        });
        
    }
});

tabelaPrisustvo.addEventListener("click", (Event) => {
    let klasa = Event.target.className;
    if(klasa == "prisutan" || klasa == "odsutan" || klasa == "prazno"){
        let tip = Event.target.dataset.tip;
        let red = Event.target.closest('tr');
        let index = parseInt(red.dataset.index);
        let naziv = red.dataset.naziv;
        let sedmica = parseInt(red.dataset.sedmica);
        let predavanja = parseInt(red.dataset.predavanja);
        let vjezbe = parseInt(red.dataset.vjezbe);
        if(klasa == "odsutan" || klasa == "prazno"){
            if(tip == "p")
                predavanja++;
            else
                vjezbe++;
        }
        else{
            if(tip == "p")
                predavanja--;
            else
                vjezbe--;
        }

        PoziviAjax.postPrisustvo(naziv,index, {sedmica: sedmica, predavanja: predavanja, vjezbe: vjezbe}, function(err ,data){
            if(err)
                console.log(err);
            else{
                let prisustvo = TabelaPrisustvo(tabelaPrisustvo,data);
            }
        });

    }
});
