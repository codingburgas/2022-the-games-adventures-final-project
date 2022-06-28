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

/*switch between dark and light mode*/

const toggle = document.getElementById('toggleDark');
const body = document.querySelector('body');

const KNTaligadzhiev19 = document.getElementById('KNTaligadzhiev19');
const MVMartinov19 = document.getElementById('MVMartinov19');
const IIDadakov20 = document.getElementById('IIDadakov20');
const INMichevska20 = document.getElementById('INMichevska20');
const RIPetkov20 = document.getElementById('RIPetkov20');
const BSBadalova21 = document.getElementById('BSBadalova21');
const SPGeorgieva21 = document.getElementById('SPGeorgieva21');
const DDPeev21 = document.getElementById('DDPeev21');

toggle.addEventListener('click', function() {
    this.classList.toggle('bi-moon');
    if(this.classList.toggle('bi-brightness-high-fill')) {
        body.style.background = 'white';
        body.style.color = 'black';
        KNTaligadzhiev19.style.color = 'black';
        MVMartinov19.style.color = 'black';
        IIDadakov20.style.color = 'black';
        INMichevska20.style.color = 'black';
        RIPetkov20.style.color = 'black';
        BSBadalova21.style.color = 'black';
        SPGeorgieva21.style.color = 'black';
        DDPeev21.style.color = 'black';
        body.style.transition = '1s';
    } else {
        body.style.background = 'black';
        body.style.color = 'white';
        KNTaligadzhiev19.style.color = 'white';
        MVMartinov19.style.color = 'white';
        IIDadakov20.style.color = 'white';
        INMichevska20.style.color = 'white';
        RIPetkov20.style.color = 'white';
        BSBadalova21.style.color = 'white';
        SPGeorgieva21.style.color = 'white';
        DDPeev21.style.color = 'white';
        body.style.transition = '1s';
    }
});

navSlide();

//Back To Top arrow
const toTop = document.querySelector(".to-top");

window.addEventListener("scroll", () => {
    if(window.pageYOffset > 100)
    {
        toTop.classList.add("active");
    }
    else
    {
        toTop.classList.remove("active");
    }
})