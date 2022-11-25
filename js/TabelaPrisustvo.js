let TabelaPrisustvo = function (divRef, podaci) {
    var prisustva = podaci.prisustva;

    var brojPrisustvaPrevelik = prisustva.some(element =>
        element.predavanja > podaci.brojPredavanjaSedmicno || element.vjezbe > podaci.brojVjezbiSedmicno
    );

    var brojPrisustvaNegativan = prisustva.some(element => element.predavanja < 0 || element.vjezbe < 0);

    var visePrisustvaZaIstuSedmicu = prisustva.some((element, index, array) => array.findIndex((element2) => 
    element2.index == element.index && element2 == element.sedmica) != index);

    if(visePrisustvaZaIstuSedmicu)
        divRef.innerHTML = "NEISPRAVNO";
};