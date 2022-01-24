let model;
let outcome;


function setup() {
  noCanvas();

  let options = {
    dataUrl: "data/top7-bundesliga.csv",
    inputs: ["defoff", "matches", "mins", "goals", "assists", "yellow_cards"],
    //defoff,matches,mins,goals,assists,yellow_cards,prediction
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

  trainButton.position(300, 507);
}

function whileTraining(epoch, loss) {
  console.log(`Epoch: ${epoch} - loss: ${loss.loss.toFixed(2)}`);
}

function finishedTraining() {
  console.log("done!");
  predictButton.show();
  trainButton.hide();
}
//defoff,matches,mins,goals,assists,yellow_cards,prediction
function classify() {
  let club = parseInt(select("#club").elt.value);
  let defoff = parseInt(select("#defoff").elt.value);
  let matches = parseInt(select("#matches").value());
  let mins = parseInt(select("#mins").value());
  let goals = parseInt(select("#goals").value());
  let assists = parseInt(select("#assists").value());
  let yellow_cards = parseInt(select("#yellow_cards").value());
  

  let userInputs = {
    defoff: defoff,
    matches: matches,
    mins: mins,
    goals: goals,
    assists: assists,
    yellow_cards: yellow_cards,
  };

  model.classify(userInputs, gotResults);
}

function gotResults(error, result) {
  if (error) {
    console.error(error);
  } else {
    console.log(result);
    if (result[0].label == "No") {
      outcome = "Bankwärmer!";
    } else {
      outcome = "Start 11!";
    }
    
    select("#result").html(
      "" + outcome
    );
  }
}

function modelReady() {
  console.log("model ready");
  model.normalizeData();
}
