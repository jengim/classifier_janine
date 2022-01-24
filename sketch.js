let model;
let outcome;


function setup() {
  noCanvas();

  let options = {
    dataUrl: "data/stamm-bank.csv",
    inputs: ["matches", "goals", "position"],
    outputs: ["prediction"],
    task: "classification",
    debug: true,
  };

  model = ml5.neuralNetwork(options, modelReady);

  predictButton = select("#predict");
  predictButton.mousePressed(classify);
  predictButton.hide();

  trainButton = select("#train");

  trainButton.mousePressed(function () {
    let trainOptions = {
      epochs: 30,
    };

    model.train(trainOptions, whileTraining, finishedTraining);
  });

  trainButton.position(10, 400);
}

function whileTraining(epoch, loss) {
  console.log(`Epoch: ${epoch} - loss: ${loss.loss.toFixed(2)}`);
}

function finishedTraining() {
  console.log("done!");
  predictButton.show();
  trainButton.hide();
}

function classify() {
  let matches = parseInt(select("#matches").value());
  let goals = parseInt(select("#goals").value());
  let position = parseInt(select("#position").elt.value);

  let userInputs = {
    matches: matches,
    goals: goals,
    position: position,
  };

  model.classify(userInputs, gotResults);
}

function gotResults(error, result) {
  if (error) {
    console.error(error);
  } else {
    console.log(result);
    if (result[0].label == "No") {
      outcome = "Bank!";
    } else {
      outcome = "Startaufstellung!";
    }
    
    select("#result").html(
      " " + outcome
    );
  }
}

function modelReady() {
  console.log("model ready");
  model.normalizeData();
}
