const PoziviAjax = (()=>{

    function impl_getPredmet(naziv,fnCallback){
    }
    // vraća listu predmeta za loginovanog nastavnika ili grešku da nastavnik nije loginovan
    function impl_getPredmeti(fnCallback){
    }
    function impl_postLogin(username,password,fnCallback){
        
    }
    function impl_postLogout(fnCallback){
    }
    //prisustvo ima oblik {sedmica:N,predavanja:P,vjezbe:V}
    function impl_postPrisustvo(naziv,index,prisustvo,fnCallback){
    }
    return{
    postLogin: impl_postLogin,
    postLogout: impl_postLogout,
    getPredmet: impl_getPredmet,
    getPredmeti: impl_getPredmeti,
    postPrisustvo: impl_postPrisustvo,
    };
    })();
PoziviAjax
