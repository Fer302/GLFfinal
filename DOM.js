class UserInput {
    constructor(initialState, finalStates, states, alphabet, transitions) {
        this.initialState = initialState;
        this.finalStates = finalStates;
        this.states = states;
        this.alphabet = alphabet;
        this.transitions = transitions;
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
    }
}

$(document).ready(function () {
   
});




function ConvertMap(map){
    var id, i, distance, j, X, Y;
    var states = [], transitions = [], alphabet = [];
    var initialState = "D" + map.Dependencia[0];
    var finalStates = [initialState];
    for(i = 0; i < map.PuntoVenta.length; i++){
        id = "P" + map.PuntoVenta[i][0];
        states.push(id);
    }
    for(i = 0; i < map.CentroDistribucion.length; i++){
        id = "C" + map.CentroDistribucion[i][0];
        states.push(id);
    }
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
    return new UserInput(initialState, finalStates, states, alphabet, transitions);
}

function GetMap(){
    var reader = new FileReader();
    //var out = document.getElementById("output");
    var ma;
    file = document.getElementById("input").files[0];
    reader.addEventListener('load', (event) => {
        ma = ConvertMap(new map(reader.result));
        alert("3");
    });
    reader.readAsText(file);
}

