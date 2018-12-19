/**
 * Synaptic neural network library.
 * 
 * @author tacowhisperer
 */
const synaptic = require('synaptic');
const Neuron = synaptic.Neuron,
	Layer = synaptic.Layer,
	Network = synaptic.Network,
	Trainer = synaptic.Trainer,
	Architect = synaptic.Architect;

/**
 *
 * @type {Number}
 */
const NUM_INPUT_NODES = 2,
	NUM_HIDDEN_NODES = 3,
	NUM_OUTPUT_NODES = 1;

/**
 * Creates a perceptron using the arguments provided.
 * 
 * @param {Number} numInputNodes  The number of input nodes to use.
 * @param {Number} numHiddenNodes The number of hidden nodes to use.
 * @param {Number} numOutputNodes The number of output nodes to use.
 */
function Perceptron(numInputNodes, numHiddenNodes, numOutputNodes) {
	// Creation of the layers
	const inputLayer = new Layer(numInputNodes);
	const hiddenLayer = new Layer(numHiddenNodes);
	const outputLayer = new Layer(numOutputNodes);

	// Connection of the input layer to the hidden layer
	inputLayer.project(hiddenLayer);

	// Connection of the hidden layer to the output layer
	hiddenLayer.project(outputLayer);

	// Set the layers to this context
	this.set({
		input: inputLayer,
		hidden: [hiddenLayer],
		output: outputLayer
	});
}

// Extension of the prototype chain
Perceptron.prototype = new Network();
Perceptron.prototype.constructor = Perceptron;

// Let's teach it XOR!
var myNetwork = new Perceptron(2, 3, 1);
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
