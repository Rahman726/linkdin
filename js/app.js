
        // ===== FIREBASE CONFIGURATION =====
        const firebaseConfig = {
            apiKey: "AIzaSyDummyKeyForDemo-ReplaceWithRealKey",
            authDomain: "linkedin-clone-demo.firebaseapp.com",
            projectId: "linkedin-clone-demo",
            storageBucket: "linkedin-clone-demo.appspot.com",
            messagingSenderId: "1234567890",
            appId: "1:1234567890:web:abcdef123456"
        };
        
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        const auth = firebase.auth();
        const db = firebase.firestore();
        
        // Enable offline persistence
        db.enablePersistence({ synchronizeTabs: true })
            .catch(err => console.log('Persistence error:', err));
        
        // ===== AUTHENTICATION =====
        let currentUser = JSON.parse(localStorage.getItem('linkedin_user')) || null;
        let currentUserId = localStorage.getItem('linkedin_user_id') || null;
        
        // Check if user is already logged in
        document.addEventListener('DOMContentLoaded', () => {
            if (currentUser) {
                showMainApp();
                updateProfileInfo();
            }
        });

        function showLogin() {
            document.getElementById('loginForm').style.display = 'block';
            document.getElementById('signupForm').style.display = 'none';
            document.getElementById('authPage').classList.add('show');
            hideMainApp();
        }

        function showSignup() {
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('signupForm').style.display = 'block';
            document.getElementById('authPage').classList.add('show');
            hideMainApp();
        }

        function showMainApp() {
            document.getElementById('authPage').classList.remove('show');
            document.getElementById('feedPage').style.display = 'grid';
            document.querySelector('.navbar').style.display = 'block';
        }

        function hideMainApp() {
            document.getElementById('feedPage').style.display = 'none';
            document.getElementById('profilePage').classList.remove('show');
            document.getElementById('networkPage').classList.remove('show');
            document.getElementById('jobsPage').classList.remove('show');
            document.getElementById('messagingPage').classList.remove('show');
            document.getElementById('notificationsPage').classList.remove('show');
        }

        function handleLogin() {
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value.trim();
            const errorDiv = document.getElementById('loginError');

            // Demo credentials for testing
            if (email === 'demo@linkedin.com' && password === 'password') {
                currentUser = {
                    firstName: 'Demo',
                    lastName: 'User',
                    email: email,
                    headline: 'Software Engineer'
                };
                localStorage.setItem('linkedin_user', JSON.stringify(currentUser));
                showMainApp();
                updateProfileInfo();
                showToast('Welcome back!');
                return;
            }

            // Check registered users
            const users = JSON.parse(localStorage.getItem('linkedin_users')) || [];
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                currentUser = user;
                localStorage.setItem('linkedin_user', JSON.stringify(currentUser));
                showMainApp();
                updateProfileInfo();
                showToast('Welcome back!');
            } else {
                errorDiv.classList.add('show');
                setTimeout(() => errorDiv.classList.remove('show'), 3000);
            }
        }

        function handleSignup() {
            const firstName = document.getElementById('signupFirstName').value.trim();
            const lastName = document.getElementById('signupLastName').value.trim();
            const email = document.getElementById('signupEmail').value.trim();
            const password = document.getElementById('signupPassword').value.trim();
            const errorDiv = document.getElementById('signupError');
            const successDiv = document.getElementById('signupSuccess');

            // Validation
            if (!firstName || !lastName || !email || !password) {
                errorDiv.textContent = 'Please fill in all fields';
                errorDiv.classList.add('show');
                setTimeout(() => errorDiv.classList.remove('show'), 3000);
                return;
            }

            if (password.length < 6) {
                errorDiv.textContent = 'Password must be at least 6 characters';
                errorDiv.classList.add('show');
                setTimeout(() => errorDiv.classList.remove('show'), 3000);
                return;
            }

            // Check if email already exists
            const users = JSON.parse(localStorage.getItem('linkedin_users')) || [];
            if (users.find(u => u.email === email)) {
                errorDiv.textContent = 'An account with this email already exists';
                errorDiv.classList.add('show');
                setTimeout(() => errorDiv.classList.remove('show'), 3000);
                return;
            }

            // Create new user
            const newUser = {
                firstName,
                lastName,
                email,
                password,
                headline: 'New LinkedIn User'
            };

            users.push(newUser);
            localStorage.setItem('linkedin_users', JSON.stringify(users));

            // Show success and switch to login
            successDiv.classList.add('show');
            setTimeout(() => {
                successDiv.classList.remove('show');
                showLogin();
            }, 2000);
        }

        function updateProfileInfo() {
            if (!currentUser) return;
            
            const fullName = `${currentUser.firstName} ${currentUser.lastName}`;
            
            // Update profile name in sidebar
            const profileNames = document.querySelectorAll('.profile-name');
            profileNames.forEach(el => {
                if (el.textContent !== fullName) el.textContent = fullName;
            });

            // Update hero name
            const heroName = document.querySelector('.profile-hero-content h1');
            if (heroName) heroName.textContent = fullName;

            // Update headline
            if (currentUser.headline) {
                const headlines = document.querySelectorAll('.profile-headline');
                headlines.forEach(el => el.textContent = currentUser.headline);
                
                const heroHeadline = document.querySelector('.profile-hero-content > p:nth-of-type(1)');
                if (heroHeadline) heroHeadline.textContent = currentUser.headline;
            }

            // Update nav profile
            const navProfile = document.getElementById('navProfilePic');
            if (navProfile) {
                navProfile.textContent = currentUser.firstName[0].toUpperCase();
            }
        }

        function logout() {
            currentUser = null;
            localStorage.removeItem('linkedin_user');
            showLogin();
            showToast('You have been logged out');
        }

        function handleLoginKeypress(event) {
            if (event.key === 'Enter') {
                handleLogin();
            }
        }

        function handleSignupKeypress(event) {
            if (event.key === 'Enter') {
                handleSignup();
            }
        }

        // ===== GITHUB OAUTH =====
        let githubOAuthMode = 'login';

        function openGitHubOAuth(mode) {
            githubOAuthMode = mode;
            document.getElementById('githubOAuthModal').classList.add('show');
            document.getElementById('oauthContent').classList.remove('show');
            document.getElementById('oauthLoading').classList.remove('show');
            document.getElementById('oauthContent').style.display = 'block';
            document.getElementById('oauthLoading').style.display = 'none';
        }

        function closeGitHubOAuth() {
            document.getElementById('githubOAuthModal').classList.remove('show');
        }

        function authorizeGitHub() {
            // Show loading state
            document.getElementById('oauthContent').style.display = 'none';
            document.getElementById('oauthLoading').classList.add('show');
            document.getElementById('oauthLoading').style.display = 'block';

            // Simulate API delay
            setTimeout(() => {
                // Generate mock GitHub user data
                const mockGitHubUser = {
                    firstName: 'GitHub',
                    lastName: 'User',
                    email: 'githubuser@example.com',
                    password: 'github_oauth_' + Date.now(),
                    headline: 'Developer at GitHub',
                    provider: 'github'
                };

                // Store user
                const users = JSON.parse(localStorage.getItem('linkedin_users')) || [];
                
                // Check if GitHub user already exists
                const existingUser = users.find(u => u.email === mockGitHubUser.email);
                
                if (!existingUser) {
                    users.push(mockGitHubUser);
                    localStorage.setItem('linkedin_users', JSON.stringify(users));
                }

                // Login the user
                currentUser = existingUser || mockGitHubUser;
                localStorage.setItem('linkedin_user', JSON.stringify(currentUser));

                // Close modal and show main app
                closeGitHubOAuth();
                showMainApp();
                updateProfileInfo();
                
                const message = githubOAuthMode === 'signup' ? 'Account created with GitHub!' : 'Welcome back!';
                showToast(message);
            }, 2000);
        }

        // Close modal on background click
        document.getElementById('githubOAuthModal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                closeGitHubOAuth();
            }
        });

        // ===== DATA =====
        const posts = [];

        const connections = [];

        const jobs = [];

        const conversations = [];

        const notifications = [];

        let currentPostId = null;
        let currentPage = 'feed';

        // ===== INITIALIZATION =====
        document.addEventListener('DOMContentLoaded', () => {
            renderPosts();
            renderNetwork();
            renderJobs();
            renderConversations();
            renderNotifications();
        });

        // ===== NAVIGATION =====
        function hideAllPages() {
            document.getElementById('feedPage').classList.remove('show');
            document.getElementById('feedPage').style.display = 'none';
            document.getElementById('profilePage').classList.remove('show');
            document.getElementById('networkPage').classList.remove('show');
            document.getElementById('jobsPage').classList.remove('show');
            document.getElementById('jobsPage').style.display = 'none';
            document.getElementById('messagingPage').classList.remove('show');
            document.getElementById('notificationsPage').classList.remove('show');
            document.getElementById('searchResults').classList.remove('show');
            
            document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        }

        function showFeed() {
            hideAllPages();
            document.getElementById('feedPage').style.display = 'grid';
            document.getElementById('feedPage').classList.add('show');
            document.querySelector('.nav-link').classList.add('active');
            currentPage = 'feed';
            window.scrollTo(0, 0);
        }

        function showProfile() {
            hideAllPages();
            document.getElementById('profilePage').classList.add('show');
            currentPage = 'profile';
            window.scrollTo(0, 0);
        }

        function showNetwork() {
            hideAllPages();
            document.getElementById('networkPage').classList.add('show');
            currentPage = 'network';
            window.scrollTo(0, 0);
        }

        function showJobs() {
            hideAllPages();
            document.getElementById('jobsPage').style.display = 'grid';
            document.getElementById('jobsPage').classList.add('show');
            currentPage = 'jobs';
            window.scrollTo(0, 0);
        }

        function showMessaging() {
            hideAllPages();
            document.getElementById('messagingPage').classList.add('show');
            currentPage = 'messaging';
        }

        function showNotifications() {
            hideAllPages();
            document.getElementById('notificationsPage').classList.add('show');
            currentPage = 'notifications';
            window.scrollTo(0, 0);
            
            // Mark notifications as read
            document.querySelectorAll('.notification-item').forEach(item => {
                item.classList.remove('unread');
            });
            document.querySelector('.nav-badge').style.display = 'none';
        }

        // ===== POSTS =====
        function renderPosts() {
            const feed = document.getElementById('mainFeed');
            const existingPosts = feed.querySelectorAll('.feed-post');
            existingPosts.forEach(post => post.remove());
            
            posts.forEach(post => {
                const postEl = createPostElement(post);
                feed.appendChild(postEl);
            });
        }

        function createPostElement(post) {
            const article = document.createElement('article');
            article.className = 'card feed-post';
            article.innerHTML = `
                <div class="post-header">
                    <div class="post-author-img">${post.avatar}</div>
                    <div class="post-meta">
                        <div class="author-name">${post.author}</div>
                        <div class="author-headline">${post.headline}</div>
                        <div class="post-time">${post.time} • 🌐</div>
                    </div>
                    <div class="post-menu-container">
                        <div class="post-menu" onclick="togglePostMenu(${post.id})">⋯</div>
                        <div class="post-menu-dropdown" id="postMenu-${post.id}">
                            <div class="post-menu-item" onclick="editPost(${post.id})">
                                <span>✏️</span>
                                <span>Edit post</span>
                            </div>
                            <div class="post-menu-item" onclick="showToast('Visibility settings coming soon')">
                                <span>👁️</span>
                                <span>Change visibility</span>
                            </div>
                            <div class="post-menu-divider"></div>
                            <div class="post-menu-item delete" onclick="confirmDeletePost(${post.id})">
                                <span>🗑️</span>
                                <span>Delete post</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="post-content">${post.content}</div>
                ${post.image ? `<img src="${post.image}" class="post-image" alt="Post image">` : ''}
                ${post.video ? `<video src="${post.video}" class="post-video" controls></video>` : ''}
                ${post.html ? `
                <div class="post-website">
                    <div class="website-preview-header">
                        <span>🌐</span>
                        <span>${post.htmlName || 'website.html'}</span>
                    </div>
                    <iframe class="website-iframe" srcdoc="${post.html.replace(/"/g, '&quot;')}" sandbox="allow-scripts allow-same-origin"></iframe>
                </div>` : ''}
                <div class="post-stats">
                    <div class="reactions" onclick="showToast('${post.likes} reactions')">
                        <div class="reaction-icons">
                            <span class="reaction-icon" style="background: #0a66c2;">👍</span>
                            <span class="reaction-icon" style="background: #e33e38;">❤️</span>
                        </div>
                        <span>${post.likes}</span>
                    </div>
                    <span>${post.comments} comments • ${post.reposts} reposts</span>
                </div>
                <div class="post-buttons">
                    <button class="post-btn ${post.liked ? 'liked' : ''}" id="likeBtn-${post.id}" 
                        onmouseenter="showReactionPopup(this, ${post.id})" 
                        onmouseleave="hideReactionPopup()"
                        onclick="toggleLike(${post.id})">
                        ${post.liked ? '👍' : '🤍'} Like
                    </button>
                    <button class="post-btn" onclick="toggleComments(${post.id})">
                        💬 Comment
                    </button>
                    <button class="post-btn" onclick="repost(${post.id})">
                        🔄 Repost
                    </button>
                    <button class="post-btn" onclick="showToast('Message sent')">
                        📤 Send
                    </button>
                </div>
                <div class="comments-section" id="comments-${post.id}">
                    <div class="comment-input-area">
                        <div class="post-avatar">👤</div>
                        <input type="text" class="comment-input" id="commentInput-${post.id}" 
                            placeholder="Add a comment..." onkeypress="handleCommentKeypress(event, ${post.id})">
                    </div>
                    <div id="commentsList-${post.id}">
                        ${post.userComments.map(c => `
                            <div class="comment">
                                <div class="post-author-img" style="width: 32px; height: 32px; font-size: 16px;">👤</div>
                                <div class="comment-content">
                                    <div class="comment-author">John Doe</div>
                                    <div class="comment-text">${c}</div>
                                    <div class="comment-actions">
                                        <span class="comment-action">Like</span>
                                        <span class="comment-action">Reply</span>
                                        <span>• Just now</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            return article;
        }

        function openPostModal() {
            // Update modal with current user info
            if (currentUser) {
                document.getElementById('postModalName').textContent = `${currentUser.firstName} ${currentUser.lastName}`;
                document.getElementById('postModalAvatar').textContent = currentUser.firstName[0].toUpperCase();
            }
            document.getElementById('postModal').classList.add('show');
            document.getElementById('postTextarea').focus();
        }

        function closePostModal() {
            document.getElementById('postModal').classList.remove('show');
            document.getElementById('postTextarea').value = '';
            removeSelectedImage();
            removeSelectedVideo();
            removeSelectedHtml();
            updatePostButton();
        }

        let selectedImage = null;
        let selectedVideo = null;
        let selectedHtml = null;
        let selectedHtmlName = '';

        function updatePostButton() {
            const textarea = document.getElementById('postTextarea');
            const btn = document.getElementById('postSubmitBtn');
            const hasContent = textarea.value.trim() !== '' || selectedImage !== null || selectedVideo !== null || selectedHtml !== null;
            btn.disabled = !hasContent;
        }

        function handleImageSelect(event) {
            const file = event.target.files[0];
            if (!file) return;

            if (!file.type.startsWith('image/')) {
                showToast('Please select an image file');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                showToast('Image size should be less than 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                selectedImage = e.target.result;
                document.getElementById('imagePreview').src = selectedImage;
                document.getElementById('imagePreviewContainer').classList.add('show');
                document.querySelector('.modal-action-btn[title="Add photo"]').classList.add('active');
                updatePostButton();
            };
            reader.readAsDataURL(file);
        }

        function removeSelectedImage() {
            selectedImage = null;
            document.getElementById('imagePreview').src = '';
            document.getElementById('imagePreviewContainer').classList.remove('show');
            document.getElementById('postImageInput').value = '';
            document.querySelector('.modal-action-btn[title="Add photo"]').classList.remove('active');
            updatePostButton();
        }

        function handleVideoSelect(event) {
            const file = event.target.files[0];
            if (!file) return;

            if (!file.type.startsWith('video/')) {
                showToast('Please select a video file');
                return;
            }

            if (file.size > 50 * 1024 * 1024) {
                showToast('Video size should be less than 50MB');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                selectedVideo = e.target.result;
                const video = document.getElementById('videoPreview');
                video.src = selectedVideo;
                document.getElementById('videoPreviewContainer').classList.add('show');
                document.querySelector('.modal-action-btn[title="Add video"]').classList.add('active');
                updatePostButton();
            };
            reader.readAsDataURL(file);
        }

        function removeSelectedVideo() {
            selectedVideo = null;
            const video = document.getElementById('videoPreview');
            video.src = '';
            video.pause();
            document.getElementById('videoPreviewContainer').classList.remove('show');
            document.getElementById('postVideoInput').value = '';
            document.querySelector('.modal-action-btn[title="Add video"]').classList.remove('active');
            updatePostButton();
        }

        function handleHtmlSelect(event) {
            const file = event.target.files[0];
            if (!file) return;

            if (!file.name.endsWith('.html') && !file.name.endsWith('.htm') && !file.name.endsWith('.txt')) {
                showToast('Please select an HTML file (.html, .htm, .txt)');
                return;
            }

            if (file.size > 2 * 1024 * 1024) {
                showToast('HTML file size should be less than 2MB');
                return;
            }

            selectedHtmlName = file.name;
            document.getElementById('htmlFileName').textContent = file.name;

            const reader = new FileReader();
            reader.onload = (e) => {
                selectedHtml = e.target.result;
                const iframe = document.getElementById('htmlPreview');
                iframe.srcdoc = selectedHtml;
                document.getElementById('htmlPreviewContainer').classList.add('show');
                document.querySelector('.modal-action-btn[title="Add website/HTML file"]').classList.add('active');
                updatePostButton();
            };
            reader.readAsText(file);
        }

        function removeSelectedHtml() {
            selectedHtml = null;
            selectedHtmlName = '';
            const iframe = document.getElementById('htmlPreview');
            iframe.srcdoc = '';
            document.getElementById('htmlPreviewContainer').classList.remove('show');
            document.getElementById('postHtmlInput').value = '';
            document.querySelector('.modal-action-btn[title="Add website/HTML file"]').classList.remove('active');
            updatePostButton();
        }

        function submitPost() {
            const content = document.getElementById('postTextarea').value.trim();
            if (!content && !selectedImage && !selectedVideo && !selectedHtml) return;

            const authorName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'John Doe';
            const authorHeadline = currentUser ? currentUser.headline : 'Software Engineer at Tech Company';
            const avatar = currentUser ? currentUser.firstName[0].toUpperCase() : '👤';

            const newPost = {
                id: Date.now(),
                author: authorName,
                avatar: avatar,
                headline: authorHeadline,
                time: 'Just now',
                content: content.replace(/\n/g, '<br>'),
                image: selectedImage,
                video: selectedVideo,
                html: selectedHtml,
                htmlName: selectedHtmlName,
                likes: 0,
                comments: 0,
                reposts: 0,
                liked: false,
                userComments: []
            };

            posts.unshift(newPost);
            renderPosts();
            closePostModal();
            showToast('Post published successfully!');
        }

        // ===== REACTIONS =====
        function showReactionPopup(btn, postId) {
            const popup = document.getElementById('reactionPopup');
            const rect = btn.getBoundingClientRect();
            popup.style.left = rect.left + 'px';
            popup.style.top = (rect.top - 50) + 'px';
            popup.classList.add('show');
            popup.dataset.postId = postId;
        }

        function hideReactionPopup() {
            setTimeout(() => {
                const popup = document.getElementById('reactionPopup');
                if (!popup.matches(':hover')) {
                    popup.classList.remove('show');
                }
            }, 100);
        }

        document.getElementById('reactionPopup').addEventListener('mouseleave', () => {
            document.getElementById('reactionPopup').classList.remove('show');
        });

        function addReaction(emoji) {
            const popup = document.getElementById('reactionPopup');
            const postId = parseInt(popup.dataset.postId);
            const post = posts.find(p => p.id === postId);
            
            if (post) {
                post.liked = true;
                post.likes++;
                renderPosts();
                showToast(`You reacted with ${emoji}`);
            }
            popup.classList.remove('show');
        }

        function toggleLike(postId) {
            const post = posts.find(p => p.id === postId);
            if (post) {
                post.liked = !post.liked;
                post.likes += post.liked ? 1 : -1;
                renderPosts();
            }
        }

        function toggleComments(postId) {
            const section = document.getElementById(`comments-${postId}`);
            section.classList.toggle('show');
            if (section.classList.contains('show')) {
                document.getElementById(`commentInput-${postId}`).focus();
            }
        }

        function repost(postId) {
            showToast('Reposted to your network!');
            const post = posts.find(p => p.id === postId);
            if (post) {
                post.reposts++;
                renderPosts();
            }
        }

        // ===== POST MENU & DELETE =====
        function togglePostMenu(postId) {
            document.querySelectorAll('.post-menu-dropdown').forEach(menu => {
                if (menu.id !== `postMenu-${postId}`) {
                    menu.classList.remove('show');
                }
            });
            
            const menu = document.getElementById(`postMenu-${postId}`);
            menu.classList.toggle('show');
            
            setTimeout(() => {
                document.addEventListener('click', closePostMenu);
            }, 0);
        }

        function closePostMenu(e) {
            if (!e.target.closest('.post-menu-container')) {
                document.querySelectorAll('.post-menu-dropdown').forEach(menu => {
                    menu.classList.remove('show');
                });
                document.removeEventListener('click', closePostMenu);
            }
        }

        function editPost(postId) {
            showToast('Edit post coming soon');
            document.querySelectorAll('.post-menu-dropdown').forEach(menu => {
                menu.classList.remove('show');
            });
        }

        let postToDelete = null;

        function confirmDeletePost(postId) {
            postToDelete = postId;
            document.getElementById('deleteDialog').classList.add('show');
            document.querySelectorAll('.post-menu-dropdown').forEach(menu => {
                menu.classList.remove('show');
            });
        }

        function closeDeleteDialog() {
            document.getElementById('deleteDialog').classList.remove('show');
            postToDelete = null;
        }

        function deletePost() {
            if (!postToDelete) return;
            
            const index = posts.findIndex(p => p.id === postToDelete);
            if (index > -1) {
                posts.splice(index, 1);
                renderPosts();
                showToast('Post deleted');
            }
            
            closeDeleteDialog();
        }

        function handleCommentKeypress(event, postId) {
            if (event.key === 'Enter') {
                const input = document.getElementById(`commentInput-${postId}`);
                const text = input.value.trim();
                if (text) {
                    const post = posts.find(p => p.id === postId);
                    post.userComments.push(text);
                    post.comments++;
                    renderPosts();
                    showToast('Comment added');
                }
            }
        }

        // ===== NETWORK =====
        function renderNetwork() {
            const grid = document.getElementById('networkGrid');
            if (connections.length === 0) {
                grid.innerHTML = '<div style="text-align: center; padding: 48px; color: var(--text-secondary);">No connections yet</div>';
                return;
            }
            grid.innerHTML = connections.map((conn, index) => `
                <div class="connection-card">
                    <div class="connection-banner"></div>
                    <div class="connection-content">
                        <div class="connection-avatar">${conn.avatar}</div>
                        <div class="connection-name" onclick="showToast('Viewing ${conn.name}\'s profile')">${conn.name}</div>
                        <div class="connection-headline">${conn.headline}</div>
                        <div class="mutual">${conn.mutual} mutual connections</div>
                        <button class="connect-btn ${conn.connected ? 'connected' : ''}" onclick="toggleConnect(this, ${index})">
                            ${conn.connected ? '✓ Connected' : '+ Connect'}
                        </button>
                    </div>
                </div>
            `).join('');
        }

        function switchNetworkTab(tab, type) {
            document.querySelectorAll('.network-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        }

        function toggleConnect(btn, index) {
            const connected = btn.classList.toggle('connected');
            btn.textContent = connected ? '✓ Connected' : '+ Connect';
            connections[index].connected = connected;
            showToast(connected ? 'Connection request sent!' : 'Connection removed');
        }

        function toggleFollow(btn) {
            const following = btn.classList.toggle('following');
            btn.textContent = following ? '✓ Following' : '+ Follow';
            showToast(following ? 'Now following' : 'Unfollowed');
        }

        // ===== JOBS =====
        function renderJobs() {
            const list = document.getElementById('jobsList');
            const existingJobs = list.querySelectorAll('.job-card');
            existingJobs.forEach(job => job.remove());
            
            if (jobs.length === 0) {
                const emptyState = document.createElement('div');
                emptyState.className = 'card';
                emptyState.style.cssText = 'padding: 48px; text-align: center; color: var(--text-secondary);';
                emptyState.innerHTML = 'No jobs available';
                list.appendChild(emptyState);
                return;
            }
            
            jobs.forEach((job, index) => {
                const jobEl = document.createElement('div');
                jobEl.className = 'job-card';
                jobEl.innerHTML = `
                    <div class="job-logo">${job.logo}</div>
                    <div class="job-details">
                        <div class="job-title">${job.title}</div>
                        <div class="job-company">${job.company}</div>
                        <div class="job-location">📍 ${job.location}</div>
                        <div class="job-meta">
                            <span>⏱️ ${job.posted}</span>
                            <span>👥 ${job.applicants} applicants</span>
                        </div>
                    </div>
                    <div class="job-actions">
                        <button class="save-job-btn ${job.saved ? 'saved' : ''}" onclick="toggleSaveJob(this, ${index})">
                            ${job.saved ? '🔖' : '🔖'}
                        </button>
                    </div>
                `;
                list.appendChild(jobEl);
            });
        }

        function toggleSaveJob(btn, index) {
            const saved = btn.classList.toggle('saved');
            jobs[index].saved = saved;
            showToast(saved ? 'Job saved' : 'Job unsaved');
        }

        // ===== MESSAGING =====
        function renderConversations() {
            const list = document.getElementById('conversationList');
            if (conversations.length === 0) {
                list.innerHTML = '<div style="padding: 24px; text-align: center; color: var(--text-secondary);">No conversations yet</div>';
                return;
            }
            list.innerHTML = conversations.map(conv => `
                <div class="conversation-item ${conv.unread ? '' : ''}" onclick="selectConversation('${conv.name}')">
                    <div class="conversation-avatar">${conv.avatar}</div>
                    <div class="conversation-preview">
                        <div class="conversation-name">${conv.name}</div>
                        <div class="conversation-text">${conv.preview}</div>
                    </div>
                    <div class="conversation-time">${conv.time}</div>
                </div>
            `).join('');
        }

        function selectConversation(name) {
            document.querySelector('.conversation-name').textContent = name;
        }

        function handleChatKeypress(event) {
            if (event.key === 'Enter') {
                sendMessage();
            }
        }

        function sendMessage() {
            const input = document.getElementById('chatInput');
            const text = input.value.trim();
            if (!text) return;

            const messages = document.getElementById('chatMessages');
            const msg = document.createElement('div');
            msg.className = 'message sent';
            msg.textContent = text;
            messages.appendChild(msg);
            messages.scrollTop = messages.scrollHeight;
            input.value = '';
        }

        // ===== NOTIFICATIONS =====
        function renderNotifications() {
            const list = document.getElementById('notificationsList');
            if (notifications.length === 0) {
                list.innerHTML = '<div class="card" style="padding: 48px; text-align: center; color: var(--text-secondary);">No notifications</div>';
                return;
            }
            list.innerHTML = notifications.map(notif => `
                <div class="notification-item ${notif.unread ? 'unread' : ''}">
                    <div class="notification-icon">${notif.icon}</div>
                    <div class="notification-content">
                        <div class="notification-text">${notif.text}</div>
                        <div class="notification-time">${notif.time}</div>
                    </div>
                </div>
            `).join('');
        }

        // ===== SEARCH =====
        function handleSearch(event) {
            if (event.key === 'Enter') {
                const query = event.target.value.trim();
                if (query) {
                    showSearchResults(query);
                }
            }
        }

        function showSearchResults(query) {
            hideAllPages();
            document.getElementById('searchResults').classList.add('show');
            
            const resultsList = document.getElementById('searchResultsList');
            resultsList.innerHTML = `
                <div class="card" style="padding: 24px;">
                    <h3 style="margin-bottom: 16px;">People matching "${query}"</h3>
                    ${connections.filter(c => c.name.toLowerCase().includes(query.toLowerCase())).map(c => `
                        <div class="person-item" style="margin-bottom: 16px;">
                            <div class="person-avatar">${c.avatar}</div>
                            <div class="person-info">
                                <div class="person-name">${c.name}</div>
                                <div class="person-headline">${c.headline}</div>
                            </div>
                            <button class="follow-btn">Connect</button>
                        </div>
                    `).join('') || '<p style="color: var(--text-secondary);">No results found</p>'}
                </div>
            `;
        }

        // ===== DROPDOWN =====
        function toggleProfileDropdown() {
            document.getElementById('profileDropdown').classList.toggle('show');
        }

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown')) {
                document.getElementById('profileDropdown').classList.remove('show');
            }
        });

        // ===== TOAST =====
        function showToast(message) {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }

        // Close modal on overlay click
        document.getElementById('postModal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                closePostModal();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closePostModal();
            }
        });
    
        // ===== DARK MODE =====
        function toggleDarkMode() {
            const body = document.body;
            const toggle = document.getElementById('darkModeToggle');
            body.classList.toggle('dark-mode');
            toggle.classList.toggle('active');
            const isDark = body.classList.contains('dark-mode');
            localStorage.setItem('linkedin_dark_mode', isDark);
            showToast(isDark ? 'Dark mode enabled' : 'Light mode enabled');
        }

        function loadDarkMode() {
            const isDark = localStorage.getItem('linkedin_dark_mode') === 'true';
            if (isDark) {
                document.body.classList.add('dark-mode');
                document.getElementById('darkModeToggle')?.classList.add('active');
            }
        }        // ===== EMOJI PICKER =====
        let activeTextarea = null;
        let emojiPickerOpen = false;

        function toggleEmojiPicker(textareaId, btnElement) {
            const picker = document.getElementById('emojiPicker');
            const textarea = document.getElementById(textareaId);
            
            if (emojiPickerOpen && activeTextarea === textarea) {
                closeEmojiPicker();
                return;
            }
            
            activeTextarea = textarea;
            emojiPickerOpen = true;
            
            // Position picker near the button
            const rect = btnElement.getBoundingClientRect();
            picker.style.left = rect.left + 'px';
            picker.style.top = (rect.bottom + 8) + 'px';
            picker.classList.add('show');
            
            // Switch to first tab
            switchEmojiTab('smileys');
        }

        function closeEmojiPicker() {
            const picker = document.getElementById('emojiPicker');
            picker.classList.remove('show');
            emojiPickerOpen = false;
            activeTextarea = null;
        }

        function switchEmojiTab(category) {
            // Update tabs
            document.querySelectorAll('.emoji-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            event.target.classList.add('active');
            
            // Update sections
            document.querySelectorAll('.emoji-section').forEach(section => {
                section.classList.remove('active');
            });
            document.querySelector(`.emoji-section[data-category="${category}"]`)?.classList.add('active');
        }

        function insertEmoji(emoji) {
            if (!activeTextarea) return;
            
            const start = activeTextarea.selectionStart;
            const end = activeTextarea.selectionEnd;
            const text = activeTextarea.value;
            const before = text.substring(0, start);
            const after = text.substring(end);
            
            activeTextarea.value = before + emoji + after;
            activeTextarea.selectionStart = activeTextarea.selectionEnd = start + emoji.length;
            activeTextarea.focus();
            
            // Update post button state if in create modal
            if (activeTextarea.id === 'postTextarea') {
                updatePostButton();
            }
        }

        // Close emoji picker when clicking outside
        document.addEventListener('click', function(e) {
            const picker = document.getElementById('emojiPicker');
            if (emojiPickerOpen && picker && !picker.contains(e.target) && !e.target.closest('.modal-action-btn')) {
                closeEmojiPicker();
            }
        });


        // ===== SAVE POST =====
        let savedPostIds = JSON.parse(localStorage.getItem('linkedin_saved_posts')) || [];

        function savePost(postId) {
            const index = savedPostIds.indexOf(postId);
            if (index === -1) {
                savedPostIds.push(postId);
                showToast('Post saved to your bookmarks');
            } else {
                savedPostIds.splice(index, 1);
                showToast('Post removed from saved');
            }
            localStorage.setItem('linkedin_saved_posts', JSON.stringify(savedPostIds));
            renderPosts();
        }

        function isPostSaved(postId) {
            return savedPostIds.includes(postId);
        }

        function showSavedPosts() {
            hideAllPages();
            document.getElementById('savedPostsPage').classList.remove('hidden');
            renderSavedPosts();
            document.getElementById('profileDropdown').classList.remove('show');
        }

        function renderSavedPosts() {
            const feed = document.getElementById('savedPostsFeed');
            feed.innerHTML = '';
            const savedPosts = posts.filter(p => savedPostIds.includes(p.id));
            
            if (savedPosts.length === 0) {
                feed.innerHTML = '<div class="card" style="text-align: center; padding: 40px;"><p>No saved posts yet</p></div>';
                return;
            }
            
            savedPosts.forEach(post => {
                const postEl = createPostElement(post);
                feed.appendChild(postEl);
            });
        }

        // ===== EDIT POST =====
        let editingPostId = null;

        function editPost(postId) {
            const post = posts.find(p => p.id === postId);
            if (!post) return;
            
            editingPostId = postId;
            const modal = document.getElementById('editModal');
            const textarea = document.getElementById('editTextarea');
            const avatar = document.getElementById('editModalAvatar');
            const name = document.getElementById('editModalName');
            
            textarea.value = post.content.replace(/<br>/g, '\n');
            avatar.textContent = post.avatar;
            name.textContent = post.author;
            
            modal.classList.add('show');
            document.querySelectorAll('.post-menu-dropdown').forEach(menu => {
                menu.classList.remove('show');
            });
        }

        function closeEditModal() {
            document.getElementById('editModal').classList.remove('show');
            editingPostId = null;
        }

        function submitEdit() {
            if (!editingPostId) return;
            
            const content = document.getElementById('editTextarea').value.trim();
            if (!content) {
                showToast('Post cannot be empty');
                return;
            }
            
            const post = posts.find(p => p.id === editingPostId);
            if (post) {
                post.content = content.replace(/\n/g, '<br>');
                renderPosts();
                showToast('Post updated successfully');
            }
            
            closeEditModal();
        }

        // ===== SHARE POST =====
        let sharingPostId = null;

        function openShareModal(postId) {
            sharingPostId = postId;
            const modal = document.getElementById('shareModal');
            const input = document.getElementById('shareLinkInput');
            input.value = window.location.href + '#post=' + postId;
            modal.classList.add('show');
            document.querySelectorAll('.post-menu-dropdown').forEach(menu => {
                menu.classList.remove('show');
            });
        }

        function closeShareModal() {
            document.getElementById('shareModal').classList.remove('show');
            sharingPostId = null;
        }

        function copyLink() {
            const input = document.getElementById('shareLinkInput');
            input.select();
            document.execCommand('copy');
            showToast('Link copied to clipboard');
            closeShareModal();
        }

        function shareToLinkedIn() {
            showToast('Shared to your LinkedIn feed');
            closeShareModal();
        }

        function shareToMessages() {
            showToast('Opening messaging...');
            closeShareModal();
            showMessaging();
        }

        // Close share modal on outside click
        document.addEventListener('click', function(e) {
            const modal = document.getElementById('shareModal');
            if (modal && modal.classList.contains('show') && e.target === modal) {
                closeShareModal();
            }
            if (modal && modal.classList.contains('show') && e.target.closest('.share-box') === null && e.target !== modal) {
                // Let the main click handler deal with it
            }
        });

        // ===== FOLLOW/UNFOLLOW =====
        let followedUsers = JSON.parse(localStorage.getItem('linkedin_followed')) || [];

        function toggleFollow(userId, userName) {
            const index = followedUsers.indexOf(userId);
            if (index === -1) {
                followedUsers.push(userId);
                showToast(`You are now following ${userName}`);
            } else {
                followedUsers.splice(index, 1);
                showToast(`Unfollowed ${userName}`);
            }
            localStorage.setItem('linkedin_followed', JSON.stringify(followedUsers));
            renderNetwork();
        }

        function isFollowing(userId) {
            return followedUsers.includes(userId);
        }

        // ===== TIME AGO =====
        function timeAgo(dateString) {
            if (!dateString || dateString === 'Just now') return 'Just now';
            
            const now = new Date();
            const past = new Date(dateString);
            const seconds = Math.floor((now - past) / 1000);
            
            if (seconds < 60) return 'Just now';
            const minutes = Math.floor(seconds / 60);
            if (minutes < 60) return `${minutes}m ago`;
            const hours = Math.floor(minutes / 60);
            if (hours < 24) return `${hours}h ago`;
            const days = Math.floor(hours / 24);
            if (days < 7) return `${days}d ago`;
            const weeks = Math.floor(days / 7);
            if (weeks < 4) return `${weeks}w ago`;
            const months = Math.floor(days / 30);
            if (months < 12) return `${months}mo ago`;
            const years = Math.floor(days / 365);
            return `${years}y ago`;
        }

        // Override createPostElement to include save/share and time ago
        const originalCreatePostElement = createPostElement;
        createPostElement = function(post) {
            const article = document.createElement('article');
            article.className = 'card feed-post';
            
            const isSaved = isPostSaved(post.id);
            const savedClass = isSaved ? 'saved' : '';
            const savedText = isSaved ? 'Saved' : 'Save';
            
            const timeDisplay = timeAgo(post.time === 'Just now' ? new Date() : post.time);
            
            article.innerHTML = `
                <div class="post-header">
                    <div class="post-author-img">${post.avatar}</div>
                    <div class="post-meta">
                        <div class="author-name">${post.author}</div>
                        <div class="author-headline">${post.headline}</div>
                        <div class="post-time">${timeDisplay} • 🌐 <span class="saved-indicator ${savedClass}" id="savedIndicator-${post.id}">🔖 ${savedText}</span></div>
                    </div>
                    <div class="post-menu-container">
                        <div class="post-menu" onclick="togglePostMenu(${post.id})">⋯</div>
                        <div class="post-menu-dropdown" id="postMenu-${post.id}">
                            <div class="post-menu-item ${savedClass}" onclick="savePost(${post.id})">
                                <span>🔖</span>
                                <span>${savedText}</span>
                            </div>
                            <div class="post-menu-item" onclick="editPost(${post.id})">
                                <span>✏️</span>
                                <span>Edit post</span>
                            </div>
                            <div class="post-menu-item" onclick="openShareModal(${post.id})">
                                <span>🔗</span>
                                <span>Copy link</span>
                            </div>
                            <div class="post-menu-item" onclick="showToast('Visibility settings coming soon')">
                                <span>👁️</span>
                                <span>Change visibility</span>
                            </div>
                            <div class="post-menu-divider"></div>
                            <div class="post-menu-item delete" onclick="confirmDeletePost(${post.id})">
                                <span>🗑️</span>
                                <span>Delete post</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="post-content">${post.content}</div>
                ${post.image ? `<img src="${post.image}" class="post-image" alt="Post image">` : ''}
                ${post.video ? `<video src="${post.video}" class="post-video" controls></video>` : ''}
                ${post.html ? `
                <div class="post-website">
                    <div class="website-preview-header">
                        <span>🌐</span>
                        <span>${post.htmlName || 'website.html'}</span>
                    </div>
                    <iframe class="website-iframe" srcdoc="${post.html.replace(/"/g, '&quot;')}" sandbox="allow-scripts allow-same-origin"></iframe>
                </div>` : ''}
                <div class="post-stats">
                    <div class="reactions" onclick="showToast('${post.likes} reactions')">
                        <div class="reaction-icons">
                            <span class="reaction-icon" style="background: #0a66c2;">👍</span>
                            <span class="reaction-icon" style="background: #e33e38;">❤️</span>
                        </div>
                        <span>${post.likes}</span>
                    </div>
                    <span>${post.comments} comments • ${post.reposts} reposts</span>
                </div>
                <div class="post-buttons">
                    <button class="post-btn ${post.liked ? 'liked' : ''}" id="likeBtn-${post.id}" 
                        onmouseenter="showReactionPopup(this, ${post.id})" 
                        onmouseleave="hideReactionPopup()"
                        onclick="toggleLike(${post.id})">
                        ${post.liked ? '👍' : '🤍'} Like
                    </button>
                    <button class="post-btn" onclick="toggleComments(${post.id})">
                        💬 Comment
                    </button>
                    <button class="post-btn" onclick="repost(${post.id})">
                        🔄 Repost
                    </button>
                    <button class="post-btn" onclick="openShareModal(${post.id})">
                        📤 Send
                    </button>
                </div>
                <div class="comments-section" id="comments-${post.id}">
                    <div class="comment-input-area">
                        <div class="post-avatar">👤</div>
                        <input type="text" class="comment-input" id="commentInput-${post.id}" 
                            placeholder="Add a comment..." onkeypress="handleCommentKeypress(event, ${post.id})">
                    </div>
                    <div id="commentsList-${post.id}">
                        ${post.userComments.map(c => `
                            <div class="comment">
                                <div class="post-author-img" style="width: 32px; height: 32px; font-size: 16px;">👤</div>
                                <div class="comment-content">
                                    <div class="comment-author">John Doe</div>
                                    <div class="comment-text">${c}</div>
                                    <div class="comment-actions">
                                        <span class="comment-action">Like</span>
                                        <span class="comment-action">Reply</span>
                                        <span>• Just now</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            return article;
        };

    