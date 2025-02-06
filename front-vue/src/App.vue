<template>
  <div class="container">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style>
/* General Styles */
body {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  background-color: #f4f4f4;
  color: #333;
  padding: 20px;
}

.container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

h1, h2, h3 {
  color: #444;
}

/* Form Styles */
form {
  background: white;
  padding: 15px;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

input, textarea {
  width: 100%;
  padding: 8px;
  margin: 5px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: #28a745;
  color: white;
}

button:hover {
  opacity: 0.9;
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    padding: 10px;
  }
  
  .link-actions {
    flex-direction: column;
  }
  
  .link-actions button {
    width: 100%;
  }
}
</style>