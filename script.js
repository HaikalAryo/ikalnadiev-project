$(document).ready(function() {
    const mealList = $("#meal");
    const mealDetailsContent = $(".meal-details-content");
    const recipeCloseBtn = $("#recipe-close-btn");
    const mealcategory = $("#mealcategory");

    // Smooth scrolling untuk navigasi
    $(".nav-link").on("click", function(event) {
        if (this.hash !== "") {
            event.preventDefault();
            let hash = this.hash;
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 800);
        }
    });

    // Event listener untuk pencarian makanan
    $("#search-btn").on("click", function() {
        getMealList();
    });

    // Event listener untuk mendapatkan resep makanan
    mealList.on("click", ".btn", function() {
        let mealItem = $(this).closest(".card");
        getMealRecipe(mealItem.data("id"));
    });

    // Event listener untuk menutup modal
    recipeCloseBtn.on("click", function() {
        mealDetailsContent.parent().removeClass("showRecipe");
    });

    // Fungsi untuk mendapatkan daftar makanan berdasarkan bahan
    function getMealList() {
        let searchInputTxt = $("#search-input").val().trim();
        if (searchInputTxt !== "") {
            $.getJSON(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`, function(data) {
                let html = "";
                if (data.meals) {
                    $.each(data.meals, function(index, meal) {
                        html += `
                            <div class="col">
                                <div class="card m-3" data-id="${meal.idMeal}">
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
                    mealList.removeClass("notFound");
                } else {
                    html = "<p class='text-center'>Sorry, we didn't find any meal!</p>";
                    mealList.addClass("notFound");
                }
                mealList.html(html);
            });
        }
    }

    // Fungsi untuk mendapatkan resep makanan
    function getMealRecipe(mealId) {
        $.getJSON(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`, function(data) {
            if (data.meals) {
                mealRecipeModal(data.meals[0]);
            }
        });
    }

    // Fungsi untuk menampilkan modal resep makanan
    function mealRecipeModal(meal) {
        let html = `
            <h2 class="recipe-title">${meal.strMeal}</h2>
            <p class="recipe-category">${meal.strCategory}</p>
            <div class="recipe-instruct">
                <h3>Instructions:</h3>
                <p>${meal.strInstructions}</p>
            </div>
            <div class="recipe-meal-img">
                <img src="${meal.strMealThumb}" alt="meal">
            </div>
            <div class="recipe-link">
                <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
            </div>
        `;
        mealDetailsContent.html(html);
        mealDetailsContent.parent().addClass("showRecipe");
    }

    // Fetch kategori makanan saat halaman dimuat
    $.getJSON("https://www.themealdb.com/api/json/v1/1/categories.php", function(data) {
        if (data.categories) {
            let html = "";
            $.each(data.categories, function(index, category) {
                html += `
                    <div class="card m-3" data-id="${category.idCategory}">
                        <img src="${category.strCategoryThumb}" class="card-img-top" alt="Category Image">
                        <div class="card-body">
                            <h5 class="card-title text-center">${category.strCategory}</h5>
                        </div>
                        <div class="mb-5 d-flex justify-content-around">
                            <a href="see-all.html" class="btn btn-primary">See All</a>
                        </div>
                    </div>
                `;
            });
            mealcategory.html(html);
        }
    });
});
