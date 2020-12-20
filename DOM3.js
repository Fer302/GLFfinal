
$(document).ready(function () {

    

    function findValueInArray(value,arr){
        var result = false;
        for(var i=0; i<arr.length; i++){
          var name = arr[i];
          if(name == value){
            result = true;
          }
        }
        return result;
      }

    $("#btnER").click(function () {
        let usrinput = fetchUserInput3();
        let i, j, k, name, con, start, loops = [], ToSplice = [];
        start = usrinput.initialState3;
        usrinput.initialState3 = "START";
        usrinput.states3.push("START");
        usrinput.transitions3.push(new Transition("START", start, "λ"));
        usrinput.states3.push("END");
        for(i = 0; i < usrinput.finalStates3.length; i++){
            start = usrinput.finalStates3[i];
            usrinput.transitions3.push(new Transition(start, "END", "λ"));
        }
        usrinput.finalStates3.splice(0, usrinput.finalStates3.length);
        usrinput.finalStates3.push("END");
        for(i = 0; i < usrinput.states3.length; i++){
            name = usrinput.states3[i];
            if(usrinput.initialState3 != name && usrinput.finalStates3[0] != name){
                for(j = 0; j < usrinput.transitions3.length; j++){
                    con = "";
                    if(usrinput.transitions3[j].nextStates == name && usrinput.transitions3[j].state != name){
                        if(usrinput.transitions3[j].symbol != "λ"){
                            con += usrinput.transitions3[j].symbol;
                        }
                        start = usrinput.transitions3[j].state;
                        loops.splice(0, loops.length);
                        for(k = 0; k < usrinput.transitions3.length; k++){
                            if(usrinput.transitions3[k].nextStates == name && usrinput.transitions3[k].state == name){
                                    loops.push(usrinput.transitions3[k].symbol);
                                if(!findValueInArray(k, ToSplice))
                                    ToSplice.push(k);
                            }
                        }
                        for(k = 0; k < loops.length; k++){
                            if(k == 0)
                                con += "(";
                            else
                                con += "+";
                            con += loops[k];
                            if(k == loops.length - 1)
                                con += ")*";
                        }
                        for(k = 0; k < usrinput.transitions3.length; k++){
                            if(usrinput.transitions3[k].nextStates != name && usrinput.transitions3[k].state == name){
                                if(usrinput.transitions3[k].symbol != "λ"){
                                    usrinput.transitions3.push(new Transition(start, usrinput.transitions3[k].nextStates, con + usrinput.transitions3[k].symbol));
                                }
                                else{
                                    usrinput.transitions3.push(new Transition(start, usrinput.transitions3[k].nextStates, con));
                                }
                                if(!findValueInArray(k, ToSplice))
                                    ToSplice.push(k);
                            }
                        }
                        if(!findValueInArray(j, ToSplice))
                            ToSplice.push(j);
                    }
                }
                for(k = 0; k < ToSplice.length; k++){
                    usrinput.transitions3.splice(ToSplice[k], 1);
                    for(j = k+1; j < ToSplice.length; j++){
                        if(ToSplice[j] > ToSplice[k]){
                            ToSplice[j]--;
                        }
                    }
                }
                ToSplice.splice(0, ToSplice.length);
            }
        }
        con = "";
        for(i = 0; i < usrinput.transitions3.length; i++){
            if(con != "")
                con += "+";
            con += usrinput.transitions3[i].symbol;
        }
        $("#ER").html(con);
    });
});