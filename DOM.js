class UserInput {
    constructor(initialState, finalStates, states, alphabet, transitions) {
        this.initialState = initialState;
        this.finalStates = finalStates;
        this.states = states;
        this.alphabet = alphabet;
        this.transitions = transitions;
    }
}
var ptsC=[];
var ptsV=[];
var puntosFinales=[];
var C=0;

class Transition {
    constructor(state, nextStates, symbol) {
        if (!(typeof state === 'string' || state instanceof String))
            throw new Error("Expected a single state (string)");

        if (!Array.isArray(nextStates)) {
            let arr = [];
            arr.push(nextStates.toString());
            nextStates = arr;
        }

        if (!(typeof symbol === 'string' || symbol instanceof String))
            throw new Error("Expected a string symbol");

        this.state = state;
        this.nextStates = nextStates;
        this.symbol = symbol;
    }
}

class map {
    constructor(string){
        this.PuntoVenta = [];
        this.CentroDistribucion = [];
        var segment = string.split("\n");
        var i;
        var char = [], arr = [];
        for(i = 0; i < segment.length; i++){
            char = segment[i].split(";");
            arr.push(char[1]);
            arr.push(char[2].split(","));
            if(char[0] == "D"){
                this.Dependencia = arr;
            }
            else if(char[0] == "P"){
                this.PuntoVenta.push(arr);
            }
            else{
                this.CentroDistribucion.push(arr);
            }
            arr = [];
        }
        console.log(this.PuntoVenta);
        console.log(this.CentroDistribucion);
    }

}

$(document).ready(function () {
    $("#cbox").click(function () {
        var arrDef;
        console.log("ola");
        var selected = [];
        $('div#cboxc input[type=checkbox]').each(function () {
            if ($(this).is(":checked")) {
                selected.push($(this).attr('id'));
            }
        });

        console.log(selected);
        console.log(ptsV);
        if(C>0){
        for(let xyz of ptsV){
            if(typeof(xyz[1][0])!=='string'&& typeof(xyz[1][1])!=='string'){
            xyz[1][0]=xyz[1][0]-350;
            console.log(xyz[1][1]);
            xyz[1][1]=xyz[1][1]+350;
            }
            
        }
        for(let xyz of ptsC){
            if(typeof(xyz[1][0])!=='string'&& typeof(xyz[1][1])!=='string'){
            xyz[1][0]=xyz[1][0]-350;
            console.log(xyz[1][1]);
            xyz[1][1]=xyz[1][1]+350;
            }
            
        }
        
            
    }
        puntosFinales=[];
        arrDef=ptsV.slice();
        var arAux=[];
        for(let xAux of selected){
            var strAux=xAux;
            strAux=strAux.substring(1);
            for(let yAux=0; yAux<ptsV.length;yAux++){
                if(strAux==ptsV[yAux][0]){
                        arAux=[];
                        arAux.push(ptsV[yAux][1]);
                        arAux[0][0]=350+parseInt(arAux[0][0]);
                        arAux[0][1]=350-parseInt(arAux[0][1]);
                        puntosFinales.push(arAux[0]);
                    
                }
            }
        }
        arAux=[];
        var conceptName = $("#selectorBox option:selected")[0].value;
        conceptName=conceptName.substring(1);
        for(let xAux of ptsC){
            if(conceptName == xAux[0]){
                arAux=[];
                arAux.push(xAux[1]);
                arAux[0][0]=350+parseInt(arAux[0][0]);
                arAux[0][1]=350-parseInt(arAux[0][1]);
                puntosFinales.unshift(arAux[0]);
            }
        }
        for(let asf of puntosFinales){
            if(asf[1]<0){
                asf[1]=asf[1]*-1;
            }    
        }
        
        console.log(puntosFinales);
        C++;
    });
});




function ConvertMap(map){
    var id, i, distance, j, X, Y;
    var states = [], transitions = [], alphabet = [];
    var initialState = "D" + map.Dependencia[0];
    var finalStates = [initialState];
    var form = document.getElementById("places");
    var selectC = document.createElement("select");
    selectC.setAttribute("id","selectorBox");
    var selectP = document.createElement("div");
    var auxOpt, auxDiv, auxNum, auxLabel;
    for(i = 0; i < map.PuntoVenta.length; i++){
        id = "P" + map.PuntoVenta[i][0];
        states.push(id);
        auxDiv = document.createElement('div');
        auxOpt = document.createElement('input');
        auxOpt.type = "checkbox";
        auxOpt.value = id;
        auxOpt.id= id;
        auxNum = document.createElement('input');
        auxNum.type = "number";
        auxDiv.appendChild(auxOpt);
        auxDiv.appendChild( document.createTextNode(id) );
        auxDiv.appendChild(auxNum);
        selectP.appendChild(auxDiv);
        ptsV.push(map.PuntoVenta[i]);
    }
    for(i = 0; i < map.CentroDistribucion.length; i++){
        id = "C" + map.CentroDistribucion[i][0];
        states.push(id);
        auxOpt = document.createElement('option');
        auxOpt.appendChild( document.createTextNode(id) );
        auxOpt.value = id;
        auxOpt.id= id;
        selectC.appendChild(auxOpt);
        ptsC.push(map.CentroDistribucion[i]);
    }
    auxDiv = document.createElement('h3');
    auxDiv.appendChild(document.createTextNode('Seleccional centro de distribucion'));
    form.appendChild(auxDiv);
    form.appendChild(selectC);
    auxDiv = document.createElement('h3');
    auxDiv.appendChild(document.createTextNode('Seleccional puntos de venta'));
    form.appendChild(auxDiv);
    form.appendChild(selectP);
    /*  
    for(i = 0; i < map.PuntoVenta.length; i++){
        X = map.PuntoVenta[i][1][0] - map.Dependencia[1][0];
        Y = map.PuntoVenta[i][1][1] - map.Dependencia[1][1];
        distance = Math.sqrt(Math.pow(X, 2) + Math.pow(Y, 2));
        distance = distance.toFixed(5);
        transitions.push(new Transition("D" + map.Dependencia[0], "P" + map.PuntoVenta[i][0], distance));
        transitions.push(new Transition("P" + map.PuntoVenta[i][0], "D" + map.Dependencia[0], distance));
        alphabet.push(distance);
        for(j = 0; j < map.PuntoVenta.length; j++){
            X = map.PuntoVenta[i][1][0] - map.PuntoVenta[j][1][0];
            Y = map.PuntoVenta[i][1][1] - map.PuntoVenta[j][1][1];
            distance = Math.sqrt(Math.pow(X, 2) + Math.pow(Y, 2));
            distance = distance.toFixed(5);
            transitions.push(new Transition("P" + map.PuntoVenta[j][0], "P" + map.PuntoVenta[i][0], distance));
            transitions.push(new Transition("P" + map.PuntoVenta[i][0], "P" + map.PuntoVenta[j][0], distance));
            alphabet.push(distance);
        }
        for(j = 0; j < map.CentroDistribucion.length; j++){
            X = map.PuntoVenta[i][1][0] - map.CentroDistribucion[j][1][0];
            Y = map.PuntoVenta[i][1][1] - map.CentroDistribucion[j][1][1];
            distance = Math.sqrt(Math.pow(X, 2) + Math.pow(Y, 2));
            distance = distance.toFixed(5);
            transitions.push(new Transition("C" + map.CentroDistribucion[j][0], "P" + map.PuntoVenta[i][0], distance));
            transitions.push(new Transition("P" + map.PuntoVenta[i][0], "C" + map.CentroDistribucion[j][0], distance));
            alphabet.push(distance);
        }
    }
    for(i = 0; i < map.CentroDistribucion.length; i++){
        X = map.CentroDistribucion[i][1][0] - map.Dependencia[1][0];
        Y = map.CentroDistribucion[i][1][1] - map.Dependencia[1][1];
        distance = Math.sqrt(Math.pow(X, 2) + Math.pow(Y, 2));
        distance = distance.toFixed(5);
        transitions.push(new Transition("D" + map.Dependencia[0], "C" + map.CentroDistribucion[i][0], distance));
        transitions.push(new Transition("C" + map.CentroDistribucion[i][0], "D" + map.Dependencia[0], distance));
        alphabet.push(distance);
        for(j = 0; j < map.PuntoVenta.length; j++){
            X = map.CentroDistribucion[i][1][0] - map.PuntoVenta[j][1][0];
            Y = map.CentroDistribucion[i][1][1] - map.PuntoVenta[j][1][1];
            distance = Math.sqrt(Math.pow(X, 2) + Math.pow(Y, 2));
            distance = distance.toFixed(5);
            transitions.push(new Transition("P" + map.PuntoVenta[j][0], "C" + map.CentroDistribucion[i][0], distance));
            transitions.push(new Transition("C" + map.CentroDistribucion[i][0], "P" + map.PuntoVenta[j][0], distance));
            alphabet.push(distance);
        }
        for(j = 0; j < map.CentroDistribucion.length; j++){
            X = map.CentroDistribucion[i][1][0] - map.CentroDistribucion[j][1][0];
            Y = map.CentroDistribucion[i][1][1] - map.CentroDistribucion[j][1][1];
            distance = Math.sqrt(Math.pow(X, 2) + Math.pow(Y, 2));
            distance = distance.toFixed(5);
            transitions.push(new Transition("C" + map.CentroDistribucion[j][0], "C" + map.CentroDistribucion[i][0], distance));
            transitions.push(new Transition("C" + map.CentroDistribucion[i][0], "C" + map.CentroDistribucion[j][0], distance));
            alphabet.push(distance);
        }
    }
    console.log(states);
    console.log(transitions);
    return new UserInput(initialState, finalStates, states, alphabet, transitions);
    */
}

function GetMap(){
    var reader = new FileReader();
    var ma;
    var nMap2;
    var see = document.getElementById("input");
    file = see.files[0];
    reader.addEventListener('load', (event) => {
        ma = ConvertMap(new map(reader.result));
        see.style.display = "none";
        alert("Creado con exito!");
    });

    reader.readAsText(file);
}




