    class UserInput2 {
    constructor(initialState2, finalStates2, states2, alphabet2, transitions2) {
        this.initialState2 = initialState2;
        this.finalStates2 = finalStates2;
        this.states2 = states2;
        this.alphabet2 = alphabet2;
        this.transitions2 = transitions2;
    }
}
function fetchUserInput2() {

    let initialState2 = $("#initialStateInput2").val().trim();
    let finalStates2 = $("#finalStatesInput2").val().trim();
    let states2 = [];
    let alphabet2 = [];
    let transitions2 = [];

    if (initialState2.includes('{') || finalStates2.includes('{')) {
        alert('State names cannot contain the \"{\" character!');
        return null;
    }

    $(".production-row2").each(function () {

        let currentState2 = $(this).find(".current-state-input2").val().trim();
        let inputSymbol2 = $(this).find(".input-symbol2").val().trim();

        if (inputSymbol2 === '')
            inputSymbol2 = '\u03BB'; //lambda character

        let nextState2 = $(this).find(".next-states2").val().trim();

        // TODO Better state validation?
        if (currentState2.includes('{') || nextState2.includes('{')) {
            alert('State names cannot contain the \"{\" character!');
            return;
        }

        transitions2.push(new Transition(currentState2, nextState2, inputSymbol2));

        // Populate alphabet without lambda
        if (inputSymbol2 !== '\u03BB' && !alphabet2.includes(inputSymbol2))
            alphabet2.push(inputSymbol2);

        if (!states2.includes(currentState2))
            states2.push(currentState2);

        if (!states2.includes(nextState2))
            states2.push(nextState2);

    });

    if (finalStates2.includes(","))
        finalStates2 = finalStates2.split(",");

    return new UserInput2(initialState2, finalStates2, states2, alphabet2, transitions2);
}
$(document).ready(function () {

    $("#new-transition2").click(function () {

        let transitionsDiv2 = $("#nfa-transitions2");
        let clone = $("#nfa-transitions2 .production-row2").last().clone(true);

        clone.appendTo(transitionsDiv2);

        $(".remove-button").show();

    });

    let removeButton = $(".remove-button");

    // Hide all remove buttons initially
    removeButton.hide();
    // Register onClick() event for remove buttons
    removeButton.click(function () {

        let parent = $(this).parent();
        let grandparent = parent.parent();

        parent.fadeOut(function () {
            $(this).remove();
        });

        if (grandparent.children().length <= 2) {
            $(".remove-button").hide();
        }

    });
    $(".production-row2 input").on('keypress', function (e) {
        if (e.which === 13) {
            $("#new-transition2").click();
        }
    });

    $(".production-row2 input").on('keyup', function (e) {
        if (e.which !== 13) {
            $("#verify-update-debug2").click();
        }
    });

    $("#initialStateInput2").on('keyup', function (e) {
        $("#verify-update-debug2").click();
    });

    $("#finalStatesInput2").on('keyup', function (e) {
        $("#verify-update-debug2").click();
    });

    $("#exampleBtn2").click(function () {

        $("#initialStateInput2").val('q3');
        $("#finalStatesInput2").val('q5');

        let transitionsDiv2 = $("#nfa-transitions2");
        let clone = $("#nfa-transitions2 .production-row2").first().clone(true);

        transitionsDiv2.children().each(function () {
            $(this).remove();
        });

        

        clone.find(".current-state-input2").val('q3');
        clone.find(".input-symbol2").val('a');
        clone.find(".next-states2").val('q4');
        transitionsDiv2.append(clone);

        clone = clone.clone(true);
        clone.find(".current-state-input2").val('q3');
        clone.find(".input-symbol2").val('');
        clone.find(".next-states2").val('q5');
        transitionsDiv2.append(clone);

        clone = clone.clone(true);
        clone.find(".current-state-input2").val('q5');
        clone.find(".input-symbol2").val('a');
        clone.find(".next-states2").val('q4');
        transitionsDiv2.append(clone);

        clone = clone.clone(true);
        clone.find(".current-state-input2").val('q4');
        clone.find(".input-symbol2").val('b');
        clone.find(".next-states2").val('q6');
        transitionsDiv2.append(clone);




        $(".remove-button").show();
        $("#verify-update-debug2").click();

    });

    $("#resetBtn2").click(function () {
        $("#initialStateInput2").val('');
        $("#finalStatesInput2").val('');
        $(".remove-button").slice(1).click();
        $(".remove-button").hide();
        $("#nfa-transitions2 input").val('');
        $("#current-nfa2").empty();
        $("#current-dfa2").empty();
        $("#current-dfa-minimized2").empty();
        $("#step-div2").empty();
    });

    $("#verify-update-debug2").click(function () {

        let user_input2 = fetchUserInput2();

        let dotStr2 = "digraph fsm {\n";
        dotStr2 += "rankdir=LR;\n";
        dotStr2 += "size=\"8,5\";\n";
        dotStr2 += "node [shape = doublecircle]; " + user_input2.finalStates2 + ";\n";
        dotStr2 += "node [shape = point]; INITIAL_STATE\n";
        dotStr2 += "node [shape = circle];\n";
        dotStr2 += "INITIAL_STATE -> " + user_input2.initialState2 + ";\n";

        for (let transition of user_input2.transitions2)
            dotStr2 += "" + transition.state + " -> " + transition.nextStates + " [label=" + transition.symbol + "];\n";

        dotStr2 += "}";

        //document.getElementById('current-nfa-status').innerText = 'Rendering...';

        // TODO This render method throws an exception if the input is invalid
        // we should catch the exception and print an "invalid input" error to the user
        console.log(dotStr2);
        d3.select("#current-nfa2").graphviz().zoom(false).renderDot(dotStr2);
        // Now that the preview is done, generate the DFA
        let dfa2 = generateDFA(new NFA(user_input2.initialState2, user_input2.finalStates2, user_input2.states2, user_input2.alphabet2, user_input2.transitions2));

        let step_div2 = $("#step-div2");

        step_div2.empty();

        for (let i = 0; i <= LAST_COMPLETED_STEP_COUNT; i++) {
            step_div2.append('<button class="btn btn-xs btn-info" data-step-number="' + (i + 1) + '">Step ' + (i + 1) + '</button>');
        }

        let dotStr = dfa2.toDotString();
        console.log(dotStr);
        d3.select("#current-dfa2").graphviz().zoom(false).renderDot(dotStr);

        dfa2 = minimizeDFA(dfa2);
        dotStr = dfa2.toDotString();
        console.log(dotStr);
        $("#current-dfa-minimized2").show();
        d3.select("#current-dfa-minimized2").graphviz().zoom(false).renderDot(dotStr);



    });

    $("#step-div2").on("click", "button", function () {

        let step = $(this).data('step-number');

        $(this).parent().find("button").removeClass("active");
        $(this).addClass("active");

        let user_input = fetchUserInput();
        let dfa = generateDFA(new NFA(user_input.initialState, user_input.finalStates, user_input.states, user_input.alphabet, user_input.transitions), step);
        let dotStr = dfa.toDotString();

        d3.select("#current-dfa").graphviz().zoom(false).renderDot(dotStr);

        if (step !== (LAST_COMPLETED_STEP_COUNT + 1)) {

            $("#current-dfa-minimized").hide();

        } else {

            $("#current-dfa-minimized").show();

        }

    });

    


});