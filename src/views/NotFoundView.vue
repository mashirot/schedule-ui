<template>
    <div class="creative-404">
        <h1>404</h1>
        <p>Oops! The page you are looking for doesn't exist. </p>
        <router-link to="/">Back to Home</router-link>
    </div>
</template>
  
<style scoped>
.creative-404 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    text-align: center;
    background-color: #fff;
    color: #333;
}

h1 {
    font-size: 10rem;
    margin-bottom: 2rem;
    color: #fda0a0;
}

p {
    font-size: 2rem;
    margin-bottom: 4rem;
}

router-link {
    background-color: #fda0a0;
    color: #fff;
    padding: 1rem 2rem;
    border-radius: 5px;
    text-decoration: none;
    transition: all 0.3s ease;
}

router-link:hover {
    background-color: #fb5d5d;
}
</style>
  