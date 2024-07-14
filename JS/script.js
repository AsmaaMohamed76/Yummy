// ? get ready function
$(function() {
    showLoader();
    sideNav();
    getMeals().then(() => {
        hideLoader();
        $('#content').fadeIn();
        $('body').css('overflow', 'visible');
    });
});
// ? <----  LOADER  ---->  
// ^ show loader function
function showLoader() {
    $('.loading').fadeIn(1000);
    $('body').css('overflow', 'hidden');
}
// ^ hide loader function
function hideLoader() {
    $('.loading').fadeOut(500);
    $('body').css('overflow', 'visible');
}

// ? <----  SIDE NAVBAR  ---->  
function sideNav() {
    document.getElementById('toggleNav').addEventListener('click', toggleNavList);
    document.querySelectorAll('.links li').forEach((li) => {
        li.addEventListener('click', closeNavList);
    });
}

function toggleNavList() {
    const navList = document.getElementById('navList');
    if (navList.style.left === '0px') {
        closeNavList();
    } else {
        openNavList();
    }
}

function closeNavList() {
    const navList = document.getElementById('navList');
    navList.style.left = '-16%';
    document.querySelector('.open-close-icon').classList.add('fa-align-justify');
    document.querySelector('.open-close-icon').classList.remove('fa-x');
    document.querySelectorAll('.links li').forEach((li) => {
        li.classList.remove('show');
    });
}

function openNavList() {
    const navList = document.getElementById('navList');
    navList.style.left = '0';
    document.querySelector('.open-close-icon').classList.remove('fa-align-justify');
    document.querySelector('.open-close-icon').classList.add('fa-x');
    document.querySelectorAll('.links li').forEach((li, index) => {
        setTimeout(() => {
            li.classList.add('show');
        }, (index + 5) * 100);
    });
}

document.getElementById("search").addEventListener("click", function () {
    showSearchInputs(); 
});

document.getElementById("Categories").addEventListener("click", function () {
    getCategory(); 
});

document.getElementById("Area").addEventListener("click", function () {
    getArea(); 
});
document.getElementById("Ingredients").addEventListener("click", function () {
    getIngredients(); 
});
document.getElementById("Contacts").addEventListener("click", function () {
    showContacts(); 
});



// ? <----  MAIN PAGE  ---->  
//! Get Meals data for  the first page
async function getMeals() {
    showLoader();
    const response = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=");
    const data = await response.json();
    if (data.meals) {
        displayMeals(data.meals);
    } else {
        console.error("No Meals Found.");
    }

    hideLoader();
}

//^ Display Meals data
function displayMeals(meals) {
    let cartona = "";
    for (let i = 0; i < meals.length; i++) {
        const meal = meals[i];
        cartona += `
            <div class="col-md-3 rounded-2">
                <div class="inner rounded-2 position-relative overflow-hidden" onclick="getMealDetails(${meal.idMeal})">
                    <img class="w-100 rounded-2" src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <div class="layer d-flex align-items-center position-absolute p-2 text-black">
                        ${meal.strMeal}
                    </div>
                </div>
            </div>
        `;
    }

    document.getElementById("data").innerHTML = cartona;
}

//? get meals deatails data when click on one meal
async function getMealDetails(mealId) {
    showLoader();
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
    const data = await response.json();
    if (data.meals && data.meals.length > 0) {
        const meal = data.meals[0];
        displayMeal(meal);
    } else {
        console.error("No Meal Details Found");
    }

    hideLoader();
}

//^ display meals deatails data when click on one meal
function displayMeal(meal) {
    let ingredients = '';
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient) {
            ingredients += `<li class="alert alert-info m-2 p-1">${measure} ${ingredient}</li>`;
        } else {
            break; 
        }
    }
    let tags = '';
    if (meal.strTags) {
        const tagArray = meal.strTags.split(",");
        for (const tag of tagArray) {
            tags += `<li class="alert alert-danger m-2 p-1">${tag}</li>`;
        }
    }

    const cartona = `
        <div class="col-md-4 mt-5">
            <img class="w-100 rounded-2" src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h2>${meal.strMeal}</h2>
        </div>
        <div class="col-md-8 mt-5">
            <h2>Instructions</h2>
            <p>${meal.strInstructions}</p>
            <div><h3><span class="fw-bolder">Area :</span> ${meal.strArea}</h3></div>
            <div><h3><span class="fw-bolder">Category :</span> ${meal.strCategory}</h3></div>
            <div><h3>Recipes :</h3>
                <ul class="d-flex g-3 flex-wrap list-unstyled">${ingredients}</ul>
            </div>
            <div><h2>Tags:</h2></div>
            <ul class="d-flex g-3 flex-wrap list-unstyled">${tags}</ul>
            <a target="_blank" class="btn btn-success" href="${meal.strSource}">Source</a>
            <a target="_blank" class="btn btn-danger" href="${meal.strYoutube}">YouTube</a>
        </div>
    `;
    document.getElementById("data").innerHTML = cartona;

}


// ? <----  SEARCH  ---->  
function showSearchInputs() {
    const cartona = `
        <div class="container w-75" id="searchPage">
            <div class="row py-4">
                <div class="col-md-6">
                    <input id="searchName" onkeyup="searchByName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
                </div>
                <div class="col-md-6">
                    <input id="letter" onkeyup="searchByFLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
                </div>
            </div>
        </div>
        <div class="container">
            <div id="searchResult" class="row searchName py-4 g-4"></div>
        </div>
    `;
    document.getElementById("data").innerHTML = cartona;
}


//^ search by meal name
async function searchByName(searchName) {
    showLoader();
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchName}`);
    const data = await response.json();
    if (data.meals) {
        displaySearchResults(data.meals);
    } else {
        document.getElementById("searchResult").innerHTML = "No results found.";
    }
    hideLoader();
}

// ^search by meals first letter
async function searchByFLetter(letter) {
    if (!letter) return;
    showLoader();
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
    const data = await response.json();
    if (data.meals) {
        displaySearchResults(data.meals);
    } else {
        document.getElementById("searchResult").innerHTML = "No results found.";
    }
    hideLoader();
}

//? display the search result
function displaySearchResults(meals) {
    let cartona = "";
    for (let i = 0; i < meals.length; i++) {
        const meal = meals[i];
        cartona += `
            <div class="col-md-3 rounded-2">
                <div class="inner rounded-2 position-relative overflow-hidden" onclick="getMealDetails(${meal.idMeal})">
                    <img class="w-100 rounded-2" src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <div class="layer d-flex align-items-center position-absolute p-2 text-black">
                        ${meal.strMeal}
                    </div>
                </div>
            </div>
        `;
    }
    document.getElementById("searchResult").innerHTML = cartona;
}


// ? <----  CATEGORY  ---->  
// ^Get category data
async function getCategory() {
    showLoader();
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
    const data = await response.json();
    
    if (data.categories) {
        displayCategories(data.categories);
    } else {
        console.error("No categories Found.");
    }
    hideLoader();
}

//? display category data
function displayCategories(cate) {
    let cartona = "";
    for (let i = 0; i < cate.length; i++) {
        cartona += `
            <div class="col-md-3">
                <div onclick="getCategoryMeals('${cate[i].strCategory}')" class="inner position-relative rounded-2 overflow-hidden ">
                    <img class="w-100" src="${cate[i].strCategoryThumb}" alt="" srcset="">
                    <div class="layer position-absolute text-center text-black p-2">
                        <h3>${cate[i].strCategory}</h3>
                        <p class="f-16">${cate[i].strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
                    </div>
                </div>
            </div>
        `;
    }

    document.getElementById("data").innerHTML = cartona;
}

// ^get the meals of the selected category
async function getCategoryMeals(category){
    showLoader();
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    const data = await response.json();
    
    if (data.meals) {  
        displayMeals(data.meals.slice(0,20));
    } else {
        console.error("No meals found for the category:", category);
    }
    hideLoader();
}



// ? <----  AREA  ---->  
//^ get the area data 
async function getArea() {
    showLoader();
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
    const data = await response.json();
    
    if (data.meals) {
        displayArea(data.meals);
    } else {
        console.error("No Areas Found.");
    }
    hideLoader();
}

//? diaplay area data
function displayArea(area){
    let cartona = "";
    for (let i = 0; i < area.length; i++) {
        cartona += `
            <div class="col-md-3">
                <div onclick="getAreaMeals('${area[i].strArea}')" class="inner position-relative text-center rounded-2 ">
                        <i class =" fa-solid fa-house-laptop fa-4x"></i>
                        <h3>${area[i].strArea}</h3>
                </div>
            </div>
        `;
    }

    document.getElementById("data").innerHTML = cartona;
}

// ^get the meals of the selected area
async function getAreaMeals(area){
    showLoader();
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
    const data = await response.json();
    
    if (data.meals) {  
        displayMeals(data.meals.slice(0,20));
    } else {
        console.error("No meals found for the category:", area);
    }
    hideLoader();
}


// ? <----  INGREDIENT  ---->  
// ^get the ingredient data
async function getIngredients() {
    showLoader();
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
    const data = await response.json();
    
    if (data.meals) {
        displayIngredients(data.meals.slice(0,20));
    } else {
        console.error("No Ingredients Found.");
    }
    hideLoader();
}

//? display the ingredients data
function displayIngredients(ing){
    let cartona = "";
    for (let i = 0; i < ing.length; i++) {
        cartona += `
            <div class="col-md-3">
                <div onclick="getIngredientsMeals('${ing[i].strIngredient}')" class="inner position-relative text-center rounded-2 ">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${ing[i].strIngredient}</h3>
                        <p class="f-16">${ing[i].strDescription.split(" ").slice(0, 20).join(" ")}</p>

                </div>
            </div>
        `;
    }

    document.getElementById("data").innerHTML = cartona;
}


// ^get the meals of the selected ingredients

async function getIngredientsMeals(ingredients){
    showLoader();
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`);
    const data = await response.json();
    
    if (data.meals) {  
        displayMeals(data.meals.slice(0,20));
    } else {
        console.error("No meals found for the category:", ingredients);
    }
    hideLoader();
}


// ?    CONTACT US
// ! contact us structure
function showContacts(){
    const cartona =`
    <div class="contact min-vh-100 d-flex justify-content-center align-items-center">
        <div class="container w-75 text-center" >
                <div class="row g-4">
                    <div class="col-md-6">
                        <input id="nameInput" onkeyup="inputValidation(this)" class="form-control " type="text" placeholder="Enter Your Name">
                        <div id="nameInputAlert" class="alert alert-danger w-100 mt-2 d-none">
                        Special characters and numbers not allowed
                    </div>
                    </div>
                    <div class="col-md-6">
                        <input id="emailInput" onkeyup="inputValidation(this)" class="form-control " type="email" placeholder="Enter Your Email">
                        <div id="emailInputAlert" class="alert alert-danger w-100 mt-2 d-none">
                        Email not valid *exemple@yyy.zzz
                    </div>
                    </div>
                    <div class="col-md-6">
                        <input id="phoneInput" onkeyup="inputValidation(this)" class="form-control " type="email" placeholder="Enter Your Phone">
                        <div id="phoneInputAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                    </div>
                    </div>
                    <div class="col-md-6">
                        <input id="ageInput" onkeyup="inputValidation(this)" class="form-control " type="number" placeholder="Enter Your Age">
                        <div id="ageInputAlert" class="alert alert-danger w-100 mt-2 d-none">
                        Enter valid age
                    </div>
                    </div>
                    <div class="col-md-6">
                        <input id="passwordInput" onkeyup="inputValidation(this)" class="form-control " type="password" placeholder="Enter Your Password">
                        <div id="passwordInputAlert" class="alert alert-danger w-100 mt-2 d-none">
                        Enter valid password *Minimum eight characters, at least one letter and one number:*
                    </div>
                    </div>
                    <div class="col-md-6">
                        <input id="repasswordInput" onkeyup="inputValidation(this)" class="form-control " type="password" placeholder="Repassword">
                        <div id="repasswordInputAlert" class="alert alert-danger w-100 mt-2 d-none">
                        Enter valid repassword 
                        </div>
            
                    </div>  
                </div>
                <button id="submit" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
            </div>
    </div>
    `;
    document.getElementById("data").innerHTML =cartona;
    check();
}


function check(){
    submit = document.getElementById("submit")
    document.getElementById(nameInput).addEventListener("focus", function(){
        nameInput =true ;
        checkValidation();

    })
    document.getElementById(emailInput).addEventListener("focus", function(){
        emailInput =true ;
        checkValidation();

    })
    document.getElementById(phoneInput).addEventListener("focus", function(){
        phoneInput =true ;
        checkValidation();

    })
    document.getElementById(ageInput).addEventListener("focus", function(){
        ageInput =true ;
        checkValidation();

    })
    document.getElementById(passwordInput).addEventListener("focus", function(){
        passwordInput =true ;
        checkValidation();

    })
    document.getElementById(repasswordInput).addEventListener("focus", function(){
        repasswordInput =true ;
        checkValidation();
    })

}

let nameInputTouched = false;
let emailInputTouched = false;
let phoneInputTouched = false;
let ageInputTouched = false;
let passwordInputTouched = false;
let repasswordInputTouched = false;

// check inputs
 function inputValidation(element){
    regex ={
        nameInput : /^[a-zA-Z ]+$/,
        emailInput : /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        phoneInput : /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
        ageInput : /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/,
        passwordInput : /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/,
        repasswordInput : /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/,
        status : false

    };

    const alertElement = document.getElementById(element.id + "Alert");
    if(regex[element.id].test(element.value)){
        alertElement.classList.add('d-none')
        element.classList.add("is-valid")
        element.classList.remove("is-invalid")
        regex[element.id].status = true
    }else{
        alertElement.classList.remove('d-none')
        element.classList.remove("is-valid")
        element.classList.add("is-invalid")
        regex[element.id].status = false

    }

    switch (element.id) {
        case "nameInput":
            nameInputTouched = true;
            break;
        case "emailInput":
            emailInputTouched = true;
            break;
        case "phoneInput":
            phoneInputTouched = true;
            break;
        case "ageInput":
            ageInputTouched = true;
            break;
        case "passwordInput":
            passwordInputTouched = true;
            break;
        case "repasswordInput":
            repasswordInputTouched = true;
            break;
        default:
            break;
    }
    checkValidition();
 }

// check the validation
 function checkValidition() {
    const isValid = 
        nameInputTouched &&
        emailInputTouched &&
        phoneInputTouched &&
        ageInputTouched &&
        passwordInputTouched &&
        repasswordInputTouched &&
        nameValidation() &&
        emailValidation() &&
        phoneValidation() &&
        ageValidation() &&
        passwordValidation() &&
        repasswordValidation()
    

    document.getElementById("submit").disabled = !isValid;
}

//  validation
 function nameValidation() {
    return regex.nameInput.test(document.getElementById("nameInput").value);
}

function emailValidation() {
    return regex.emailInput.test(document.getElementById("emailInput").value);
}

function phoneValidation() {
    return regex.phoneInput.test(document.getElementById("phoneInput").value);
}

function ageValidation() {
    return regex.ageInput.test(document.getElementById("ageInput").value);
}

function passwordValidation() {
    return regex.passwordInput.test(document.getElementById("passwordInput").value);
}

function repasswordValidation() {
    return regex.repasswordInput.test(document.getElementById("repasswordInput").value);
}



