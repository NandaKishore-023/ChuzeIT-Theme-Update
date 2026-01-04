 // --- Firebase Setup and Initialization ---

        import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";

        import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

        import { getFirestore, collection, addDoc, setLogLevel } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";



        // Set Firebase logging level to Debug (optional, but good for diagnostics)

        setLogLevel('Debug');



        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

        const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');

        const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;



        let db;

        let auth;

        let userId = null;



        const authStatusEl = document.getElementById('auth-status');

        const userIdDisplayEl = document.getElementById('user-id-display');

        const formStatusEl = document.getElementById('formStatus');

        const submitButton = document.getElementById('submitButton');

        const inquiryForm = document.getElementById('inquiryForm');



        if (Object.keys(firebaseConfig).length > 0) {

            const app = initializeApp(firebaseConfig);

            db = getFirestore(app);

            auth = getAuth(app);



            // Handle user authentication

            onAuthStateChanged(auth, async (user) => {

                if (user) {

                    userId = user.uid;

                    authStatusEl.textContent = 'Status: Authenticated';

                    userIdDisplayEl.textContent = `User ID: ${userId}`;

                } else {

                    // Sign in using custom token or anonymously

                    try {

                        let userCredential;

                        if (initialAuthToken) {

                            userCredential = await signInWithCustomToken(auth, initialAuthToken);

                            console.log("Signed in with custom token.");

                        } else {

                            userCredential = await signInAnonymously(auth);

                            console.log("Signed in anonymously.");

                        }

                        userId = userCredential.user.uid;

                        authStatusEl.textContent = 'Status: Active (Anon)';

                        userIdDisplayEl.textContent = `User ID: ${userId}`;

                    } catch (error) {

                        console.error("Firebase Auth Error:", error);

                        authStatusEl.textContent = 'Status: Auth Failed';

                        userIdDisplayEl.textContent = 'User ID: N/A';

                    }

                }

            });



        } else {

            authStatusEl.textContent = 'Status: Firebase Config Missing';

            console.error("Firebase config is missing.");

        }



        /**

         * Utility to get user's geographic coordinates.

         * @returns {Promise<{latitude: number, longitude: number, accuracy: number} | null>}

         */

        function getGeolocation() {

            return new Promise((resolve) => {

                if (!navigator.geolocation) {

                    console.warn("Geolocation is not supported by this browser.");

                    return resolve(null);

                }



                // Timeout after 5 seconds

                const options = { enableHighAccuracy: false, timeout: 5000, maximumAge: 0 };



                navigator.geolocation.getCurrentPosition(

                    (position) => {

                        console.log("Geolocation successful.");

                        resolve({

                            latitude: position.coords.latitude,

                            longitude: position.coords.longitude,

                            accuracy: position.coords.accuracy,

                        });

                    },

                    (error) => {

                        console.warn(`Geolocation failed: ${error.message}`);

                        // 1: Permission denied, 2: Position unavailable, 3: Timeout

                        resolve(null);

                    },

                    options

                );

            });

        }



        /**

         * Displays a status message to the user.

         * @param {string} message - The message content.

         * @param {string} type - 'success', 'error', or 'loading'.

         */

        function showStatus(message, type) {

            formStatusEl.textContent = message;

            // Note: Keeping standard status colors (blue for loading, green/red for status)

            // for clarity, while ensuring the submit button matches the theme.

            formStatusEl.className = 'p-4 text-sm rounded-lg mt-4'; // Reset classes

            formStatusEl.classList.remove('hidden');



            if (type === 'loading') {

                formStatusEl.classList.add('bg-blue-100', 'text-blue-800');

                submitButton.disabled = true;

                submitButton.innerHTML = `<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Sending...`;

                submitButton.classList.remove('bg-red-500', 'hover:bg-red-700');

                submitButton.classList.add('gradient-bg'); // Keep the theme colors

            } else if (type === 'success') {

                formStatusEl.classList.add('bg-green-100', 'text-green-800');

                submitButton.disabled = false;

                submitButton.innerHTML = 'Submit Inquiry';

                submitButton.classList.add('gradient-bg');

            } else if (type === 'error') {

                formStatusEl.classList.add('bg-red-100', 'text-red-800');

                submitButton.disabled = false;

                submitButton.innerHTML = 'Submit Inquiry';

                submitButton.classList.add('gradient-bg');

            }

        }



    inquiryForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(inquiryForm);

        try {
            const response = await fetch("https://formspree.io/f/xanpljqj", {
                method: "POST",
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                showStatus('✅ Message sent successfully! We’ll get back to you soon.', 'success');
                inquiryForm.reset();
            } else {
                showStatus('❌ Failed to send. Please try again later.', 'error');
            }
        } catch (error) {
            console.error("Formspree Error:", error);
            showStatus(`❌ Network error: ${error.message}`, 'error');
        }
    });




 document.addEventListener('DOMContentLoaded', () => {
            const menuButton = document.getElementById('mobile-menu-button');
            const mobileMenu = document.getElementById('mobile-menu');

            if (!menuButton || !mobileMenu) return;

            menuButton.addEventListener('click', () => {
                // Toggle menu visibility
                mobileMenu.classList.toggle('hidden');

                // Toggle icon (hamburger ↔ close)
                const icon = menuButton.querySelector('svg');
                const isOpen = !mobileMenu.classList.contains('hidden');

                icon.innerHTML = isOpen
                    ? `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                     d="M6 18L18 6M6 6l12 12" />`  // close icon
                    : `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                     d="M4 6h16M4 12h16m-7 6h7" />`; // hamburger
            });
        });


// Grab elements
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = mobileMenu.querySelectorAll('a');

// Toggle menu on hamburger click
mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Close menu when any link is clicked
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});
























// // Cards animation
// const observer = new IntersectionObserver((entries) => {
//     entries.forEach(entry => {
//         if (entry.isIntersecting) {
//             entry.target.style.animation = "slideUpFade 0.8s ease-out forwards";
//             observer.unobserve(entry.target); // This makes it happen ONLY ONCE
//         }
//     });
// }, { threshold: 0.1 });

// document.querySelectorAll('.autoShow').forEach(card => observer.observe(card));


 