/*make Navigation Bar appear when scroll up*/

let lastScrollTop = 0;

navbar = document.getElementById("navbar");
window.addEventListener("scroll", function(){
    let scrollTop = this.window.pageYOffset || document.documentElement.scrollTop;

    if(scrollTop > lastScrollTop){
        navbar.style.top = "-80px";
    }
    else
    {
        navbar.style.top = "0";
    }

    lastScrollTop = scrollTop;
})