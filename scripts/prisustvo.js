let div = document.getElementById("divSadrzaj");
let x = {
    studenti: [{
    ime: "Neko Nekic",
    index: 12345
    },
    {
    ime: "Drugi Neko",
    index: 12346
    }
    ],
    prisustva: [{
    sedmica: 1,
    predavanja: 2,
    vjezbe: 1,
    index: 12345
    },
    {
    sedmica: 1,
    predavanja: 2,
    vjezbe: 2,
    index: 12346
    },
    {
    sedmica: 2,
    predavanja: 2,
    vjezbe: 0,
    index: 12345
    },
    {
    sedmica: 2,
    predavanja: 2,
    vjezbe: 0,
    index: 12346
    }
    ],
    predmet: "Razvoj mobilnih aplikacija",
    brojPredavanjaSedmicno: 2,
    brojVjezbiSedmicno: 2
    }
    
let prisustvo = TabelaPrisustvo(div, x);
let lijevo = document.createElement("i");
lijevo.className = "fa-solid fa-arrow-left";
let desno = document.createElement("i");
desno.className = "fa-solid fa-arrow-right";
let lb = document.createElement("button");
let rb = document.createElement("button");

lb.onclick = prisustvo.prethodnaSedmica;
rb.onclick = prisustvo.sljedecaSedmica;

lb.appendChild(lijevo);
rb.appendChild(desno);
lb.style.marginTop = "5px";
rb.style.marginTop = "5px";
rb.style.marginLeft = "5px";
document.body.appendChild(lb);
document.body.appendChild(rb);