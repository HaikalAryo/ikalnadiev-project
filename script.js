const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');
const mealcategory = document.querySelector('meal-category');

// event listeners
searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});


// get meal list that matches with the ingredients
function getMealList(){
    let searchInputTxt = document.getElementById('search-input').value.trim();
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
    .then(response => response.json())
    .then(data => {
        let html = "";
        if(data.meals){
            data.meals.forEach(meal => {
                html += `
               
                <div class="col">
                    <div class="card m-3" data-id = "${meal.idMeal}">
                        <img src="${meal.strMealThumb}" class="card-img-top" alt="food">
                        <div class="card-body">
                            <h5 class="card-title">${meal.strMeal}</h5>
                        </div>
                        <div class="mb-5 d-flex justify-content-around">
                            <button class="btn btn-primary">Get Recipe</button>
                        </div>
                    </div>
                </div>
              
                `;
            });
            mealList.classList.remove('notFound');
        } else{
            html = "Sorry, we didn't find any meal!";
            mealList.classList.add('notFound');
        }

        mealList.innerHTML = html;
    });
}


// get recipe of the meal
function getMealRecipe(e){
    e.preventDefault();
    if(e.target.classList.contains('btn')){
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
        .then(response => response.json())
        .then(data => mealRecipeModal(data.meals));
    }
}

// create a modal
function mealRecipeModal(meal){
    console.log(meal);
    meal = meal[0];
    let html = `
        <h2 class = "recipe-title">${meal.strMeal}</h2>
        <p class = "recipe-category">${meal.strCategory}</p>
        <div class = "recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class = "recipe-meal-img">
            <img src = "${meal.strMealThumb}" alt = "">
        </div>
        <div class = "recipe-link">
            <a href = "${meal.strYoutube}" target = "_blank">Watch Video</a>
        </div>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}

//list all meal categories
document.addEventListener("DOMContentLoaded", function() {
    // Ambil elemen dengan id 'mealcategory'
    const mealcategory = document.getElementById('mealcategory');

    // Lakukan fetch untuk mendapatkan data kategori makanan
    fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
    .then(response => response.json())
    .then(data => {
        if(data.categories){
            // Jika data kategori ada, buat string HTML untuk setiap kategori
            let html = '';
            data.categories.forEach(category => {
                html += `
                <div class="card m-3" data-id="${category.idCategory}">
                    <img src="${category.strCategoryThumb}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title text-center">${category.strCategory}</h5>
                    </div>
                    <div class="mb-5 d-flex justify-content-around">
                        <button class="btn btn-primary">See All</button>
                    </div>
                </div>`;
            });
            // Setel HTML yang dibuat ke dalam elemen 'mealcategory'
            mealcategory.innerHTML = html;
        } else {
            console.log("Failed to fetch meal categories.");
        }
    })
    .catch(error => {
        console.error('Error fetching meal categories:', error);
        // Tangani kesalahan fetch di sini
    });
});