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

    var sedmiceIzvanOpsega = sedmice.some(element => element < 1 || element > 15);
    var nevalidneSedmice = false;
    for (let i = 1; i < sedmice.length; i++) {
        if (sedmice[i] != sedmice[i - 1] + 1) {
            nevalidneSedmice = true;
            break;
        }
    }

    var maxSedmica = sedmice[sedmice.length - 1];
    var trenutnaSedmica = maxSedmica;
    var sedmiceRimski = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV"];
    
    let crtaj = function (trenutnaSedmica) {
        divRef.innerHTML = "";
        divRef.innerHTML = "<h1>" + podaci.predmet + "</h1>";
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

        for (let i = 0; i < maxSedmica; i++) {
            let th = document.createElement("th");
            th.appendChild(document.createTextNode(sedmiceRimski[i]));
            if (i == trenutnaSedmica - 1) {
                th.colSpan = podaci.brojPredavanjaSedmicno + podaci.brojVjezbiSedmicno;
            }
            red.appendChild(th);
            if (maxSedmica == 14 && i == 13) {
                th = document.createElement("th");
                th.appendChild(document.createTextNode(sedmiceRimski[14]));
                red.appendChild(th);
            }
        }

        if (maxSedmica < 14) {
            let th = document.createElement("th");
            th.appendChild(document.createTextNode(sedmiceRimski[maxSedmica] + "-" + sedmiceRimski[14]));
            th.colSpan = 15 - maxSedmica;
            red.appendChild(th);
        }
        tabela.appendChild(red);
        for (let i = 0; i < podaci.studenti.length; i++) {
            red = document.createElement("tr");
            td = document.createElement("td");
            td.rowSpan = 2;
            td.appendChild(document.createTextNode(podaci.studenti[i].ime));
            red.appendChild(td);
            td = document.createElement("td");
            td.rowSpan = 2;
            td.appendChild(document.createTextNode(podaci.studenti[i].index));
            red.appendChild(td);

            for (let j = 1; j <= maxSedmica; j++) {
                var prisustvo = prisustva.find(element => element.sedmica == j && element.index == podaci.studenti[i].index);
                if (j != trenutnaSedmica) {
                    td = document.createElement("td");
                    td.rowSpan = 2;
                    if (typeof prisustvo !== "undefined") {
                        var postotak = Math.round(100 * (prisustvo.predavanja + prisustvo.vjezbe) / (podaci.brojPredavanjaSedmicno + podaci.brojVjezbiSedmicno));
                        td.appendChild(document.createTextNode(postotak + "%"))
                    }

                    red.appendChild(td);
                }
                else {
                    for (let i = 0; i < podaci.brojPredavanjaSedmicno; i++) {
                        td = document.createElement("td");
                        td.appendChild(document.createTextNode("P"));
                        td.appendChild(document.createElement("br"));
                        td.appendChild(document.createTextNode((i + 1)));
                        red.appendChild(td);
                    }

                    for (let i = 0; i < podaci.brojVjezbiSedmicno; i++) {
                        td = document.createElement("td");
                        td.appendChild(document.createTextNode("V"));
                        td.appendChild(document.createElement("br"));
                        td.appendChild(document.createTextNode((i + 1)));
                        red.appendChild(td);
                    }
                }
            }
            td = document.createElement("td");
            td.rowSpan = 2;
            td.colSpan = 15 - maxSedmica;
            if(maxSedmica < 15)
                red.appendChild(td);


            tabela.appendChild(red);

            red = document.createElement("tr");
            var trenutnoPrisustvo = prisustva.find(element => element.sedmica == trenutnaSedmica && element.index == podaci.studenti[i].index);

            for (let i = 0; i < podaci.brojPredavanjaSedmicno; i++) {
                td = document.createElement("td");
                td.appendChild(document.createTextNode(" "));
                td.appendChild(document.createElement("br"));
                td.appendChild(document.createTextNode(" "));
                if (typeof trenutnoPrisustvo !== "undefined") {
                    if (i < trenutnoPrisustvo.predavanja)
                        td.className = "prisutan"
                    else
                        td.className = "odsutan";
                }
                red.appendChild(td);
            }

            for (let i = 0; i < podaci.brojVjezbiSedmicno; i++) {
                td = document.createElement("td");
                td.appendChild(document.createTextNode(" "));
                td.appendChild(document.createElement("br"));
                td.appendChild(document.createTextNode(" "));
                if (typeof trenutnoPrisustvo !== "undefined") {
                    if (i < trenutnoPrisustvo.vjezbe)
                        td.className = "prisutan"
                    else
                        td.className = "odsutan";
                }
                red.appendChild(td);
            }
            tabela.appendChild(red);
        }

        red = document.createElement("tr");
        for (let i = 0; i < 17 + podaci.brojPredavanjaSedmicno + podaci.brojVjezbiSedmicno - 1; i++) {
            td = document.createElement("td");
            td.style.display = "none";
            red.appendChild(td);
        }
        tabela.appendChild(red);
        divRef.appendChild(tabela);
    }
    var nevalidni = sedmiceIzvanOpsega || brojPrisustvaPrevelik || brojPrisustvaNegativan || istiIndeksi || prisustvoNepostojecegStudenta || nevalidneSedmice || visePrisustvaZaIstuSedmicu;

    if (nevalidni)
        divRef.innerHTML = "Podaci o prisustvu nisu validni!";
    else {
        crtaj(trenutnaSedmica);
    }
    let prethodnaSedmica = function () {
        if(!nevalidni && trenutnaSedmica > 1){
            trenutnaSedmica--;
            crtaj(trenutnaSedmica);
        }
    }
    let sljedecaSedmica = function () {
        if(!nevalidni && trenutnaSedmica < maxSedmica){
            trenutnaSedmica++;
            crtaj(trenutnaSedmica);
        }
    }
    return {
        sljedecaSedmica: sljedecaSedmica,
        prethodnaSedmica: prethodnaSedmica
    }
        
};