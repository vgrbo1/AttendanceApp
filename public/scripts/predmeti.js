function odjava(){
    PoziviAjax.postLogout(" ");
}
function loadaj(){
    PoziviAjax.getPredmeti("");
}
const meni = document.getElementById("meni");
const div = document.getElementById("prisustvo");
meni.addEventListener("click", (event) => {
    if (event.target.tagName === "A") {
        const naziv = event.target.innerText;
        PoziviAjax.getPredmet(naziv,function(err, data){
            if(err){
                console.log(err);
            }
            else{
                let prisustvo = TabelaPrisustvo(div, data);
            }
        });
        
    }
});