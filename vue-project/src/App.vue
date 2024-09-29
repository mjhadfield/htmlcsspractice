<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
// Import any components you need
import { ref } from 'vue'

// Define image paths
const cartImage = ref(new URL('@/assets/images/cart.png', import.meta.url).href)
const logoImage = ref(new URL('@/assets/images/logo.png', import.meta.url).href)
</script>

<template>
    <header>
        <!----------Global Static Divs----------> 
        <div class="site-updates">
            <p class="p2">✨Section for site updates, new products, etc✨<br>💰I need a god damn side hustle💰</p>
        </div>   

        <div class="cart-menu">
            <img src="images/cart.png" width="40" height="40">
        </div>

        <div class="cart-contents">
            <p style="text-align: center;">Your Cart</p>
            <hr class="gradient" width="100%">
            <p>Your cart is currently empty</p>
        </div>

        <!----------Mobile Layout----------> 
        <div class="mobile-logo">
            <img src="images/logo.png" alt="logo">
        </div>

        <div class="hamburger-menu">
            <span></span>
            <span></span>
            <span></span>
        </div>

        <nav class="mobile-navigation">
            <a href="index.html">Home</a>
            <div class="mobile-dropdown">
                <a href="#.html" class="shop-link">Store</a>
                <div class="mobile-dropdown-content">
                    <a href="store.html">Glassware</a>
                    <a href="store.html">Homeware</a>
                    <a href="store.html">Pilsner</a>
                    <a href="store.html">Pale Ale</a>
                    <a href="store.html">Fruit Sours</a>
                    <a href="store.html">Wheat Beers</a>
                    <a href="store.html">Rye Beers</a>
                    <a href="store.html">Session Beers</a>
                </div>
            </div>
            <a href="blog.html">Blog</a>
            <a href="about.html">About</a>
            <a href="contact.html">Contact</a>
        </nav>

        <!----------Desktop Navigation----------> 
        <div class="site-banner">
            <img src="images/logo.png" alt="Logo" class="site-logo">
            <nav class="site-navigation">
                <a href="index.html">Home</a>
                <div class="dropdown">
                    <a href="#">Store</a>
                    <div class="dropdown-content">
                        <a href="store.html">Glassware</a>
                        <a href="store.html">Homeware</a>
                        <a href="store.html">Pilsner</a>
                        <a href="store.html">Pale Ale</a>
                        <a href="store.html">Fruit Sours</a>
                        <a href="store.html">Wheat Beers</a>
                        <a href="store.html">Rye Beers</a>
                        <a href="store.html">Session Beers</a>
                    </div>
                </div>
                <a href="blog.html">Blog</a>
                <a href="about.html">About</a>
                <a href="contact.html">Contact</a>
            </nav>
            <div class="desktop-cart">
                <img src="images/cart.png" alt="Cart" style="height: 40px;">
            </div>              
        </div>
    </header>

    <!----------Main body container----------> 
    <div class="container"><br>
        <h1>Introduction</h1>
        <p>The index just a change log for now, I'll circle back and build one later once the main UI, navigation, and store functions are built.</p>
        <p>Trying to optimise for mobile viewing as I've never done that before. Written in HTML, CSS, and JavaScript using VSCode and a lot of AI help.</p>
        <h1>Change Log</h1>
        <p>29/08/2024 - Quick cleanup of code alignment, created holding pages for each section. Time to work on the store functionality!</p>
        <p>29/08/2024 - The basket slides out and displays properly now, created a gradient divider style based on text highlight colour.</p>
        <p>29/08/2024 - Finished off the desktop navigation to include a logo and basket, so the shell is pretty much complete now. Probably worth adding a copyright footer for completeness.</p>
        <p>29/08/2024 - Added dynamic scaling to the update banner too as this looked shit on some mobile resolutions (Looking at you iPhone 7).</p>
        <p>29/09/2024 - Fixed the dynamic scaling of the top banner for different mobile resolutions and added better handling of the container for desktop viewports.</p> 
        <p>28/09/2024 - Spoke too soon.</p>   
        <p>28/09/2024 - Okay that worked, seems to be behaving again. That's enough for now.</p>
        <p>28/09/2024 - Pushing new version to check the logo alignment in mobile view. Think I've broken the container div...</p>
        <p>27/09/2024 - Probably time to start just writing a changelog for new commits to fill out the page instead of using Lorum Ipsum.</p>
        <p>26/09/2024 - Initial branch created and comitted.</p>
    </div>

    <!----------Footer Section----------> 
    <footer>

    </footer>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
