// ------------------IMPORTANT----------------------------

// STRUSTURE DE L'APPLI :
// ---------------------

// On déclare d'abord les constantes qui viendront stocker les différents éléments du DOM que l'on souhaite pointer.
// Ensuite, on déclare ldes différents variables évolutives "let"
// Ensuite, on déclare une fonction asynchrone qui permet de récupérer des données d'une API que l'on vient stocker dans la variable "meals"
// Ensuite, on déclare les fonctions d'affichage où l'on limite de nombre d'éléments à afficheret où on insère les différents éléments avec un innerHTML
// Ensuite, on déclare les fonctions liés aux événements :
// - la récupération de ce que l'on tape dans l'input du formulaire
// - l'affichage des éléments à la validation du formaulaire avec 'submit' qui fait référence au click de la touche "entrée"

// -------------------------------------------------------------

// On déclare une variable pour stocker la zone où on insérera les éléments récupérés, ici les recttes de cuisine.
const result = document.getElementById("result");
// On déclare une variable pour pointer le formulaire afin de pouvoir déclarer l'affichage des recettes à la validation du formulaire avec "entrée"
const form = document.querySelector("form");
// On déclare une variable pour pointer l'input et récupérer ce que l'utilisateur y tape.
const input = document.querySelector("input");

// On déclare une variable pour pointer le bouton de traduction.
const button = document.getElementById("button");

let ingredientOfInput;
input.addEventListener("input", (e) => {
  ingredientOfInput = e.target.value;
  // console.log(ingredientOfInput);
});
// On déclare une variable meals qui va contenir les différentes recettes récupérées de l'API "themealdb"
let meals = [];
// On déclare une variable ingredientsTrad qui va contenir les différentes traduction du fichier JSON trad.json
let ingredientsTrad = [];

// On déclare une fonction asynchrone fetchMeals. Dans cette fonction, on déclare en "await" le fetch pour que certaines méthode de la fonction, comme le console.log de fin, attende que le fetch soit terminé pour qu'elle s'exécute.
// Dans le 1er ".then", on utilise la méthode .jon() avec le résultat du fetch symbolisé par "res" pour le rendre exploitable.
// Dans le 2ème ".then", on prend comme argument "data" symbolisant les données de "res" et ensuite on affecte au tableau vide "meals", les data de l'objet "meals" renvoyé pas le "res" du fetch.
// On met le paramètre "search" à cette fonction fetchMeals pour le reprendre et le rajouter à la recherche du fetch. Ce paramètre sera remplacé par la valeur de l'input où l'utilisateur tapera sa recherche.
async function fetchMeals(search) {
  await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=" + search)
    .then((res) => res.json())
    .then((data) => (meals = data.meals));
  // console.log(meals);
}

// On déclare une fonction async pour aller récupérer le fichier trad.json et ses valeurs.
// Le terme data.ingredients fait référence aux datas de la variable "ingredients" du fichier trad.json.
async function tradIngredient() {
  await fetch("trad.json")
    .then((res) => res.json())
    .then((data) => (ingredientsTrad = data.ingredients));
  // console.log((ingredientsTrad));
  return ingredientsTrad;
}

// Comme l'API fonctionne en anglais, on déclare une fonction qui permet de traduire ce qui a été tapé dans l'input. Avec une boucle for, on parcourt le tableau "ingredients" récupéré dans le fichier trad.json.
// Dans cette boucle, avec un if, on met en place la condition que name soit ingredientOfInput, la valeur tapée dans l'input en français.
// Ensuite, on vérifie si cette valeur fait partie de du tableau d'objet "ingredients". Si c'est le cas, on assigne cette valeur à l'input afin de pouvoir valider la recherche de recette.
async function traduction() {
  await tradIngredient();
  for (let i = 0; i <= ingredientsTrad.length; i++) {
    // console.log(ingredientsTrad[i]);
    for (const name in ingredientsTrad[i]) {
      if (name === ingredientOfInput) {
        if (ingredientsTrad[i].hasOwnProperty(name)) {
          let valueTrad = [];
          valueTrad.push(ingredientsTrad[i][name]);
          input.value = valueTrad[0];
          console.log(input.value);

          //     console.log(input.textContent);
        } else {
          result.innerHTML = "<h3>Veuillez rentrer un autre nom d'aliment</h3>";
        }
      }
    }
  }
}
// console.log((ingredientsTrad));
// tradIngredient();
// console.log(ingredientsTrad)
// traduction();

// Avec cette fonction malsDisplay, on s'occupe de l'affichage des "res" du fetch, plus précisément des recettes.
// Avec meals.length, on détermine le nombre de recettes maximum à afficher par "res".
function mealsDisplay() {
  if (meals === null) {
    result.innerHTML =
      "<h2>Aucun réultat<br>Veuillez entrer le nom d'un aliment pour découvrir nos recettes</h2>";
  } else {
    // meals.length = 12;
    result.innerHTML = meals
      .map((meal) => {
        // On met des accolades dans la fonction map() pour introduire les éléments sur différentes lignes. Sans ces accolades , c'est comme si tout était mis bout à bout.
        // Important, dans ce cas là, le terme "return" est obligatoire  avant les backtits (guillemet de la touche 7 + altGr) suivis de la liste des éléments.

        // On déclare une variable "ingredients" à laquelle on assigne un tableau vide pour stocker les valeurs récupérées par la boucle for.
        let ingredients = [];

        for (let i = 1; i < 21; i++) {
          if (meal[`strIngredient${i}`]) {
            let ingredient = meal[`strIngredient${i}`];
            let measure = meal[`strMeasure${i}`];
            // Ici, on utilise pas le "." pour concaténer et rentrer dans l'objet meal pour avoir une concaténation dynamique et ainsi insérer le ${i} et changer le nombre i, en lien avec l'index.
            ingredients.push(`<li>${ingredient} -  ${measure}</li>`);
            // on utilise la méthode push() pour ajouter au tableau ingredients les valeurs récupérées.
          }
        }

        console.log(ingredients);

        return `
        <li class="card">
        <h2>${meal.strMeal}</h2>
        <p>${meal.strArea}</p>
        <img src= ${meal.strMealThumb} alt="Photo ${meal.strMeal}">
        <ul>${ingredients.join("")}</ul>
        </li>
        `;
      })
      .join(" ");
    // le méthode .join(" ") permet d'éviter l'apparition par défault d'une virgule entre chaque élément. Ici, on la remplace par un espace.
  }
}

button.addEventListener("click", (e) => {
  // On insère e.preventDefault() pour éviter que la page se recharge à la valdation du formulaire.
  e.preventDefault();
  traduction();
  tradIngredient();
  fetchMeals(input.value);
  mealsDisplay();
  form.input.value = ""
}
);
  
 
