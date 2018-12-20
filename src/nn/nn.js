const synaptic = require('synaptic');
const Neuron = synaptic.Neuron,
	Layer = synaptic.Layer,
	Network = synaptic.Network,
	Trainer = synaptic.Trainer,
	Architect = synaptic.Architect;

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

// Export the perceptron to the module.
exports.Perceptron = Perceptron;
