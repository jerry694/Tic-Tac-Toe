// récupérer les éléments du DOM
let cases = []
let joueur = $("#joueur");
let score1 = $("#score1");
let score2 = $("#score2");
let scoreNul = $("#scoreNul");
let v1 = $("#v1");
let v2 = $("#v2");
var grid = $("#grid");
let debutPartie = true
var mapState = new Map();//Declrtion de l carte de jeux
var mapStateCart = [];//Declrtion de l carte de jeux
var taille


$(document).ready(function () {
  $("#btnSoumettre").click(function () {
    var taille = $("#champTexte").val();
    window.taille = taille;
    if(taille>=4){
          $("#monFormulaire").hide();
    mapState.set('taille', parseInt(taille))
    console.log('Taille enregistrée : ' + taille);

    init()


    cases.forEach((el) => {
      el.addEventListener("click", jouerCase);
    });}
    else{
      alert("Entrer une taille superieur a 4 🎭🎭🎭")
    }


  });
  
  $("#btnReinit").hide()

});

  $("#btnReinit").click(function () {
    reInit();
  });
function creerListeTailleN(n) {
  return Array.from({ length: n }, () => (
    Array.from({ length: n }, () => (0))
  ));
}
function init() {

  mapState.set('taille', parseInt(taille));  // Demander à l'utilisateur d'entrer la taille
  // mapState.set('taille', prompt("taille"));
  $("#grid").width(`${6 * mapState.get("taille")}rem`);// J'arrnce le damier en fonction de la taille choisi
  console.log(mapState.get("taille"))

  //J'initialise donc la carte de jeu
  mapState.set('joueurEnCours', Math.floor(Math.random() * 2) + 1);
  mapState.set('scoreJ1', 0);
  mapState.set('scoreJ2', 0);
  mapState.set('v1', 0);
  mapState.set('v2', 0);
  mapState.set('matchNul', 0);
  mapState.set('nbrepionJoue',1);


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
  console.log(compterOccurrencesConsecutives(mapStateCart[2]));
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
    alert("Ce coup n'est pas possible 😂")
  }

}

function play(e) {// ici j'utilise l'operteur ternaire
  let ligne = parseInt(e.target.id.split("-")[0])
  let colonne = parseInt(e.target.id.split("-")[1])

  mapStateCart[ligne][colonne] = mapState.get("joueurEnCours")
  actionJouer("#" + e.target.id)
  console.log(mapStateCart)

}

function check(id) {//ici j'effectue des verification
  compter(id.substring(1))
  console.log(mapState.get("nbrepionJoue"))
  terrainPlein()
  victoire()
}

function terrainPlein() {
  if (mapState.get("nbrepionJoue") == mapState.get("taille") ** 2) {//je verifie si on a joue sur tous les espaces du jeux
    console.log(mapState.get('scoreJ1'))
    console.log(mapState.get('scoreJ2'))
    if (mapState.get('scoreJ1') > mapState.get('scoreJ2')) {
      mapState.set('v1', mapState.get('v1') + 1)
      $("#v1").text(mapState.get('v1'))
      alert("Joueur 1 gagne 🎇🎆🎇");
      mettreEnSurbrillance(1)
      $("#btnReinit").show()

    }
    else if (mapState.get('scoreJ1') < mapState.get('scoreJ2')) {
      mapState.set('v2', mapState.get('v2') + 1)
      $("#v2").text(mapState.get('v2'))
      alert("Joueur 2 gagne 🎟🎟🎟");
      mettreEnSurbrillance(2)
      $("#btnReinit").show()
    }
    else {
      mapState.set('matchNul', mapState.get('matchNul') + 1)
      $("#scoreNul").text(mapState.get('matchNul'))
      alert("Partie termine Nul 📍📍📍")
      $("#btnReinit").show()
    }

  }
}

function reInit() { //ici je reinitialise le jeu

  mapState.set('joueurEnCours', Math.floor(Math.random() * 2) + 1);
  mapState.set('scoreJ1', 1);
  mapState.set('scoreJ2', 0);
  mapState.set('matchNul', 0);
  mapState.set('nbrepionJoue', 0);
  $("#score1").text(0)
  $("#score2").text(0)
  debutPartie = true


  for (let i = 0; i < mapState.get("taille"); i++) {// Je creer les carreaux de jeux dynamiquement
    for (let j = 0; j < mapState.get("taille"); j++) {
      $("#" + i + "-" + j).text("");
      $("#" + i + "-" + j).removeClass("case-gagnante");
    }

  }
  mapStateCart = creerListeTailleN(mapState.get("taille"))
  positionMilieu()
}

function positionMilieu() {
  const indiceMilieu = Math.ceil((mapState.get("taille")) / 2) - 1;// Calcul de l'indice du milieu du plateau
  if((mapState.get("taille"))%2==0){
    mapStateCart[indiceMilieu][indiceMilieu] = mapState.get("joueurEnCours")
    actionJouer("#" + indiceMilieu + "-" + indiceMilieu)
  mapStateCart[indiceMilieu][indiceMilieu+1] = mapState.get("joueurEnCours")
  actionJouer("#" + indiceMilieu + "-" + (indiceMilieu + 1))
  mapStateCart[indiceMilieu+1][indiceMilieu+1] = mapState.get("joueurEnCours")
  actionJouer("#" + (indiceMilieu+1) + "-" + (indiceMilieu+1))
  mapStateCart[indiceMilieu+1][indiceMilieu] = mapState.get("joueurEnCours")
  actionJouer("#" + (indiceMilieu+1) + "-" + indiceMilieu)
  }
  else{
  mapStateCart[indiceMilieu][indiceMilieu] = mapState.get("joueurEnCours")
  actionJouer("#" + indiceMilieu + "-" + indiceMilieu)
  }
}

function actionJouer(id) {
  $(id).text((mapState.get("joueurEnCours") === 1) ? "X" : "O");//Je remplace la valeur de jeux
  mapState.set("joueurEnCours", mapState.get("joueurEnCours") === 1 ? 2 : 1);// Vérification du joueur : si c'est le joueur 1 ou 2
  joueur.text(mapState.get("joueurEnCours"));
  check(id);
  mapState.set("nbrepionJoue", mapState.get("nbrepionJoue") + 1); // Mise à jour du nombre de pions joués

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




function compterOccurrencesConsecutives(tableau) {
  let occurrences = {};
  let currentSymbol = null;
  let currentLength = 0;
  let maxLength = 0;
  occurrences["0"] = 0
  occurrences["1"] = 0
  occurrences["2"] = 0

  for (let i = 0; i < tableau.length; i++) {
    const symbol = tableau[i];

    if (symbol === currentSymbol) {
      // Si le symbole courant est le même que le symbole précédent, incrémenter la longueur actuelle
      currentLength++;
    } else {
      // Si le symbole change, mettre à jour les occurrences et réinitialiser la longueur actuelle
      occurrences[currentSymbol] = Math.max(occurrences[currentSymbol] || 0, currentLength);
      currentSymbol = symbol;
      currentLength = 1;
    }

    // Mettre à jour la longueur maximale
    maxLength = Math.max(maxLength, currentLength);
  }

  // Mettre à jour les occurrences pour le dernier symbole
  occurrences[currentSymbol] = Math.max(occurrences[currentSymbol] || 0, currentLength);

  return occurrences;
}

function construireColonne(matrice, indiceColonne) {
  const colonne = [];

  // Vérifier que l'indice de la colonne est valide
  if (indiceColonne < 0 || indiceColonne >= matrice[0].length) {
    console.error("Indice de colonne invalide");
    return colonne;
  }

  // Parcourir les lignes de la matrice et récupérer les éléments de la colonne
  for (let i = 0; i < matrice.length; i++) {
    colonne.push(matrice[i][indiceColonne]);
  }

  return colonne;
}

function construireLigne(matrice, indiceLigne) {
  const ligne = [];

  // Vérifier que l'indice de la ligne est valide
  if (indiceLigne < 0 || indiceLigne >= matrice.length) {
    console.error("Indice de ligne invalide");
    return ligne;
  }

  // Copier les éléments de la ligne dans le tableau résultat
  ligne.push(...matrice[indiceLigne]);

  return ligne;
}

function extraireDiagonale(matrice, coordonnees) {
  let [x, y] = coordonnees;
  let diagonale = [];
  let n = matrice.length;
  let m = matrice[0].length;

  // Vérifier que les coordonnées sont valides
  if (x < 0 || x >= n || y < 0 || y >= m) {
    console.error("Coordonnées invalides");
    return diagonale;
  }

  // Extraire la diagonale en haut à gauche de la position donnée
  for (let i = 0; x - i >= 0 && y - i >= 0; i++) {
    diagonale.unshift(matrice[x - i][y - i]);
  }

  // Extraire la diagonale en bas à droite de la position donnée (sans dupliquer l'élément central)
  for (let i = 1; x + i < n && y + i < m; i++) {
    diagonale.push(matrice[x + i][y + i]);
  }

  return diagonale;
}

function extraireAntidiagonale(matrice, coordonnees) {
  let [x, y] = coordonnees;
  let antidiagonale = [];
  let n = matrice.length;
  let m = matrice[0].length;

  // Vérifier que les coordonnées sont valides
  if (x < 0 || x >= n || y < 0 || y >= m) {
    console.error("Coordonnées invalides");
    return antidiagonale;
  }

  // Extraire l'antidiagonale en haut à droite de la position donnée
  for (let i = 0; x - i >= 0 && y + i < m; i++) {
    antidiagonale.unshift(matrice[x - i][y + i]);
  }

  // Extraire l'antidiagonale en bas à gauche de la position donnée (sans dupliquer l'élément central)
  for (let i = 1; x + i < n && y - i >= 0; i++) {
    antidiagonale.push(matrice[x + i][y - i]);
  }

  return antidiagonale;
}

function compterPoint(listeJeux) {
  // {0: 2, 1: 1, 2: 0, null: 0}
  let max = {}
  max = compterOccurrencesConsecutives(listeJeux)
  if (max[1] > mapState.get('scoreJ1')) {
    mapState.set('scoreJ1', mapState.get('scoreJ1') + 1)
    $("#score1").text(mapState.get('scoreJ1'))
  }
  if (max[2] > mapState.get('scoreJ2')) {
    mapState.set('scoreJ2', mapState.get('scoreJ2') + 1)
    $("#score2").text(mapState.get('scoreJ2'))
  }

}

function compter(id) {
  let ligne = parseInt(id.split("-")[0])
  let colonne = parseInt(id.split("-")[1])

  console.log(construireLigne(mapStateCart, ligne))
  console.log(construireColonne(mapStateCart, colonne))
  console.log(extraireDiagonale(mapStateCart, [ligne, colonne]))
  console.log(extraireAntidiagonale(mapStateCart, [ligne, colonne]))
  compterPoint(construireLigne(mapStateCart, ligne))
  compterPoint(construireColonne(mapStateCart, colonne))
  compterPoint(extraireDiagonale(mapStateCart, [ligne, colonne]))
  compterPoint(extraireAntidiagonale(mapStateCart, [ligne, colonne]))
  // console.log(id)
}
function victoire() {
  if (mapState.get('scoreJ1') == mapState.get('taille')) {
    alert("Joueur 1 gagne 🎇🎆🎇");
    mapState.set('v1', mapState.get('v1') + 1)
    $("#v1").text(mapState.get('v1'))
    mettreEnSurbrillance(1)
    $("#btnReinit").show()
  }
  else if (mapState.get('scoreJ2') == mapState.get('taille')) {
    alert("Joueur 2 gagne 🎟🎟🎟");
    mapState.set('v2', mapState.get('v2') + 1)
    $("#v2").text(mapState.get('v2'))
    mettreEnSurbrillance(2)
    $("#btnReinit").show()

    // reInit()
  }
}
function mettreEnSurbrillance(id) {
  for (let i = 0; i < mapState.get("taille"); i++) {// Je creer les carreaux de jeux dynamiquement
    for (let j = 0; j < mapState.get("taille"); j++) {
      if (mapStateCart[i][j] == id) {

        $("#" + i + "-" + j).addClass("case-gagnante");
      }
    }

  }
}