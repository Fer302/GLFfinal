// hardcoded
var height = 700;
var width = 700;
var N = 5;
var transitionDuration = 12000 / N;
var instantDuration = 20;
var currPathDistance = 0;
var lineWidth = 2;
var orden=[];
function getRandomIntInclusive(min, max) {
    const randomBuffer = new Uint32Array(1);

    window.crypto.getRandomValues(randomBuffer);

    let randomNumber = randomBuffer[0] / (0xffffffff + 1);

    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(randomNumber * (max - min + 1)) + min;
}


var svg = d3.select("#svg-container").append("svg")
	.attr("width", width)
	.attr("height", height);

var svg2 = d3.select("#svg-container2").append("svg")
	.attr("width", width)
	.attr("height", height);

svg2.append("line")          // attach a line
    .style("stroke", "black")  // colour the line
    .attr("x1", 337)     // x position of the first end of the line
    .attr("y1", 0)      // y position of the first end of the line
    .attr("x2", 337)     // x position of the second end of the line
	.attr("y2", 700);    // y position of the second end of the line
svg2.append("line")          // attach a line
    .style("stroke", "black")  // colour the line
    .attr("x1", 0)     // x position of the first end of the line
    .attr("y1", 337)      // y position of the first end of the line
    .attr("x2", 700)     // x position of the second end of the line
    .attr("y2", 337);    // y position of the second end of the line


var graph = d3.select("#graph-container").append("svg")
	.attr("width", width)
	.attr("height", height / 2)
	.append("path");

var distanceStatus = svg.append("text")
	.text(function() {
		return "Distancia: " + currPathDistance + " unidades";
	});

var points = new Array(N);
var path = [];
var pathDistances = [];
var distanceMatrix = new Array(N);
var animate = true;

function loadingScreen() {

}

// creates the graph of the path distances throughout iterations
/*function initializeGraph() {
	var x = d3.scale.linear().domain([0, pathDistances.length]).range([0, width - 5]);
	var y = d3.scale.linear().domain([pathDistances[0], 0]).range([0, height / 2 - 5]);

	var xAxis = d3.svg.axis()	
  	  .scale(x)
  	  .orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

	d3.select("#graph-container").select("svg").append("g")
		.attr("class", "axis")
		.call(xAxis)
		.call(yAxis);

	var graphLine = d3.svg.line()
		.x(function(d, i) {
			return x(i);
		})
		.y(function(d) {
			// hardcoded range
			return y(d);
		})
		.interpolate("linear");

	graph
		.attr("d", graphLine(pathDistances))
		.attr("fill", "none")
		.attr("stroke", "blue")
		.attr("stroke-width", lineWidth);

	// reset distances for next graph
	pathDistances = [];
}
*/
function initializeGraph() {
	var padding=100;
	var vis = d3.select("#graph")
	.append("svg:svg")
		.attr("width", width)
		.attr("height", height);

	var xScale = d3.scale.linear().domain([10, -10]).range([width - padding, padding]);
	var yScale = d3.scale.linear().domain([-10, 10]).range([height - padding, padding]);

	// define the y axis
	var yAxis = d3.svg.axis()
			.orient("left")
			.scale(yScale);
	
	// define the y axis
	var xAxis = d3.svg.axis()
			.orient("bottom")
			.scale(xScale);

	var xAxisPlot = vis.append("g")
			.attr("class", "axis axis--x")
			.attr("transform", "translate(0," + (height/2) + ")")
			.call(xAxis.tickSize(-height, 0, 0));

	var yAxisPlot = vis.append("g")
		.attr("class", "axis axis--y")
		.attr("transform", "translate("+ (width/2) +",0)")
		.call(yAxis.tickSize(-width, 0, 0));


	xAxisPlot.selectAll(".tick line")
		.attr("y1", (width - (2*padding))/2 * -1)
		.attr("y2", (width - (2*padding))/2 * 1);

	yAxisPlot.selectAll(".tick line")
		.attr("x1", (width - (2*padding))/2 * -1)
		.attr("x2", (width - (2*padding))/2 * 1);
	// reset distances for next graph
	pathDistances = [];
}

// // updates the transition durations based on animate checkbox
// function checkAnimation() {
// 	if ($("#animate").prop("checked")) {
// 		transitionDuration = 12000 / N;
// 		instantDuration = 20;
// 	} else {
// 		transitionDuration = 0;
// 		instantDuration = 0;
// 	}
// }

// returns the d3.line function that takes in a path array to create an SVG path
function toLine(isClosed) {
	var interpolation;
	if (isClosed) {
		 interpolation = "linear-closed";
	} else {
		 interpolation = "linear";
	}
	return d3.svg.line()
    .x(function(d) { return points[d].x; })
    .y(function(d) { return points[d].y; })
    .interpolate(interpolation);
}

function generatePoints() {
	points = [];
	for (var i = 0; i < puntosFinales.length; i++) {
		points[i] = {x: parseInt(puntosFinales[i][0]) , y:parseInt(puntosFinales[i][1]) };
	}
	console.log(points[0].x);
	console.log(points[0].y);
	console.log(points);
}



function generateTestPoints() {
	points = [{x: 500, y: 100}, {x: 200, y: 100}, {x: 700, y: 400}, {x: 600, y: 200}, {x:350,y:350}];
}

function drawPoints() { 
	svg.selectAll("circle")
		.remove();

	svg.selectAll("circle")
	.data(points)
	.enter()
	.append("circle")
	.attr("cx", function(d) {
		return d.x;
	})
	.attr("cy", function(d) {
		return d.y;
	})
	.attr("r", 2);
}

function drawIndices() {
	svg.selectAll("text")
		.data(points)
		.enter()
		.append("text")
		.text(function(d, i) {
			return i;
		})
		.attr("fill", "black")
		.attr("font-family", "sans-serif")
		.attr("font-size", 12)
		.attr("x", function(d) {
			return d.x + 4;
		})
		.attr("y", function(d) {
			return d.y + 4;
		});
}

// no longer in use
function sqDistance(p1, p2) {
	return (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y);
}

// store distances from each point to every other point
function generateDistanceMatrix() {
	for (var i = 0; i < N; i++) {
		distanceMatrix[i] = new Array(N);
	}

	for ( i = 0; i < N; i++) {
		for (var j = i; j < N; j++) {
			distanceMatrix[i][j] = Math.sqrt((points[i].x - points[j].x) * (points[i].x - points[j].x)
				 + (points[i].y - points[j].y) * (points[i].y - points[j].y));
			distanceMatrix[j][i] = distanceMatrix[i][j];
		}
	}
}

// no longer in use
function distance(p1, p2) {
	 return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
	//return distances[Math.min(p1, p2)][Math.max(p1, p2)];
}

function getPathDistance(path2) {
	var d = distanceMatrix[path2[0]][path2[path2.length - 1]];
	for (var i = 1; i < path2.length; i++) {
		d += distanceMatrix[path2[i - 1]][path2[i]];
	}
	//d3.select("#distance")
	//	.transition()
	//	.duration((transitionDuration + instantDuration) * path.length)
	//	.text("Distance: " + d.toFixed(2));
	//console.log("The distance is: " + d);
	return d;
}

function updateDistanceDisplay() {
	d3.select("#distance")
		.text("Distancia: " + (pathDistances[pathDistances.length - 1]).toFixed(2)+" Unidades");
}

// initializes the path
function appendPath(path3, isClosed) {
	clearLines(true);

	svg
		.append("path")
		.attr("d", toLine(isClosed)(path3))
		.attr("fill", "none")
		.attr("stroke", "black")
		.attr("stroke-width", lineWidth);
}

// chains transitions for each update of the path
function updatePath(path4, step, isClosed) {
	if (!animate) {
		return;
	}
	// no duration so that the 2opt path doesn't flicker from transitions
	svg.selectAll("path")
		.transition()
		.duration(0)
		.delay((transitionDuration + instantDuration) * (step + 1))
		.attr("d", toLine(isClosed)(path4));
	d3.timer.flush();
}

// animates insertion by overlaying white lines over the old edge
// and transitioning red lines to the new edges
function animateEdge(step, before, insert, after) {
	if (!animate) {
		return;
	}

	// inserting into open circuit e.g. nearest neighbor
	var lineBeforeInsertion = svg.append("line")
			.attr("x1", before.x)
			.attr("y1", before.y)
			.attr("stroke-width", lineWidth * 1.5)
			.attr("stroke", "red")
			.attr("opacity", 0);

	if (after != null) {
		var averageX = (before.x + after.x) / 2;
		var averageY = (before.y + after.y) / 2;
		lineBeforeInsertion
			.attr("x2", averageX)
			.attr("y2", averageY);

		var lineAfterInsertion = svg.append("line")
			.attr("x1", after.x)
			.attr("y1", after.y)
			.attr("x2", averageX)
			.attr("y2", averageY)
			.attr("stroke", "red")
			.attr("stroke-width", lineWidth * 1.5)
			.attr("opacity", 0)
			.transition()
			.delay(step * (transitionDuration + instantDuration))
			.duration(instantDuration)
			.attr("opacity", 1)
			.transition()
			.duration(transitionDuration)
			.attr("x2", insert.x)
			.attr("y2", insert.y)
			.remove();
		console.log(lineAfterInsertion);
	} else {
		lineBeforeInsertion
			.attr("x2", before.x)
			.attr("y2", before.y);
	}
	lineBeforeInsertion.transition()
		.delay(step * (transitionDuration + instantDuration))
		.duration(instantDuration)
		.attr("opacity", 1)
		.transition()
		.duration(transitionDuration)
		.attr("x2", insert.x)
		.attr("y2", insert.y)
		.remove();
}

// creates two white lines to cover previous edges and transitions two red lines
// to the swapped position
function animateEdgeSwap(step, firstEdge0, firstEdge1, secondEdge0, secondEdge1) {
	if (!animate) {
		return;
	}

	svg.append("line")
		.attr("x1", firstEdge0.x)
		.attr("y1", firstEdge0.y)
		.attr("x2", firstEdge1.x)
		.attr("y2", firstEdge1.y)
		.attr("stroke-width", lineWidth * 1.5)
		.attr("stroke", "white")
		.attr("opacity", 0)
		.transition()
		.delay(step * (instantDuration + transitionDuration))
		.attr("opacity", 0.5)
		.transition()
		.duration(transitionDuration)
		.attr("opacity", 1)
		.remove();

	svg.append("line")
		.attr("x1", secondEdge0.x)
		.attr("y1", secondEdge0.y)
		.attr("x2", secondEdge1.x)
		.attr("y2", secondEdge1.y)
		.attr("stroke-width", lineWidth * 1.5)
		.attr("stroke", "white")
		.attr("opacity", 0)
		.transition()
		.delay(step * (instantDuration + transitionDuration))
		.attr("opacity", 0.5)
		.transition()
		.duration(transitionDuration)
		.attr("opacity", 1)
		.remove();

	svg.append("line")
		.attr("x1", firstEdge0.x)
		.attr("y1", firstEdge0.y)
		.attr("x2", firstEdge1.x)
		.attr("y2", firstEdge1.y)
		.attr("stroke-width", lineWidth * 2)
		.attr("stroke", "red")
		.attr("opacity", 0)
		.transition()
		.delay(step * (instantDuration + transitionDuration))
		.attr("opacity", 1)
		.transition()
		.duration(transitionDuration)
		.attr("x2", secondEdge0.x)
		.attr("y2", secondEdge0.y)
		.remove();

	svg.append("line")
		.attr("x1", secondEdge0.x)
		.attr("y1", secondEdge0.y)
		.attr("x2", secondEdge1.x)
		.attr("y2", secondEdge1.y)
		.attr("stroke-width", lineWidth * 2)
		.attr("stroke", "red")
		.attr("opacity", 0)
		.transition()
		.delay(step * (instantDuration + transitionDuration))
		.attr("opacity", 1)
		.transition()
		.duration(transitionDuration)
		.attr("x1", firstEdge1.x)
		.attr("y1", firstEdge1.y)
		.remove();
}

// highlights two edges (e.g. if they are considered for SA but not swapped)
function animateEdgeHighlight(step, firstEdge0, firstEdge1, secondEdge0, secondEdge1) {
	if (!animate) {
		return;
	}

	svg.append("line")
		.attr("x1", firstEdge0.x)
		.attr("y1", firstEdge0.y)
		.attr("x2", firstEdge1.x)
		.attr("y2", firstEdge1.y)
		.attr("stroke-width", lineWidth * 2)
		.attr("stroke", "red")
		.attr("opacity", 0)
		.transition()
		.delay(step * (instantDuration + transitionDuration))
		.attr("opacity", 1)
		.transition()
		.duration(transitionDuration)
		.remove();

	svg.append("line")
		.attr("x1", secondEdge0.x)
		.attr("y1", secondEdge0.y)
		.attr("x2", secondEdge1.x)
		.attr("y2", secondEdge1.y)
		.attr("stroke-width", lineWidth * 2)
		.attr("stroke", "red")
		.attr("opacity", 0)
		.transition()
		.delay(step * (instantDuration + transitionDuration))
		.attr("opacity", 1)
		.transition()
		.duration(transitionDuration)
		.remove();
}

function clearLines(removePath) {
	if (removePath) {
		svg.selectAll("path")
			.remove();
	}
	svg.selectAll("line")
		.remove();
	d3.timer.flush();
}

function swap(path6, i, j) {
	var clone = path6.slice(0);
	var temp = clone[i];
	clone[i] = clone[j];
	clone[j] = temp;
	return clone;
}

// no longer in use - finds the smallest edge in the points array
function smallestEdge() {
	var smallestEdgeFirst = points.slice(0);
	var first = -1;
	var second = -1;
	var nearestSquareDistance = height * height + width * width + 1;
	for (var i = 0; i < points.length; i++) {
		for (var j = i + 1; j < points.length; j++) {
			var currSquareDistance = sqDistance(smallestEdgeFirst[i], smallestEdgeFirst[j]);
			if (currSquareDistance < nearestSquareDistance) {
				nearestSquareDistance = currSquareDistance;
				first = i;
				second = j;
			}
		}
	}
	smallestEdgeFirst = swap(smallestEdgeFirst, 0, first);
	return swap(smallestEdgeFirst, 1, second);
}

function generateRandomPath() {
	var path7 = [];
	for (var i = 0; i < N; i++) {
		path7[i] = i;
	}
	console.log(path7);
	path7 = shuffle(path7);
	return path7;
}

// inorder tour
function inOrder() {
	path = generateRandomPath();
	appendPath(path, true);
	pathDistances.push(getPathDistance(path));
	updateDistanceDisplay();
	initializeGraph();
}


// tour of points using nearest neighbor heuristic
function nearestNeighbor() {
	$( "#listado" ).empty();
	var remaining = generateRandomPath();
	console.log(remaining);
	path = [remaining[0]];
	appendPath(path, false);
	for (var i = 0; i < points.length - 1; i++) {
		var nearestDistance = height * height + width * width + 1;
		var nearestPoint = null;
		var indexInRemaining = 0;

		// find nearest neighbor
		for (var j = i + 1; j < points.length; j++) {
			let currentDistance = distanceMatrix[path[i]][remaining[j]];
			if (currentDistance < nearestDistance) {
				nearestPoint = remaining[j];
				console.log(nearestPoint);
				nearestDistance = currentDistance;
				indexInRemaining = j;
			}
		}
		// add to path and swap in remaining so it will not be added again
		remaining = swap(remaining, i + 1, indexInRemaining);
		path.push(remaining[i + 1]);

		animateEdge(i, points[remaining[i]], points[remaining[i + 1]], null);
		updatePath(path, i, false);
	}

	animateEdge(path.length - 1, points[remaining[path.length - 1]], points[path[0]], null);
	updatePath(path, path.length - 1, true);

	if (!animate) {
		appendPath(path, true);
	}
	pathDistances.push(getPathDistance(path));
	updateDistanceDisplay();
	console.log(path);
	orden=path.slice();
	console.log(puntosFinales);
	console.log(ptsV);
	console.log(orden);
	var auxInput=[];
	var auxCheck=[];
	$('div#cboxc input[type=number]').each(function(){
		var input = $(this).val(); // This is the jquery object of the input, do what you will
		auxInput.push(input);
	});
	$('div#cboxc input[type=checkbox]').each(function () {
		if ($(this).is(":checked")) {
			auxCheck.push($(this).val());
		}
	});
	var newArray = auxInput.filter(function(v){return v!==''});
	var strNew='';
	var listaN= document.getElementById("listado");
	var auxDiv2;
	console.log(newArray);
	console.log(auxCheck);
	for(var jk=1;jk<path.length;jk++){
		if(jk==1){
		strNew= "Centro dist->"+auxCheck[path[jk]-1] +" productos:"+newArray[path[jk]-1];
		auxDiv2 = document.createElement('h3');
		auxDiv2.appendChild(document.createTextNode(strNew));
		listaN.appendChild(auxDiv2);
		console.log(strNew);
		}
		else{
		strNew=auxCheck[path[jk-1]-1]+"->"+auxCheck[path[jk]-1]+" productos:"+newArray[path[jk]-1];
		auxDiv2 = document.createElement('h3');
		auxDiv2.appendChild(document.createTextNode(strNew));
		listaN.appendChild(auxDiv2);
		console.log(strNew);
		}
	}
}

// tour of points using either nearest or farthest insertion heuristic
function nearFarInsertion(farthest) {
	// create initial single point subtour
	var remaining = generateRandomPath();
	path = [remaining[0]];
	appendPath(path, false);

	for (var i = 1; i < points.length; i++) {
		var indexInRemaining = 0;
		var indexInPath = 0;
		var minimalDistance = height * height + width * width + 1;
		var maximalDistanceToTour = -1;
		var bestPoint = null;
		console.log(bestPoint);

		for (var j = i; j < points.length; j++) {

			if (farthest) {
				minimalDistance = height * height + width * width + 1;
			}

			for (var k = 0; k < path.length; k++) {
				var currentDistance = distanceMatrix[path[k]][remaining[j]];

				// find minimal distance from j to a point in the subtour
				if (currentDistance < minimalDistance) {
					minimalDistance = currentDistance;

					// for nearest insertion store the closest point
					if (!farthest) {
						bestPoint = remaining[j];
						indexInRemaining = j;
					}
				}
			}
			// for farthest insertion store the point whose minimal distance to the tour is maximal
			if (farthest && minimalDistance > maximalDistanceToTour) {
				if (minimalDistance > maximalDistanceToTour) {
					maximalDistanceToTour = minimalDistance;
					bestPoint = remaining[j];
					indexInRemaining = j;
				}
			}	

		}
		console.log(bestPoint);

		remaining = swap(remaining, indexInRemaining, i);

		// look for the edge in the subtour where insertion would be least costly
		let smallestDetour = height * height + width * width + 1;
		for ( k = 0; k < path.length - 1; k++) {
			var currentDetour = detour(path[k], remaining[i], path[k + 1]);
			if (currentDetour < smallestDetour) {
				smallestDetour = currentDetour;
				indexInPath = k;
			}
		}
		// check the detour between last point and first
		if (detour(path[path.length - 1], remaining[i], path[0]) < smallestDetour) {
			animateEdge(i, points[path[path.length - 1]], points[remaining[i]], points[path[0]]);
			path.splice(path.length, 0, remaining[i]);
		} else {
			animateEdge(i, points[path[indexInPath]], points[remaining[i]], points[path[indexInPath + 1]]);
			path.splice(indexInPath + 1, 0, remaining[i]);
		}
			updatePath(path, i, true);
	}
	if (!animate) {
		appendPath(path, true);
	}
	pathDistances.push(getPathDistance(path));
	updateDistanceDisplay();
}

function detour(before, insert, after) {
	return distanceMatrix[before][insert] + distanceMatrix[insert][after] - distanceMatrix[before][after];
}

function hillClimber(step, numSteps) {
	return 0;
}

function linearSA(startTemp, step, numSteps) {
	return (1 - step / numSteps) * startTemp;
}

function exponentialSA(startTemp, step, numSteps) {
	//end temp around 1 because ln startTemp is approx 5
	return startTemp * Math.exp((0.0 - step) / numSteps * 5);
}

function simulatedAnnealing(coolingFunction) {
	var changedAnimate = false;
	if (N > 100 && animate) {
		animate = false;
		changedAnimate = true;
	}
	if (!path.length) {
		path = generateRandomPath();
		appendPath(path, true);
	}
	var steps = N * 300;
	//var steps = 100;
	var startTemp = N / 2;
	var endTemp = 1;
	console.log(endTemp);
	currPathDistance = getPathDistance(path);

	var numSwaps = 0;

	//var bestDistance = Number.MAX_SAFE_INTEGER;
	for (var step = 0; step < steps; step++) {
		let temp = coolingFunction(startTemp, step, steps);
		var i = Math.floor(path.length * getRandomIntInclusive(0, 1) );
		var j = Math.floor(path.length * getRandomIntInclusive(0, 1) );
		var first = Math.min(i, j);
		var second = Math.max(i, j);

		if (first == path.length - 1) {
			first = Math.floor((path.length - 1) * getRandomIntInclusive(0, 1) );
		}

		// check edge from last point to first
		var afterSecond = second == path.length - 1 ? 0 : second + 1;
		
		var changeInDistance = distanceMatrix[path[first]][path[second]] + distanceMatrix[path[afterSecond]][path[first + 1]]
			- distanceMatrix[path[first]][path[first + 1]] - distanceMatrix[path[second]][path[afterSecond]];

		// always accept step if it is superior, accept with some chance if it is inferior
		if (changeInDistance < 0 || getRandomIntInclusive(0, 1)  <= Math.exp((0 - changeInDistance) / temp)) {
			if (changeInDistance > 0) {
				console.log(step + " inferior step");
			}
			numSwaps += 1;

			animateEdgeSwap(step, points[path[first]], points[path[first + 1]], points[path[second]], points[path[afterSecond]]);

			path = swapEdges(path, first, second);
			//if (currDistance < bestDistance) {
			//	bestDistance = currDistance;
			//}
			currPathDistance = getPathDistance(path);
			pathDistances.push(currPathDistance);
		} 
		else {
			animateEdgeHighlight(step, points[path[first]], points[path[first + 1]], points[path[second]], points[path[afterSecond]]);
		}
		updatePath(path, step, true);
	}
	console.log("distance is " + currPathDistance);
	console.log("number of swaps: " + numSwaps);
	if (!animate) {
		appendPath(path, true);
	}
	updateDistanceDisplay();
	initializeGraph();

	if (changedAnimate) {
		animate = true;
	}
}

function genetic() {
	console.log("genetic algorithm");
	var parentPaths = [];
	var childrenPaths = [];
	var popSize = 1000;
	var generations = 1000;
	var mutationChance = 0.08;
	var bestDistanceSoFar = Number.MAX_VALUE;
	var bestPath = points;

	for (var i = 0; i < popSize; i++) {
		parentPaths[i] = generateRandomPath();
	}

	for ( i = 0; i < generations; i++) {
		childrenPaths = [];
		for (var j = 0; j < popSize; j++) {
			var firstParent = tournamentSelect(parentPaths);
			var secondParent = tournamentSelect(parentPaths);
			var child = orderCrossover(parentPaths[firstParent], parentPaths[secondParent]);

			if (getRandomIntInclusive(0, 1)  < mutationChance) {
				child = mutation(child);
			}
			childrenPaths.push(child);
			var childFitness = getPathDistance(child);
			if (childFitness < bestDistanceSoFar) {
				bestDistanceSoFar = childFitness;
				bestPath = child;
			}
		}
		pathDistances.push(bestDistanceSoFar);
		console.log(bestDistanceSoFar);
		parentPaths.length = 0;
		parentPaths = childrenPaths;
	}
	path = bestPath;
	appendPath(path, true);
	console.log("The distance is: " + getPathDistance(path));
	updateDistanceDisplay();
	initializeGraph();
}

function shuffle(arr) {

    for (var i = arr.length - 2; i > 1; i--) {
    const j = 1 + Math.floor(getRandomIntInclusive(0, 1) * i);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// pick the fittest out of a sample (aka tournament)
function tournamentSelect(paths) {
	var tournamentSize = 8;
	var fittest = -1;
	var bestDistance = Number.MAX_VALUE;
	for (var i = 0; i < tournamentSize; i++) {
		var randomIndex = Math.floor(paths.length *getRandomIntInclusive(0, 1) );
		var fitness = getPathDistance(paths[randomIndex]);
		if (fitness < bestDistance) {
			bestDistance = fitness;
			fittest = randomIndex;
		}
	}
	return fittest;
}

// crossover between two paths by keeping a subset of the first parent
// and maintaining the order of the second parent for the remaining points
function orderCrossover(firstPath, secondPath) {
	var firstChild = [];

	var i = Math.floor(firstPath.length * getRandomIntInclusive(0, 1) );
	var j = Math.floor(firstPath.length * getRandomIntInclusive(0, 1) );
	var first = Math.min(i, j);
	var second = Math.max(i, j);

	for (i = first; i <= second; i++) {
		firstChild[i] = firstPath[i];
	}

	var indexInSecond = 0;
	for ( i = 0; i < firstPath.length; i++) {
		if (i >= first && i <= second) {
			continue;
		}
		// omit points already added
		while (contains(firstChild, secondPath[indexInSecond], first, second)) {
			indexInSecond++;
		}
		firstChild[i] = secondPath[indexInSecond];
		indexInSecond++;
	}
	return firstChild;
}

function mutation(child) {
	var i = Math.floor(child.length * getRandomIntInclusive(0, 1) );
	var j = Math.floor(child.length * getRandomIntInclusive(0, 1) );
	var first = Math.min(i, j);
	var second = Math.max(i, j);

	if (first == child.length - 1) {
		first = Math.floor((child.length - 1) * getRandomIntInclusive(0, 1) );
	}

	// check edge from last point to first
	var afterSecond = second == child.length - 1 ? 0 : second + 1;

	var changeInDistance = distanceMatrix[child[first]][child[second]] + distanceMatrix[child[afterSecond]][child[first + 1]] 
		- distanceMatrix[child[first]][child[first + 1]] + distanceMatrix[child[second]][child[afterSecond]];
	console.log(changeInDistance);

	child = swapEdges(child, first, second);

	return child;
}

function contains(childPath, point, begin, end) {
	for (var i = begin; i <= end; i++) {
		if (childPath[i] == point) {
			return true;
		}
	}
	return false;
}

// performs two opt swaps iteratively until no more advantageous swaps are found
function iterativeTwoOpt() {
	if (!path.length) {
		path = generateRandomPath();
		appendPath(path, true);
	}
	clearLines(false);

	var bestDistance = 0;
	var count = 0
	while (bestDistance != twoOpt(count)) {
		bestDistance = getPathDistance(path);
		pathDistances.push(bestDistance);
		updatePath(path, count, true);
		count += 1;
	}
	if (!animate) {
		appendPath(path, true);
	}
	updateDistanceDisplay();
	initializeGraph();
}

function twoOpt(count) {
	console.log("2 opt!");
	for (var i = 0; i < path.length - 2; i++) { 
		for (var j = i + 2; j < path.length - 1; j++) {
			if (distanceMatrix[path[i]][path[i + 1]] + distanceMatrix[path[j]][path[j + 1]]
				> distanceMatrix[path[i]][path[j]] + distanceMatrix[path[j + 1]][path[i + 1]]) {

				animateEdgeSwap(count, points[path[i]], points[path[i + 1]], points[path[j]], points[path[j + 1]]);
				path = swapEdges(path, i, j);
				return getPathDistance(path);
			}
		}
		// check the edge from last point to first point
		if (distanceMatrix[path[i]][path[i + 1]] + distanceMatrix[path[j]][path[0]]
			> distanceMatrix[path[i]][path[j]] + distanceMatrix[path[0]][path[i + 1]]) {

			animateEdgeSwap(count, points[path[i]], points[path[i + 1]], points[path[j]], points[path[0]]);
			path = swapEdges(path, i, j);
			return getPathDistance(path);
		}
	}
	return getPathDistance(path);
}

function swapEdges(path9, first, second) {
	return path9.slice(0, first + 1).concat(path9.slice(first + 1, second + 1).reverse().concat(path9.slice(second + 1)));
}

// wraps heuristic functions and uses setTimeout to show loading screen
function heuristic(func, arg) {
	$("#overlay").css("display", "block");
	console.time("time");
	setTimeout(function() {
		if (arg == undefined) {
			func();
		} else {
			func(arg);
		}
		$("#overlay").css("display", "none");
		console.timeEnd("time");
	}, 10);
}
$("#cbox2").click(function () {
	//console.log($(this).val());
	N = puntosFinales.length;
	console.log(N);
	transitionDuration = 12000 / N;
	//console.log(N);
	generatePoints();
	drawPoints();
	generateDistanceMatrix();
	clearLines(true);
	path.length = 0;
	heuristic(nearestNeighbor);
});


generatePoints();
drawPoints();
generateDistanceMatrix();
//drawIndices();



$("#nearest-neighbor").on("click", function() {
	heuristic(nearestNeighbor);
});
$("#nearest-insertion").on("click", function() {
	heuristic(nearFarInsertion, false);
});
$("#farthest-insertion").on("click", function() {
	heuristic(nearFarInsertion, true);
});
$("#in-order").on("click", inOrder);
$("#hill-climber").on("click", function() {
	heuristic(simulatedAnnealing, hillClimber);
});
$("#simulated-annealing").on("click", function() {
	heuristic(simulatedAnnealing, linearSA);
});
$("#simulated-annealing-exp").on("click", function() {
	heuristic(simulatedAnnealing, exponentialSA);
});
$("#genetic").on("click", function() {
	heuristic(genetic);
});
$("#2-opt").on("click", function() {
	heuristic(iterativeTwoOpt);
});
// $("#2-points").on("click", twoPoints);
$("#clear").on("click", function() {
	clearLines(true);
	path = [];
});
$("#animate").on("click", function() {
	animate = !animate;
});


