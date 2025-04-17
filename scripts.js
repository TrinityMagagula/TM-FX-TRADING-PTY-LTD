
    document.getElementById('contact-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        if (name && email && message) {
            alert('Thank you for contacting us, ' + name + '. We will get back to you shortly.');
            document.getElementById('contact-form').reset();
        } else {
            alert('Please fill in all fields before submitting.');
        }
    });



    // Handle login button click
    document.getElementById('login-button').onclick = function() {
        document.getElementById('login').style.display = 'block';
    };

    // toggle menu button //
    
    function toggleMenu() {
        const navLinks = document.getElementById('nav-links');
        navLinks.classList.toggle('show');
    }

    // Handle login form submission
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const loginEmail = document.getElementById('login-email').value;
        const loginPassword = document.getElementById('login-password').value;

        if (loginEmail && loginPassword) {
            alert('Login successful for ' + loginEmail);
            // Redirect to membership page
            window.location.href = 'membership.html'; // Replace with actual membership page URL
        } else {
            alert('Please fill in all fields before logging in.');
        }
    });



    // Sign up page//


    
    // Handle sign-up button click
    document.getElementById('sign-up-button').onclick = function() {
        window.location.href = 'signup.html'; // Replace with actual sign-up page URL
    };


    document.getElementById('signup-form').addEventListener('input', validateForm);

function validateForm() {
    const name = document.getElementById('name').value.trim();
    const surname = document.getElementById('surname').value.trim();
    const birthdate = document.getElementById('birthdate').value;
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const passwordError = document.getElementById('password-error');
    const signupBtn = document.getElementById('signup-btn');

    // Validate age
    const age = calculateAge(new Date(birthdate));
    if (age < 18) {
        passwordError.textContent = "You must be at least 18 years old to sign up.";
        passwordError.style.display = "block";
        signupBtn.style.display = "none";
        return;
    }

    // Validate password criteria
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        passwordError.textContent = "Password must be at least 8 characters, include 1 uppercase, 1 lowercase, 1 number, and 1 symbol.";
        passwordError.style.display = "block";
        signupBtn.style.display = "none";
        return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        passwordError.textContent = "Passwords do not match.";
        passwordError.style.display = "block";
        signupBtn.style.display = "none";
        return;
    }

    // Show the sign-up button and hide error if all conditions are met
    passwordError.style.display = "none";
    signupBtn.style.display = "inline-block";
}

function calculateAge(birthDate) {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

// Handle sign-up button click
document.getElementById('signup-btn').addEventListener('click', function () {
    alert('You have successfully signed up!');
    window.location.href = 'login.html';
});
