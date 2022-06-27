/*make Navigation Bar appear when scroll up*/

let lastScrollTop = 0;

navbar = document.getElementById("navbar");
/*function on scrolling*/
window.addEventListener("scroll", function(){
    let scrollTop = this.window.pageYOffset || document.documentElement.scrollTop;

    /*hide navbar if lastScroll is smaller than current Scroll location and show if it is bigger*/
    if(scrollTop > lastScrollTop){
        navbar.style.top = "-80px";
    }
    else
    {
        navbar.style.top = "0";
    }

    lastScrollTop = scrollTop;
})

//Responsive side Navigation Bar
const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        //Toggle Nav
        nav.classList.toggle('nav-active');

        //Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation){   
                link.style.animation = '';
            } else{
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.5}s`;
            }
    
        });
        //Burger Animation
        burger.classList.toggle("toggle");
    });

}

const toggle = document.getElementById('toggleDark');
const body = document.querySelector('html');

toggle.addEventListener('click', function() {
    this.classList.toggle('bi-moon');
    if(this.classList.toggle('bi-brightness-high-fill')) {
        body.style.background = 'white';
        body.style.color = 'black';
        body.style.transition = '2s';
    } else {
        body.style.background = 'black';
        body.style.color = 'white';
        body.style.transition = '2s';
    }
});

navSlide();