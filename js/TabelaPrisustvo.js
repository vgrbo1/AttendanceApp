let TabelaPrisustvo = function (divRef, podaci) {
    var prisustva = podaci.prisustva;

    var brojPrisustvaPrevelik = prisustva.some(element =>
        element.predavanja > podaci.brojPredavanjaSedmicno || element.vjezbe > podaci.brojVjezbiSedmicno
    );

    var brojPrisustvaNegativan = prisustva.some(element => element.predavanja < 0 || element.vjezbe < 0);

    var visePrisustvaZaIstuSedmicu = prisustva.some((element, index, array) => array.findIndex((element2) =>
        element2.index == element.index && element2.sedmica == element.sedmica) != index);

    var indeksi = podaci.studenti.map((element) => element.index);
    var istiIndeksi = indeksi.some((element, index, array) => array.indexOf(element) != index);

    var indeksiPrisustva = prisustva.map((element) => element.index);
    var prisustvoNepostojecegStudenta = indeksiPrisustva.some((element) => indeksi.indexOf(element) == -1);

    var sedmice = prisustva.map(element => element.sedmica);
    sedmice = sedmice.filter((element, index, array) => {
        return array.indexOf(element) == index
    })
    sedmice.sort((a, b) => a - b);

    var nevalidneSedmice = false;
    for (let i = 1; i < sedmice.length; i++) {
        if (sedmice[i] != sedmice[i - 1] + 1) {
            nevalidneSedmice = true;
            break;
        }
    }

    var maxSedmica = sedmice[sedmice.length-1];
    var trenutnaSedmica = maxSedmica;
    var sedmiceRimski = ["I", "II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII","XIV","XV"];
    divRef.innerHTML = "<h1>" + podaci.predmet + "<br>" + maxSedmica + "</h1>";
    if(brojPrisustvaPrevelik || brojPrisustvaNegativan || istiIndeksi || prisustvoNepostojecegStudenta || nevalidneSedmice || visePrisustvaZaIstuSedmicu)
        divRef.innerHTML += "Podaci o prisustvu nisu validni!";
    else{
        var tabela = document.createElement("table");
        var red = document.createElement("tr");
        var thImePrezime = document.createElement("th");
        var br = document.createElement("br");
        thImePrezime.appendChild(document.createTextNode("Ime i"));
        thImePrezime.appendChild(br);
        thImePrezime.appendChild(document.createTextNode("prezime"));
        var thIndex = document.createElement("th");
        thIndex.appendChild(document.createTextNode("Index"));
        red.appendChild(thImePrezime);
        red.appendChild(thIndex);

        for(let i = 0; i < maxSedmica; i++){
            let th = document.createElement("th");
            th.appendChild(document.createTextNode(sedmiceRimski[i]));
            if( i == maxSedmica - 1){
                th.colSpan = 5;
            }
            red.appendChild(th);
            if(maxSedmica == 14 && i == 13){
                th = document.createElement("th");
                th.appendChild(document.createTextNode(sedmiceRimski[14]));
                red.appendChild(th);
            }
        }

        if(maxSedmica < 14){
            let th = document.createElement("th");
            th.appendChild(document.createTextNode(sedmiceRimski[maxSedmica] + "-" + sedmiceRimski[14]));
            th.colSpan = 15 - maxSedmica + 1;
            red.appendChild(th);
        }
        tabela.appendChild(red);
    
        divRef.appendChild(tabela);
    }
};