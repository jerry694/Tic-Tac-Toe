// récupérer les éléments du DOM
let cases = []
let joueur = $("#joueur");
let score1 = $("#score1");
let score2 = $("#score2");
let scoreNul = $("#scoreNul");
var grid = $("#grid");
let debutPartie = true
var mapState = new Map();//Declrtion de l carte de jeux
var mapStateCart = [];//Declrtion de l carte de jeux


$(document).ready(function () {
  init();
  cases.forEach((el) => {
    el.addEventListener("click", jouerCase);
  });

});
function creerListeTailleN(n) {
  return Array.from({ length: n }, () => (
    Array.from({ length: n }, () => (0))
  ));
}
function init() {

  // mapState.set('taille', prompt("Entrer la taille"));  // Demander à l'utilisateur d'entrer la taille
  mapState.set('taille', 4);
  $("#grid").width(`${6 * mapState.get("taille")}rem`);// J'arrnce le damier en fonction de la taille choisi

  //J'initialise donc la carte de jeu
  mapState.set('joueurEnCours', 1);
  mapState.set('scoreJ1', 0);
  mapState.set('scoreJ2', 0);
  mapState.set('matchNul', 0);
  mapState.set('nbrepionJoue', 0);


  for (let i = 0; i < mapState.get("taille"); i++) {// Je creer les carreaux de jeux dynamiquement
    for (let j = 0; j < mapState.get("taille"); j++) {
      var nouvelElement = $("<div>")
        .addClass("case")
        .attr("id", i + "-" + j)

      grid.append(nouvelElement);
    }

  }


  mapStateCart = creerListeTailleN(mapState.get("taille"))
  cases = [...document.getElementsByClassName("case")]; // nodelist -> array
  joueur.text(mapState.joueurEnCours);
  positionMilieu()

  console.log(mapStateCart)
  console.log(cases)
  console.log(mapState)
}

const jouerCase = (e) => {
  let idCase = e.target.id.split("-");
  console.log(idCase)

  if (mapStateCart[idCase[0]][idCase[1]] !== 0) return;// verifie si le coups a dejaete jouer
  if (debutPartie) {
    debutPartie = !debutPartie
  }
  if (verifActionJouer(e.target.id)) {
    play(e)
  }
  else {
    console.log("coup pas possible 😂")
  }

}

function play(e) {// ici j'utilise l'operteur ternaire

    mapStateCart[e.target.id.split("-")[0]][e.target.id.split("-")[1]] = mapState.get("joueurEnCours")
    actionJouer("#" + e.target.id)
    console.log(mapStateCart)
}

function check() {//ici j'effectue des verification
  terrainPlein()
}
function terrainPlein() {
  if (mapState.get("nbrepionJoue") == mapState.get("taille") ** 2 -1) {//je verifie si on a joue sur tous les espaces du jeux

    reInit() //Je recommence la partie

    return alert("Partie termine")
  }
}

function reInit() { //ici je reinitialise le jeu

  mapState.set('joueurEnCours', 1);
  mapState.set('scoreJ1', 1);
  mapState.set('scoreJ2', 0);
  mapState.set('matchNul', 0);
  mapState.set('nbrepionJoue', 0);
  debutPartie = true


  for (let i = 0; i < mapState.get("taille"); i++) {// Je creer les carreaux de jeux dynamiquement
    for (let j = 0; j < mapState.get("taille"); j++) {
      $("#" + i + "-" + j).text("");
    }

  }
  mapStateCart = creerListeTailleN(mapState.get("taille"))
  positionMilieu()
}

function positionMilieu() {
  const indiceMilieu = Math.ceil((mapState.get("taille")) / 2) - 1;// Calcul de l'indice du milieu du plateau
  mapStateCart[indiceMilieu][indiceMilieu] = mapState.get("joueurEnCours")
  actionJouer("#" + indiceMilieu + "-" + indiceMilieu)
}

function actionJouer(id) {
  $(id).text((mapState.get("joueurEnCours") === 1) ? "X" : "O");//Je remplace la valeur de jeux
  mapState.set("joueurEnCours", mapState.get("joueurEnCours") === 1 ? 2 : 1);// Vérification du joueur : si c'est le joueur 1 ou 2
  joueur.text(mapState.get("joueurEnCours"));
  mapState.set("nbrepionJoue", mapState.get("nbrepionJoue") + 1); // Mise à jour du nombre de pions joués

  check();
}

function verifActionJouer(id) {
  // console.log(jouerPar)
  let posJeux = id.split("-");
  let row = parseInt(posJeux[0]);
  let col = parseInt(posJeux[1]);

  // Vérifier que les indices sont dans les limites du tableau
  if (
    row >= 0 && row < mapStateCart.length &&
    col >= 0 && col < mapStateCart[0].length &&
    (
      // Vérifier les cellules voisines
      // mapStateCart[row][col] != 0 ||
      (row > 0 && col > 0 && mapStateCart[row - 1][col - 1] != 0) ||
      (row < mapStateCart.length - 1 && col < mapStateCart[0].length - 1 && mapStateCart[row + 1][col + 1] != 0) ||
      (row < mapStateCart.length - 1 && col > 0 && mapStateCart[row + 1][col - 1] != 0) ||
      (row > 0 && col < mapStateCart[0].length - 1 && mapStateCart[row - 1][col + 1] != 0) ||
      (col > 0 && mapStateCart[row][col - 1] != 0) ||
      (row > 0 && mapStateCart[row - 1][col] != 0) ||
      (col < mapStateCart[0].length - 1 && mapStateCart[row][col + 1] != 0) ||
      (row < mapStateCart.length - 1 && mapStateCart[row + 1][col] != 0)
    )
  ) {
    return true
  }
  return false
}

