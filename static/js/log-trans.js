const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});

function on_load(){
    $(".res-panel").hide()
    
}
function check_Responsive(){
    let $window = $(window);
    let windowsize = $window.width()
    if (windowsize < 620){
        $(".res-panel").show()
    }
    else
    on_load()
}
$(window).resize(()=>{
    check_Responsive()
})