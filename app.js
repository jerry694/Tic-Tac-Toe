// récupérer les éléments du DOM
let cases = []
let joueur = $("#joueur");
let score1 = $("#score1");
let score2 = $("#score2");
let scoreNul = $("#scoreNul");
var grid = $("#grid");

var mapState = new Map();//Declrtion de l carte de jeux


$(document).ready(function () {
  init();
  cases.forEach((el) => {
    el.addEventListener("click", jouerCase);
  });

});

function init() {

  mapState.set('taille', prompt("Entrer la taille"));  // Demander à l'utilisateur d'entrer la taille
  $("#grid").width(`${6 * mapState.get("taille")}rem`);// J'arrnce le damier en fonction de la taille choisi

  //J'initialise donc la carte de jeu
  mapState.set('joueurEnCours', 1);
  mapState.set('scoreJ1', 0);
  mapState.set('scoreJ2', 0);
  mapState.set('matchNul', 0);
  mapState.set('nbrepionJoue', 0);

  for (let i = 1; i <= mapState.get("taille") ** 2; i++) {// Je creer les carreaux de jeux dynamiquement
    var nouvelElement = $("<div>")
      .addClass("case")   
      .attr("id", "c" + i) 

    mapState.set('c' + i, 0);
    grid.append(nouvelElement);
  }

  cases = [...document.getElementsByClassName("case")]; // nodelist -> array
  console.log(cases)
  console.log(mapState)
}

const jouerCase = (e) => {
  let idCase = e.target.id;
  console.log(idCase)

  if (mapState.get(idCase) !== 0) return;  // si case déjà jouée on ne fait rien

  mapState.set(idCase, mapState.joueurEnCours);
  play(e)


}

function play(e) {// ici j'utilise l'operteur ternaire
  
  mapState.joueurEnCours = (mapState.joueurEnCours === 1) ? 2 : 1;// Vérification du joueur : si c'est le joueur 1 ou 2
  $(e.target).text((mapState.joueurEnCours === 1) ? "X" : "O");//Je remplace la valeur de jeux
  joueur.text(mapState.joueurEnCours);

 
  mapState.set("nbrepionJoue", mapState.get("nbrepionJoue") + 1); // Mise à jour du nombre de pions joués

  check();
}

function check(){//ici j'effectue des verification
  if(mapState.get("nbrepionJoue")==mapState.get("taille")**2){//je verifie si on a joue sur tous les espaces du jeux

    reInit() //Je recommence la partie

    return alert("Partie termine")
  }
}

function reInit(){ //ici je reinitialise le jeu
  
  mapState.set('joueurEnCours', 1);
  mapState.set('scoreJ1', 1);
  mapState.set('scoreJ2', 0);
  mapState.set('matchNul', 0);
  mapState.set('nbrepionJoue', 0);

  for (let i = 1; i <= mapState.get("taille") ** 2; i++) {
    mapState.set('c' + i, 0);
    $('#c' + i).text("");
  }
}

