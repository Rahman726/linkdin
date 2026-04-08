# Firebase Setup Instructions

## For Real-Time Multi-User Features

### Step 1: Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Create Project"
3. Name it "linkedin-clone" or any name
4. Disable Google Analytics (optional)
5. Click "Create"

### Step 2: Get Your Firebase Config
1. In Firebase Console, click the gear icon (⚙️) → "Project Settings"
2. Go to "General" tab
3. Scroll to "Your apps" section
4. Click "</>" (Web) icon
5. Register app with nickname "linkedin-web"
6. Copy the firebaseConfig object

### Step 3: Update Config in Code
Replace the dummy config in linkdin.html:
```javascript
const firebaseConfig = {
    apiKey: "YOUR_REAL_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
};
```

### Step 4: Enable Authentication
1. In Firebase Console → "Authentication"
2. Click "Get Started"
3. Enable "Email/Password" sign-in method
4. Save

### Step 5: Create Firestore Database
1. In Firebase Console → "Firestore Database"
2. Click "Create Database"
3. Choose "Start in production mode" or "test mode"
4. Select region (asia-south1 for Pakistan/India)
5. Create

### Step 6: Set Security Rules
Go to Firestore Database → Rules, paste:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.authorId;
    }
    match /follows/{followId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /conversations/{conversationId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.participants;
    }
  }
}
```

## Features Now Available

### ✅ Real User Accounts
- Sign up with email/password
- Login/logout
- Profile saved in cloud

### ✅ Real Follow System
- Follow any user
- Unfollow users
- Follows persist across devices

### ✅ Real-Time Posts
- All users see same posts
- Posts update instantly
- Like/comment in real-time

### ✅ Cross-User Messaging
- Send messages to any user
- Real-time chat
- Message history saved

### ✅ Global Feed
- See posts from all users
- Not just your own device

## Testing Multi-User

1. Open app in Chrome (User A)
2. Sign up with email: usera@test.com
3. Open app in Firefox/Edge (User B)
4. Sign up with email: userb@test.com
5. User A can now follow User B
6. Send messages between them
7. Posts appear in both browsers!

## Important Notes

- **Firebase Free Tier**: 50,000 reads/day, 20,000 writes/day (more than enough for testing)
- **Real Project**: Replace dummy config with real Firebase config
- **Security**: Rules above allow public read but auth-required write
