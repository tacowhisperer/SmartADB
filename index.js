/**
 * Jimp image manipulation library.
 */
const Jimp = require('jimp');

/**
 * Neural network module.
 */
const nn = require('./src/nn/nn.js');

/**
 * Node.js built-in libraries.
 */
const fs = require('fs');

/**
 * A runtime instance asserter for JavaScript.
 * 
 * @param  {Object} obj      The object to be checked. Note that the object to
 *                           be checked must be the only key of the object. This
 *                           is to be able to extract the variable name to give
 *                           a detailed error message.
 * @param  {String} instance The expected instance of the object in question.
 *
 * @throws {TypeError} If the obj parameter is not correctly enclosed in its own
 *                     object.
 * @throws {TypeError} If the object is not of the expected instance.
 */
function instanceAssert(obj, instance) {
	if (!(obj.constructor.name === 'Object') || Object.keys(obj).length !== 1)
		throw new TypeError("The obj parameter must be enclosed in an object like so: {obj}.");
	if (!(instance.constructor.name === 'String'))
		throw new TypeError("The instance parameter must be a string!");

	let vN = Object.keys(obj)[0],
		v = obj[vN],
		vI = v.constructor.name.charAt(0).toUpperCase() + v.constructor.name.slice(1).toLowerCase(),
		exInstance = instance.charAt(0).toUpperCase() + instance.slice(1).toLowerCase();

	if (vI.toUpperCase() !== instance.toUpperCase())
		throw new TypeError(
			"Expected '" + vN + "' to be of instance '" + exInstance + "'. Instead, got instance '" + vI + "'");
}

/**
 * Load the image from the specified location and pass it to the given callback.
 *
 * @param {String} location The location to the source image
 * @param {Function} f      Callback on success. Takes in the image object and fArgs.
 * @param {Function} g      Callback on error. Takes in the err object and gArgs.
 * @param {Array} fArgs     The arguments to be passed to f.
 * @param {Array} gArgs     The arguments to be passed to g.
 *
 * @throws {TypeError} If parameters are not of the expected type.
 */
function loadImage(location, f, g, fArgs, gArgs) {
	// 
	
	// Ensure type safety of the parameters
	instanceAssert({location}, 'String');
	instanceAssert({f}, 'Function');
	instanceAssert({g}, 'Function');

	if (!(fArgs instanceof Array))
		fArgs = [];
	if (!(gArgs instanceof Array))
		gArgs = [];

	const fArgumentsArray = fArgs;
	const gArgumentsArray = gArgs;
	Jimp.read(location).then(image => {
		// Add the image to the front of the callback arguments array (first argument)
		fArgumentsArray.unshift(image);

		// Callback the function
		f.apply(f, fArgumentsArray);
	}).catch(err => {
		// Add the error to the front of the callback arguments array (first argument)
		gArgumentsArray.unshift(err);

		// Callback the function
		g.apply(g, gArgumentsArray);
	});

	// Let the user know that the request has been sent.
	console.log("Attempting to obtain image from '" + location + "'");
}

loadImage("https://i.imgur.com/BzSPtpv.png", image => {
	image.write("pro_controller.png", () => {
		console.log("File successfully written to disk!");
	});
}, err => {
	console.err(err);
});

/**
 * Synaptic constants.
 * 
 * @type {Number}
 */
const NUM_INPUT_NODES = 2,
	NUM_HIDDEN_NODES = 3,
	NUM_OUTPUT_NODES = 1;


// Let's teach it XOR!
var myNetwork = new nn.Perceptron(2, 3, 1);
var learningRate = 0.3;

for (let i = 0; i < 20000; i++) {
	// 0, 0 => 0
	myNetwork.activate([0, 0]);
	myNetwork.propagate(learningRate, [0]);

	// 0, 1 => 1
	myNetwork.activate([0, 1]);
	myNetwork.propagate(learningRate, [1]);

	// 1, 0 => 1
	myNetwork.activate([1, 0]);
	myNetwork.propagate(learningRate, [1]);

	// 1, 1 => 0
	myNetwork.activate([1, 1]);
	myNetwork.propagate(learningRate, [0]);
}

// See how well it did
console.log("Expect: (0, 0) => [0]");
console.log("   Got: (0, 0) => [" + myNetwork.activate([0, 0]) + "]\n");

console.log("Expect: (0, 1) => [1]");
console.log("   Got: (0, 1) => [" + myNetwork.activate([0, 1]) + "]\n");

console.log("Expect: (1, 0) => [1]");
console.log("   Got: (1, 0) => [" + myNetwork.activate([1, 0]) + "]\n");

console.log("Expect: (1, 1) => [0]");
console.log("   Got: (1, 1) => [" + myNetwork.activate([1, 1]) + "]\n");

console.log(myNetwork.toJSON());
