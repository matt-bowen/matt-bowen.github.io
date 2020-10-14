/*global window */
/*global output */
/*global console */
/*jslint plusplus: true */
/*jslint latedef: true */
window.onload = function () {
    "use strict";
    var canvas = window.document.getElementById("theCanvas"),
        context = canvas.getContext("2d"),
        clength = 300,
        temperature = 3,
        slider = window.document.getElementById("myRange"),
        playAnim = true,
        imageData = context.createImageData(clength, clength),
        myArray = init2DArray(clength, clength, function () {var c = [-1, 1]; return c[Math.floor(Math.random() * 2)]; });
        //creates a 2D square array populated with -1 and 1
    canvas.width = clength;
    canvas.height = clength;
    

    slider.value = function () {
        output.innerHTML = this.value;
    };
    
    window.document.getElementById("stop").addEventListener("click", function () {playAnim = false; });
    window.document.getElementById("start").addEventListener("click", function () {playAnim = true; animate(); });

    function init2DArray(xlen, ylen, factoryFn) {
        //generates a 2D array of xlen X ylen, filling each element with values defined by factoryFn, if called.
        var ret = [],
            x,
            y;
        for (x = 0; x < xlen; x++) {
            ret[x] = [];
            for (y = 0; y < ylen; y++) {
                ret[x][y] = factoryFn(x, y);
            }
        }
        return ret;
    }

    function createImage(array, ilen, jlen) {
        var pixelIndex = null,
            i,
            j;
        for (i = 0; i < ilen; i++) {
            for (j = 0; j < jlen; j++) {
                pixelIndex = (i * clength + j) * 4;
                //pixelIndex = 4 * i * clength + 4 * j;

                if (array[i][j] === 1) {
                    imageData.data[pixelIndex] = 74;     //r
                    imageData.data[pixelIndex + 1] = 202;   //g
                    imageData.data[pixelIndex + 2] = 168;   //b
                    imageData.data[pixelIndex + 3] = 255; //alpha (255 is fully visible)
                    //0,0,0 for black
                } else if (array[i][j] === -1) {
                    imageData.data[pixelIndex] = 255;   //r
                    imageData.data[pixelIndex + 1] = 255; //g
                    imageData.data[pixelIndex + 2] = 255; //b
                    imageData.data[pixelIndex + 3] = 255; //alpha (255 is fully visible)
                    //255,255,255 for white
                }
            }
        }
    }

    function dU(i, j, array) {
        var m = clength - 1,
            top = null,
            bottom = null,
            left = null,
            right = null;
        //periodic boundary conditions
        if (i === 0) { //top row
            top = array[m][j];
        } else {
            top = array[i - 1][j];
        }
        if (i === m) { //bottom row
            bottom = array[0][j];
        } else {
            bottom = array[i + 1][j];
        }
        if (j === 0) { //first in row (left)
            left = array[i][m];
        } else {
            left = array[i][j - 1];
        }
        if (j === m) { //last in row (right)
            right = array[i][0];
        } else {
            right = array[i][j + 1];
        }
        return 2.0 * array[i][j] * (top + bottom + left + right); //local magnetization
    }

    function randInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
    function sliderTemp() {
        return +slider.value;
    }

    function animate() {
        var previous = myArray,
            count = 0,
            deltaU,
            i,
            j,
            z,
            x,
            y;
        if (!playAnim) {return; } else { // stops
            window.requestAnimationFrame(animate);
            temperature = sliderTemp();

            createImage(myArray, clength, clength);
            context.clearRect(0, 0, clength, clength);
            context.beginPath();
            context.putImageData(imageData, 0, 0);

            for (z = 0; z < 10 * Math.pow(clength, 2); z++) {
                i = randInt(clength);
                j = randInt(clength);

                deltaU = dU(i, j, myArray);

                if (deltaU <= 0) {
                    myArray[i][j] = -myArray[i][j];
                } else {
                    if (Math.random() < Math.exp(-deltaU / temperature)) {
                        myArray[i][j] = -myArray[i][j];
                    }
                }
            }
        }
        //console.log(myArray);
        /*
        for (x = 0; x < clength; x++) {
            for (y = 0; y < clength; y++) {
                if (previous[x][y] === myArray[x][y]) {
                    count = count + 1;
                }
            }
        }
        */
        //console.log(count);
    }
    
    window.requestAnimFrame = (function(callback) {
		return 	window.requestAnimationFrame || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame || 
			window.oRequestAnimationFrame || 
			window.msRequestAnimationFrame ||
			function(callback) {
				window.setTimeout(callback, 1);		// second parameter is time in ms
			};
	})();

};