// ==========================================
// 🦶 Mudalali Mama - Footer Component
// ==========================================

import { db, publicDataPath, collection, getDoc, doc, onSnapshot } from '../config/firebase.js';

export async function loadFooter(containerId = 'main-footer') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <footer class="bg-gray-900 text-gray-300 pt-16 pb-8">
            <div class="container mx-auto px-4">
                
                <!-- Newsletter Section -->
                <div class="bg-mudalali-green-dark p-8 rounded-lg -mt-24 mb-16 relative z-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h3 class="text-2xl font-bold text-white mb-1">Join Our Community</h3>
                        <p class="text-green-100">Get latest offers and updates directly to your inbox.</p>
                    </div>
                    <form class="flex w-full max-w-md gap-2" onsubmit="event.preventDefault(); alert('Subscribed!');">
                        <input type="email" placeholder="Your Email Address" class="w-full px-4 py-3 rounded-md text-gray-900 focus:outline-none" required>
                        <button type="submit" class="bg-white text-mudalali-green-dark px-6 py-3 rounded-md font-bold hover:bg-gray-100 transition">
                            Subscribe
                        </button>
                    </form>
                </div>

                <!-- Links Grid -->
                <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
                    <div>
                        <h4 class="font-bold text-white mb-4 uppercase tracking-wider">Mudalali Mama</h4>
                        <ul id="footer-col-tsmgroup" class="space-y-2 text-sm">
                            <li><span class="animate-pulse">Loading...</span></li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="font-bold text-white mb-4 uppercase tracking-wider">Information</h4>
                        <ul id="footer-col-info" class="space-y-2 text-sm"></ul>
                    </div>
                    <div>
                        <h4 class="font-bold text-white mb-4 uppercase tracking-wider">Quick Links</h4>
                        <ul id="footer-col-quicklinks" class="space-y-2 text-sm"></ul>
                    </div>
                    
                    <div class="col-span-2 lg:col-span-2">
                        <h4 class="font-bold text-white mb-4 uppercase tracking-wider">Contact Us</h4>
                        <div class="text-sm space-y-3">
                            <p class="flex items-start gap-3">
                                <i class="fa fa-map-marker-alt mt-1 text-mudalali-green"></i>
                                <span id="footer-address">Loading address...</span>
                            </p>
                            <p class="flex items-center gap-3">
                                <i class="fa fa-envelope text-mudalali-green"></i>
                                <a id="footer-email" href="#" class="hover:text-white transition">...</a>
                            </p>
                            <p class="flex items-center gap-3">
                                <i class="fa fa-phone text-mudalali-green"></i>
                                <a id="footer-hotline-link" href="#" class="hover:text-white transition font-bold text-lg">...</a>
                            </p>
                        </div>

                        <div class="mt-6">
                            <h5 class="font-bold text-white mb-3 text-sm">Follow Us</h5>
                            <div id="footer-socials" class="flex space-x-3">
                                <!-- Social Icons Injected Here -->
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Bottom Bar -->
                <div class="border-t border-gray-800 pt-8 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
                    <p>&copy; 2025 Mudalali Mama. All Rights Reserved.</p>
                    <div class="flex items-center gap-4">
                        <img src="https://i.ibb.co/fDYrL3g/visa.png" class="h-6 opacity-70 hover:opacity-100 transition">
                        <img src="https://i.ibb.co/7rmXz4F/mastercard.png" class="h-6 opacity-70 hover:opacity-100 transition">
                        <img src="https://i.ibb.co/C0W2LFr/amex.png" class="h-6 opacity-70 hover:opacity-100 transition">
                    </div>
                </div>
            </div>
        </footer>
    `;

    // Load Dynamic Data
    fetchFooterData();
}

async function fetchFooterData() {
    // 1. Contact Info
    try {
        const contactSnap = await getDoc(doc(db, publicDataPath, 'siteContent', 'footerContact'));
        if (contactSnap.exists()) {
            const data = contactSnap.data();
            document.getElementById('footer-address').textContent = data.address || 'Colombo, Sri Lanka';
            const emailLink = document.getElementById('footer-email');
            emailLink.textContent = data.email || 'support@mudalali.lk';
            emailLink.href = `mailto:${data.email}`;
            
            const phoneLink = document.getElementById('footer-hotline-link');
            phoneLink.textContent = data.hotline || '+94 11 234 5678';
            phoneLink.href = `tel:${data.hotline}`;

            const socialContainer = document.getElementById('footer-socials');
            let socialHtml = '';
            if(data.facebookUrl) socialHtml += `<a href="${data.facebookUrl}" class="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#1877F2] transition text-white"><i class="fab fa-facebook-f"></i></a>`;
            if(data.instagramUrl) socialHtml += `<a href="${data.instagramUrl}" class="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#E4405F] transition text-white"><i class="fab fa-instagram"></i></a>`;
            if(data.youtubeUrl) socialHtml += `<a href="${data.youtubeUrl}" class="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#FF0000] transition text-white"><i class="fab fa-youtube"></i></a>`;
            socialContainer.innerHTML = socialHtml;
        }
    } catch (e) { console.error("Footer contact error", e); }

    // 2. Footer Links (Real-time)
    const linksRef = collection(db, publicDataPath, 'footerLinks');
    onSnapshot(linksRef, (snapshot) => {
        const cols = {
            col_tsmgroup: document.getElementById('footer-col-tsmgroup'),
            col_info: document.getElementById('footer-col-info'),
            col_quicklinks: document.getElementById('footer-col-quicklinks')
        };
        
        // Clear current lists
        Object.values(cols).forEach(el => { if(el) el.innerHTML = ''; });

        snapshot.forEach(doc => {
            const link = doc.data();
            if (cols[link.column]) {
                cols[link.column].innerHTML += `<li><a href="${link.url}" class="hover:text-mudalali-green transition-colors duration-200">${link.text}</a></li>`;
            }
        });
    });
}