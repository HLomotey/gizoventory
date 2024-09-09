document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link:not([href="./index.html"])');
    const toggleSwitch = document.getElementById('keepLoggedIn');
    const loginButton = document.getElementById('loginButton');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loggedInUserSpan = document.getElementById('loggedInUser');
    const userRoleSpan = document.getElementById('userRole');
    const loginTimeSpan = document.getElementById('loginTime');
    const loginCredentials = document.querySelector('.login-credentials');
    const statusDiv = document.querySelector('.status');
    const navMenu = document.getElementById('navMenu');
  
    function toggleNavLinks(show) {
      navLinks.forEach(link => {
        link.style.display = show ? 'inline-block' : 'none';
      });
    }
  
    function updateLoginInfo(username, isLoggedIn) {
      loggedInUserSpan.textContent = isLoggedIn ? username : 'Not logged in';
      userRoleSpan.textContent = isLoggedIn ? 'User' : 'Guest';
      loginTimeSpan.textContent = isLoggedIn ? new Date().toLocaleString() : 'N/A';
    }
  
    function setLoginState(isLoggedIn, username) {
      sessionStorage.setItem('isLoggedIn', isLoggedIn);
      sessionStorage.setItem('username', username || '');
      sessionStorage.setItem('loginTime', isLoggedIn ? new Date().toLocaleString() : '');
    }
  
    function toggleLoginCredentials(show) {
      loginCredentials.style.display = show ? 'block' : 'none';
      statusDiv.style.display = 'block'; // Always show status div
    }
  
    function checkLoginState() {
      const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
      const username = sessionStorage.getItem('username');
      const loginTime = sessionStorage.getItem('loginTime');
  
      toggleSwitch.checked = isLoggedIn;
      toggleNavLinks(isLoggedIn);
      updateLoginInfo(username, isLoggedIn);
      toggleLoginCredentials(!isLoggedIn);
  
      if (isLoggedIn) {
        loginTimeSpan.textContent = loginTime;
      }
    }
  
    // Initial state
    checkLoginState();
  
    loginButton.addEventListener('click', function() {
      if (usernameInput.value === 'Respuzy' && passwordInput.value === 'Password') {
        setLoginState(true, usernameInput.value);
        checkLoginState();
        usernameInput.value = '';
        passwordInput.value = '';
        document.getElementById('status-text').textContent = 'User SignedIn';
      } else {
        alert('Invalid username or password');
      }
    });
  
    toggleSwitch.addEventListener('change', function() {
      if (this.checked) {
        if (sessionStorage.getItem('isLoggedIn') !== 'true') {
          this.checked = false;
          alert('Please log in first');
        }
      } else {
        setLoginState(false);
        checkLoginState();
        usernameInput.value = '';
        passwordInput.value = '';
        document.getElementById('status-text').textContent = 'User SignedOut';
      }
    });
  
    navMenu.addEventListener('click', function(event) {
      if (event.target.tagName === 'A') {
        const activeLink = navMenu.querySelector('.nav-link.active');
        if (activeLink) {
          activeLink.classList.remove('active');
        }
        event.target.classList.add('active');
      }
    });
  });