# 🐟 Jal Drishti - Fish Species Identification

<div align="center">

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)](https://www.tensorflow.org/lite)
[![Platform](https://img.shields.io/badge/platform-Android%20%7C%20iOS-blue)](https://reactnative.dev)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

**Jal Drishti** (जल दृष्टि - "Water Vision") is an AI-powered mobile app that identifies fish species from photos using on-device machine learning. Built for fisheries management, conservation, and fishing enthusiasts in South Asia.

</div>

---

## 📱 Screenshots

<div align="center">
  <table>
    <tr>
      <td><img src="./screenshots/home.jpg" width="200" alt="Home Screen"/></td>
      <td><img src="./screenshots/camera.jpg" width="200" alt="Camera Screen"/></td>
      <td><img src="./screenshots/result.jpg" width="200" alt="Result Screen"/></td>
      <td><img src="./screenshots/details.jpg" width="200" alt="Fish Details"/></td>
    </tr>
    <tr>
      <td align="center"><b>Home</b></td>
      <td align="center"><b>Camera</b></td>
      <td align="center"><b>Result</b></td>
      <td align="center"><b>Details</b></td>
    </tr>
  </table>
</div>

---

## ✨ Features

### 🎯 Core Features

| Feature | Description |
|---------|-------------|
| 📸 **Camera Capture** | Take photos of fish in the wild |
| 🖼️ **Gallery Upload** | Analyze existing photos from device |
| 🤖 **AI-Powered** | TensorFlow Lite model runs 100% offline (no internet needed!) |
| 🌍 **Multi-Language** | 6 languages: English, Hindi, Bengali, Telugu, Marathi, Tamil |
| 📊 **Detailed Info** | Scientific name, habitat, diet, size, conservation status |
| 🎯 **Smart Detection** | Confidence scoring with "Unknown Species" handling |

### 🔒 Privacy First

- ✅ **No cloud uploads** - Everything stays on your device
- ✅ **All processing on-device** - No data sent anywhere
- ✅ **No data collection** - Your privacy is respected
- ✅ **Fully offline** - Works after initial install without internet

---

## 🐠 Supported Species

| # | Species | Scientific Name | Conservation Status |
|---|---------|-----------------|---------------------|
| 1 | Black Rohu | *Labeo calbasu* | 🟢 Least Concern |
| 2 | Catla | *Catla catla* | 🟢 Least Concern |
| 3 | Common Carp | *Cyprinus carpio* | 🟢 Least Concern |
| 4 | Grass Carp | *Ctenopharyngodon idella* | 🟢 Least Concern |
| 5 | Mirror Carp | *Cyprinus carpio specularis* | 🟢 Least Concern |
| 6 | Mrigal | *Cirrhinus cirrhosus* | 🟢 Least Concern |
| 7 | Nile Tilapia | *Oreochromis niloticus* | 🟢 Least Concern |
| 8 | Rohu | *Labeo rohita* | 🟢 Least Concern |
| 9 | Silver Carp | *Hypophthalmichthys molitrix* | 🟡 Near Threatened |
| 10 | Striped Catfish | *Pangasianodon hypophthalmus* | 🔴 Vulnerable |

---

## 🛠️ Tech Stack

### Technologies Used

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Framework** | React Native | Cross-platform mobile development |
| **ML Engine** | TensorFlow Lite | On-device AI model inference |
| **Image Picker** | react-native-image-picker | Camera and gallery access |
| **Image Processing** | react-native-image-resizer, jpeg-js | Image resizing and decoding |
| **File System** | react-native-fs | File operations |
| **Video Background** | react-native-video | Animated background |
| **Permissions** | react-native-permissions | Runtime permissions handling |

---

## 📁 Project Structure

```bash
jal-drishti/
├── 📂 src/
│   ├── 📂 services/
│   │   └── tfliteService.js          # TensorFlow Lite wrapper
│   ├── 📂 components/
│   │   ├── BackgroundVideo.js        # Animated background
│   │   ├── SplashScreen.js           # Launch screen
│   │   ├── SettingsModal.js          # Language settings
│   │   └── MenuButton.js             # Navigation menu
│   └── 📂 i18n/
│       └── languages.js              # Translations (6 languages)
├── 📂 assets/
│   ├── 📂 model/
│   │   └── best_float32.tflite       # Trained AI model
│   └── 📂 videos/
│       └── background.mp4            # Animated background
├── 📂 android/                       # Android native code
├── 📂 ios/                           # iOS native code
├── 📄 App.js                         # Main application
├── 📄 package.json                   # Dependencies
└── 📄 README.md                      # This file

Identification Process Flow

graph LR
    A[📸 User Takes Photo] --> B[🔄 Image Preprocess]
    B --> C[🤖 TFLite Model]
    C --> D[📊 Analysis Result]
    D --> E{Confidence > 48%?}
    E -->|Yes| F[✅ Show Fish Details]
    E -->|No| G[❌ Show Unknown Species]

Step-by-Step Process
📸 User captures or selects a fish photo

🔄 Image resized to 224×224 pixels for the model

🤖 TFLite model analyzes the image (takes ~500ms)

📊 Top prediction with confidence score is displayed

🎯 Confidence check: If < 48% → "Unknown Species"

📋 Fish details retrieved from local database

🌍 Multi-language translation applied to all text

📷 Camera Penalty System
Camera photos are intentionally penalized to encourage clear, well-lit photos:

📉 Confidence scores reduced by 65%

🔒 Maximum confidence capped at 40%

⚡ Ensures users get accurate results with good photos

🚀 Installation
Prerequisites
Requirement	Version	Command to Check
Node.js	v16+	node --version
npm/yarn	Latest	npm --version
React Native CLI	Latest	npx react-native --version
Android Studio	Latest	-
Xcode	Latest (iOS only)	-
Physical device/emulator	-	-
📥 Step-by-Step Installation
<details> <summary><b>Click to expand installation steps</b></summary>
1️⃣ Clone the Repository
bash
git clone https://github.com/yourusername/jal-drishti.git
cd jal-drishti
2️⃣ Install Dependencies
bash
npm install
# or
yarn install
3️⃣ iOS Specific Setup (macOS only)
bash
cd ios
pod install
cd ..
4️⃣ Run on Android
bash
# With emulator
npx react-native run-android

# With physical device (USB debugging enabled)
npx react-native run-android --deviceId=YOUR_DEVICE_ID
5️⃣ Run on iOS (macOS only)
bash
npx react-native run-ios

# For specific simulator
npx react-native run-ios --simulator="iPhone 14"
</details>
📱 Android Permissions (Auto-handled)
xml
<!-- android/app/src/main/AndroidManifest.xml -->
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
🌍 Language Support
Language	Code	Native Name	Script
English	en	English	Latin
Hindi	hi	हिन्दी	Devanagari
Bengali	bn	বাংলা	Bengali
Telugu	te	తెలుగు	Telugu
Marathi	mr	मराठी	Devanagari
Tamil	ta	தமிழ்	Tamil
🎯 Usage Guide
Step-by-Step Walkthrough
Step 1: Launch App
🚀 Splash screen appears with app logo

🎬 Background video plays behind UI

Step 2: Choose Input Method
🖼️ Gallery → Pick existing photo

📸 Camera → Take new photo

Step 3: Wait for Analysis
⏳ Loading spinner appears

⚡ Model processes image (~1-2 seconds)

Step 4: View Results
<details> <summary><b>✅ If Fish is Identified:</b></summary>
text
✅ Species: Rohu (🐡)
✅ Confidence: 92.3%
✅ Scientific Name: Labeo rohita
✅ Habitat: Freshwater rivers, lakes, and reservoirs
✅ Diet: Omnivorous - algae, plants, and insects
✅ Conservation Status: Least Concern
</details><details> <summary><b>❌ If Fish is Unknown:</b></summary>
text
❌ Unknown Species
⚠️ Confidence: 32.1%
💡 Closest Match: Catla (28.4%)
💡 Tip: Try a clearer, well-lit photo
</details>
Step 5: Explore Details
📜 Scroll to view complete fish information

📊 View other possible matches (top 5)

👆 Tap on other matches for more info

🔧 Troubleshooting
Common Issues & Solutions
Issue	Solution
💥 App crashes on launch	Clear cache: npx react-native-clean-project
📸 Camera doesn't work	Check permissions in device settings
🤖 Model fails to load	Ensure best_float32.tflite is in assets/model/
🖼️ Images not recognized	Ensure good lighting and clear focus
📱 Android build fails	Check Java version (Java 11 recommended)
🍎 iOS build fails	Run pod deintegrate then pod install
🐛 Debug Mode
bash
# Start Metro bundler
npx react-native start

# In another terminal
npx react-native run-android -- --reset-cache
🤝 Contributing
Development Workflow
🍴 Fork the repository

🌿 Create a feature branch

bash
git checkout -b feature/amazing-feature
✏️ Make your changes

📝 Commit with clear message

bash
git commit -m "Add amazing feature: X, Y, Z"
📤 Push to your fork

bash
git push origin feature/amazing-feature
🔀 Open a Pull Request

📋 Coding Standards
✅ Use ESLint and Prettier

✅ Write meaningful commit messages

✅ Update documentation for new features

✅ Test on both Android and iOS

➕ How to Add New Fish Species
Add to FISH_BASE_DATA in App.js

Add species name to FISH_SPECIES array

Add translations in languages.js

Retrain/re-export TFLite model

🙏 Acknowledgments
🤖 TensorFlow Lite team for on-device ML capabilities

⚛️ React Native community for the amazing framework

🐟 Fisheries Department for species validation

🌐 Open Source contributors for various libraries

📞 Contact & Support
   rachif015@gmail.com
