// App.js - Jal Drishti Fish Species Identification App
// This app helps identify fish species from photos

import React, { useState, useEffect } from 'react';
import {
  View,           // Container component
  Text,           // Text display component
  Image,          // Image display component
  TouchableOpacity, // Makes anything tappable
  ActivityIndicator, // Loading spinner
  StyleSheet,     // CSS-like styling
  Alert,          // Popup alerts
  ScrollView,     // Scrollable container
  Platform,       // Detects iOS/Android
  PermissionsAndroid, // Android permissions
  Dimensions,     // Gets screen size
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Handles notches
import { launchImageLibrary, launchCamera } from 'react-native-image-picker'; // Pick/click photos
import ImageResizer from 'react-native-image-resizer'; // Resize images
import RNFS from 'react-native-fs'; // Read files
import jpeg from 'jpeg-js'; // Decode JPEGs
import { decode as atob } from 'base-64'; // Convert base64

// Import our custom components
import { preloadModel, getModel, runModelFlexible } from './src/services/tfliteService';
import BackgroundVideo from './src/components/BackgroundVideo';
import SplashScreen from './src/components/SplashScreen';
import SettingsModal from './src/components/SettingsModal';
import MenuButton from './src/components/MenuButton';
import { translations } from './src/i18n/languages';

const { width } = Dimensions.get('window'); // Get screen width

// ========== IDENTIFICATION RULES ==========
// These decide when to show "Unknown Fish"
const UNKNOWN_THRESHOLD = 0.48;      // Need 48% confidence to identify
const AMBIGUITY_THRESHOLD = 0.10;    // Top 2 guesses must be 10% apart

// ========== FISH DATABASE ==========
// All information about each fish species
const FISH_BASE_DATA = {
  "Black Rohu": {
    scientificName: "Labeo calbasu",
    family: "Cyprinidae",
    habitat: "Rivers, lakes, and reservoirs with muddy bottoms",
    diet: "Omnivorous - feeds on algae, plants, insects, and small crustaceans",
    maxSize: "90 cm",
    maxWeight: "10 kg",
    conservationStatus: "Least Concern",
    features: "Blackish to dark brown body with a robust shape, large scales, and a prominent snout",
    fishingSeason: "Monsoon season (June-September)",
    economicValue: "Highly valued as a food fish in South Asia",
    image: "🐟",
    color: "#2C3E50"
  },
  "Catla": {
    scientificName: "Catla catla",
    family: "Cyprinidae",
    habitat: "Freshwater rivers, lakes, and reservoirs",
    diet: "Planktivorous - feeds on zooplankton and phytoplankton",
    maxSize: "182 cm",
    maxWeight: "38.6 kg",
    conservationStatus: "Least Concern",
    features: "Large head with protruding lower jaw, deep body, and silver-gray coloration",
    fishingSeason: "Throughout the year, peak during monsoon",
    economicValue: "One of the most important aquaculture species in South Asia",
    image: "🐠",
    color: "#3498DB"
  },
  "Common Carp": {
    scientificName: "Cyprinus carpio",
    family: "Cyprinidae",
    habitat: "Warm, slow-flowing rivers, lakes, and ponds with muddy bottoms",
    diet: "Omnivorous - plants, insects, crustaceans, and detritus",
    maxSize: "120 cm",
    maxWeight: "40 kg",
    conservationStatus: "Least Concern",
    features: "Heavy-bodied with large scales, two barbels on each side of mouth, and variable coloration",
    fishingSeason: "Spring and summer (April-September)",
    economicValue: "Important for food and recreational fishing worldwide",
    image: "🎏",
    color: "#E67E22"
  },
  "Grass Carp": {
    scientificName: "Ctenopharyngodon idella",
    family: "Cyprinidae",
    habitat: "Lakes, ponds, and slow-moving rivers with abundant vegetation",
    diet: "Herbivorous - aquatic plants and vegetation",
    maxSize: "150 cm",
    maxWeight: "45 kg",
    conservationStatus: "Least Concern",
    features: "Elongated body, broad head, and olive-green to silver coloration",
    fishingSeason: "Summer months (May-August)",
    economicValue: "Used for aquatic weed control and as a food fish",
    image: "🌿",
    color: "#27AE60"
  },
  "Mirror Carp": {
    scientificName: "Cyprinus carpio specularis",
    family: "Cyprinidae",
    habitat: "Ponds, lakes, and slow-moving rivers",
    diet: "Omnivorous - plants, insects, and small aquatic organisms",
    maxSize: "100 cm",
    maxWeight: "30 kg",
    conservationStatus: "Least Concern",
    features: "Distinctive mirror-like appearance with large, irregular scales",
    fishingSeason: "Spring and autumn (March-May, September-November)",
    economicValue: "Popular among anglers and in ornamental ponds",
    image: "🪞",
    color: "#9B59B6"
  },
  "Mrigal": {
    scientificName: "Cirrhinus cirrhosus",
    family: "Cyprinidae",
    habitat: "Rivers, reservoirs, and aquaculture ponds",
    diet: "Omnivorous - algae, plants, and organic debris",
    maxSize: "100 cm",
    maxWeight: "12.7 kg",
    conservationStatus: "Least Concern",
    features: "Elongated body with small scales, silver-gray coloration, and a blunt snout",
    fishingSeason: "Monsoon season (June-September)",
    economicValue: "Important species in polyculture systems",
    image: "🐟",
    color: "#1ABC9C"
  },
  "Nile Tilapia": {
    scientificName: "Oreochromis niloticus",
    family: "Cichlidae",
    habitat: "Warm freshwater lakes, rivers, and ponds",
    diet: "Omnivorous - algae, plants, and small invertebrates",
    maxSize: "60 cm",
    maxWeight: "4.3 kg",
    conservationStatus: "Least Concern",
    features: "Vertical stripes on tail, red-edged fins, and a pointed snout",
    fishingSeason: "Throughout the year in tropical regions",
    economicValue: "Most widely farmed fish globally",
    image: "🐠",
    color: "#F39C12"
  },
  "Rohu": {
    scientificName: "Labeo rohita",
    family: "Cyprinidae",
    habitat: "Rivers, lakes, and reservoirs",
    diet: "Omnivorous - algae, plants, and insects",
    maxSize: "200 cm",
    maxWeight: "45 kg",
    conservationStatus: "Least Concern",
    features: "Streamlined body with a pointed snout, silver-gray color, and reddish fins",
    fishingSeason: "Monsoon season (June-September)",
    economicValue: "One of the most important food fish in Indian subcontinent",
    image: "🐡",
    color: "#E74C3C"
  },
  "Silver Carp": {
    scientificName: "Hypophthalmichthys molitrix",
    family: "Cyprinidae",
    habitat: "Large rivers, lakes, and reservoirs",
    diet: "Phytoplankton and zooplankton",
    maxSize: "100 cm",
    maxWeight: "50 kg",
    conservationStatus: "Near Threatened",
    features: "Silver-white body with a keel between pelvic fins, large head, and upturned mouth",
    fishingSeason: "Summer months (May-August)",
    economicValue: "Important for food and as a filter feeder in aquaculture",
    image: "✨",
    color: "#BDC3C7"
  },
  "Striped Catfish": {
    scientificName: "Pangasianodon hypophthalmus",
    family: "Pangasiidae",
    habitat: "Large rivers and floodplains",
    diet: "Omnivorous - fish, crustaceans, and plant matter",
    maxSize: "130 cm",
    maxWeight: "44 kg",
    conservationStatus: "Vulnerable",
    features: "Prominent stripes on sides, shark-like appearance, and whisker-like barbels",
    fishingSeason: "Dry season (November-March)",
    economicValue: "Major aquaculture species for export",
    image: "🦈",
    color: "#34495E"
  }
};

// List of all fish species in order (matches model output)
const FISH_SPECIES = [
  "Black Rohu", "Catla", "Common Carp", "Grass Carp",
  "Mirror Carp", "Mrigal", "Nile Tilapia",
  "Rohu", "Silver Carp", "Striped Catfish"
];

// Background video file path
const BACKGROUND_VIDEO = require('./assets/videos/background.mp4');

// ========== MAIN APP COMPONENT ==========
const App = () => {
  // State variables - store changing data
  const [isModelReady, setIsModelReady] = useState(false);      // AI model loaded?
  const [selectedImage, setSelectedImage] = useState(null);     // Current image
  const [isProcessing, setIsProcessing] = useState(false);      // Analyzing?
  const [prediction, setPrediction] = useState(null);           // Result
  const [allPredictions, setAllPredictions] = useState([]);     // Top 5 guesses
  const [showSplash, setShowSplash] = useState(true);           // Show splash screen?
  const [selectedFishInfo, setSelectedFishInfo] = useState(null); // Details of identified fish
  const [settingsVisible, setSettingsVisible] = useState(false); // Settings menu open?
  const [language, setLanguage] = useState('en');                // Current language (en/hi/bn/te/mr/ta)
  const [isFromCamera, setIsFromCamera] = useState(false);       // Was image from camera?
  const t = translations[language];                              // Get translated text

  // ========== LOAD AI MODEL ON START ==========
  useEffect(() => {
    loadModel(); // Run once when app starts
  }, []);

  // Load the TensorFlow Lite model
  const loadModel = async () => {
    try {
      console.log('Loading model...');
      await preloadModel(require('./assets/model/best_float32.tflite'), {
        delegate: Platform.OS === 'android' ? 'gpu' : undefined, // Use GPU on Android
      });
      setIsModelReady(true);
      console.log('✅ Model loaded successfully');
    } catch (error) {
      console.error('❌ Model loading failed:', error);
      Alert.alert('Error', 'Failed to load model: ' + error.message);
    }
  };

  // ========== IMAGE PROCESSING HELPERS ==========
  
  // Convert base64 string to array of numbers
  const base64ToUint8Array = (base64) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  // Prepare image for AI model - resize, normalize, add padding
  const preprocessImage = (imageData, width, height, targetSize = 224) => {
    // Create empty array for the image data
    const inputTensor = new Float32Array(1 * targetSize * targetSize * 3);
    
    // Calculate how to resize while keeping aspect ratio
    const scale = Math.min(targetSize / height, targetSize / width);
    const newWidth = Math.floor(width * scale);
    const newHeight = Math.floor(height * scale);
    
    // Calculate padding position (center the image)
    const left = Math.floor((targetSize - newWidth) / 2);
    const top = Math.floor((targetSize - newHeight) / 2);
    
    // Fill with gray padding first (value 114/255 = 0.447)
    const padValue = 114 / 255.0;
    for (let i = 0; i < inputTensor.length; i++) {
      inputTensor[i] = padValue;
    }
    
    // Calculate scaling ratios
    const xRatio = newWidth / width;
    const yRatio = newHeight / height;
    
    // Copy image pixels into the padded area
    for (let y = 0; y < targetSize; y++) {
      for (let x = 0; x < targetSize; x++) {
        if (y >= top && y < top + newHeight && x >= left && x < left + newWidth) {
          const srcX = Math.floor((x - left) / xRatio);
          const srcY = Math.floor((y - top) / yRatio);
          
          if (srcX >= 0 && srcX < width && srcY >= 0 && srcY < height) {
            const pixelIndex = (srcY * width + srcX) * 4;
            // Normalize RGB values to 0-1 range
            const r = imageData[pixelIndex] / 255.0;
            const g = imageData[pixelIndex + 1] / 255.0;
            const b = imageData[pixelIndex + 2] / 255.0;
            
            const idx = (y * targetSize + x) * 3;
            inputTensor[idx] = r;
            inputTensor[idx + 1] = g;
            inputTensor[idx + 2] = b;
          }
        }
      }
    }
    
    return inputTensor;
  };

  // Decode JPEG to raw pixel data
  const decodeJpegToTensor = async (base64) => {
    const u8 = base64ToUint8Array(base64);
    const decoded = jpeg.decode(u8, { useTArray: true });
    const { data, width, height } = decoded;
    console.log('📸 Original image size:', width, 'x', height);
    return preprocessImage(data, width, height, 224);
  };

  // Get confidence scores from model output
  const parseModelOutput = (output) => {
    const classScores = new Array(10).fill(0);
    
    let flatData = null;
    
    // Extract the numbers from model output
    if (Array.isArray(output) && output.length === 1 && output[0] instanceof Float32Array) {
      flatData = output[0];
    } else if (output instanceof Float32Array) {
      flatData = output;
    } else {
      console.error('❌ Could not parse output');
      return classScores;
    }
    
    // Model output structure: [1, 14, 1029]
    // Fish species are in channels 4 to 13
    const numChannels = 14;
    const numPositions = 1029;
    
    // Find highest score for each fish species
    for (let c = 0; c < 10; c++) {
      const channelIdx = 4 + c;
      let maxScore = 0;
      
      for (let pos = 0; pos < numPositions; pos++) {
        const idx = channelIdx * numPositions + pos;
        if (idx < flatData.length) {
          const score = flatData[idx];
          if (score > maxScore) {
            maxScore = score;
          }
        }
      }
      classScores[c] = maxScore;
    }
    
    return classScores;
  };

  // ========== MAIN IDENTIFICATION FUNCTION ==========
  // This is where the magic happens - identifies fish from image
  const processImage = async (uri, fromCamera = false) => {
    // Check if AI model is ready
    if (!isModelReady) {
      Alert.alert('Error', 'Please wait for model to load');
      return;
    }

    // Show loading spinner
    setIsProcessing(true);
    setPrediction(null);
    setAllPredictions([]);
    setSelectedFishInfo(null);
    setIsFromCamera(fromCamera); // Remember if image came from camera
    
    try {
      // Step 1: Resize image to 224x224
      const resized = await ImageResizer.createResizedImage(uri, 224, 224, 'JPEG', 90, 0);
      
      // Step 2: Convert to base64
      const base64 = await RNFS.readFile(resized.uri, 'base64');
      
      // Step 3: Convert to pixel array for model
      const inputTensor = await decodeJpegToTensor(base64);
      
      // Step 4: Run AI model
      const model = getModel();
      if (!model) throw new Error('Model not available');
      
      const output = await runModelFlexible(inputTensor);
      let classScores = parseModelOutput(output);
      
      // ========== CAMERA IMAGE PENALTY ==========
      // If photo was taken by camera (not from gallery), reduce confidence
      // This makes camera photos always show as "Unknown"
      if (fromCamera) {
        console.log('📸 Camera image detected - FORCING confidence below 47%');
        
        // Reduce all confidence scores by 80% (multiply by 0.2)
        // Cap maximum at 40%
        classScores = classScores.map(score => {
          let reducedScore = score * 0.35;  // 65% reduction
          return Math.min(reducedScore, 0.40); // Max 40%
        });
        
        console.log('Camera penalty applied - max confidence capped at 40%');
      }
      
      // Step 5: Create list of predictions
      const predictions = classScores
        .map((prob, idx) => ({
          index: idx,
          species: FISH_SPECIES[idx],
          probability: prob,
          percent: (prob * 100).toFixed(2)
        }))
        .sort((a, b) => b.probability - a.probability); // Sort highest first
      
      const top1 = predictions[0]; // Best guess
      const top2 = predictions[1]; // Second best guess
      
      console.log(`📊 Predictions (${fromCamera ? 'Camera' : 'Gallery'}):`);
      console.log(`  Top: ${top1.species} (${top1.percent}%)`);
      console.log(`  Second: ${top2.species} (${top2.percent}%)`);
      
      // Step 6: Decide if this is a known fish or unknown
      let isUnknown = false;
      
      if (fromCamera) {
        // Camera images: ALWAYS show as "Unknown"
        isUnknown = true;
        console.log(`📸 Camera image - forced as Unknown Species`);
      } else {
        // Gallery images: Check confidence thresholds
        if (top1.probability < UNKNOWN_THRESHOLD) {
          isUnknown = true; // Confidence too low
        } else if ((top1.probability - top2.probability) < AMBIGUITY_THRESHOLD) {
          isUnknown = true; // Top 2 guesses too close
        }
      }
      
      // Step 7: Create result object
      let finalPrediction;
      if (isUnknown) {
        // Unknown fish - don't show details
        finalPrediction = {
          label: t.unknownSpecies,
          confidence: top1.percent,
          isUnknown: true,
          topGuess: top1.species, // Show closest guess
          topGuessConfidence: top1.percent,
          fromCamera: fromCamera
        };
        setSelectedFishInfo(null);
      } else {
        // Known fish - show all details
        const fishInfo = FISH_BASE_DATA[top1.species];
        finalPrediction = {
          label: top1.species,
          confidence: top1.percent,
          isUnknown: false,
          fishInfo: fishInfo,
          fromCamera: fromCamera
        };
        setSelectedFishInfo(fishInfo);
      }
      
      // Step 8: Update UI with results
      setPrediction(finalPrediction);
      setAllPredictions(predictions.slice(0, 5)); // Show top 5
      setSelectedImage(uri);
      
    } catch (error) {
      console.error('Inference error:', error);
      Alert.alert('Error', 'Failed to process image: ' + error.message);
    } finally {
      setIsProcessing(false); // Hide loading spinner
    }
  };

  // ========== PICK IMAGE FROM GALLERY ==========
  const pickImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.9,
      includeBase64: false,
    };
    
    launchImageLibrary(options, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Error', response.errorMessage || 'Failed to pick image');
        return;
      }
      if (response.assets && response.assets[0]) {
        processImage(response.assets[0].uri, false); // false = from gallery
      }
    });
  };

  // ========== TAKE PHOTO WITH CAMERA ==========
  const takePhoto = async () => {
    // Request camera permission on Android
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
      if (!granted) {
        Alert.alert('Permission denied', 'Camera permission is required');
        return;
      }
    }
    
    const options = {
      mediaType: 'photo',
      quality: 0.9,
      cameraType: 'back',
      includeBase64: false,
    };
    
    launchCamera(options, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Error', response.errorMessage || 'Failed to take photo');
        return;
      }
      if (response.assets && response.assets[0]) {
        processImage(response.assets[0].uri, true); // true = from camera
      }
    });
  };

  // ========== HELPER FUNCTIONS FOR DISPLAY ==========
  
  // Get conservation status text in selected language
  const getConservationStatusText = (status) => {
    if (status.includes("Vulnerable")) return t.vulnerable;
    if (status.includes("Near Threatened")) return t.nearThreatened;
    return t.leastConcern;
  };

  // Get color for conservation status badge
  const getStatusColor = (status) => {
    if (status.includes("Vulnerable")) return "#E74C3C";      // Red
    if (status.includes("Near Threatened")) return "#F39C12"; // Orange
    return "#27AE60"; // Green
  };

  // ========== FISH INFO CARD COMPONENT ==========
  // Shows detailed information about identified fish
  const FishInfoCard = ({ info, speciesKey }) => {
    if (!info) return null;
    
    // Get translated fish name and description
    const translatedName = t.fishNames?.[speciesKey] || speciesKey;
    const translatedDescription = t.fishDescriptions?.[speciesKey] || "Information about this fish species.";
    
    return (
      <View style={styles.infoWrapper}>
        {/* Header with fish emoji, name, and conservation status */}
        <View style={[styles.infoHeaderCard, { backgroundColor: info.color + '15' }]}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerEmoji}>{info.image}</Text>
            <View>
              <Text style={styles.fishName}>{translatedName}</Text>
              <Text style={styles.scientificName}>{info.scientificName}</Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(info.conservationStatus) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(info.conservationStatus) }]}>
              {getConservationStatusText(info.conservationStatus)}
            </Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionText}>{translatedDescription}</Text>
        </View>

        {/* Size, Weight, Family - 3 column grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>📏</Text>
            <Text style={styles.statLabel}>{t.maximumSize}</Text>
            <Text style={styles.statValue}>{info.maxSize}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>⚖️</Text>
            <Text style={styles.statLabel}>{t.maximumWeight}</Text>
            <Text style={styles.statValue}>{info.maxWeight}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🏠</Text>
            <Text style={styles.statLabel}>{t.family}</Text>
            <Text style={styles.statValue}>{info.family}</Text>
          </View>
        </View>

        {/* Habitat section */}
        <View style={styles.infoSectionCard}>
          <Text style={styles.sectionTitle}>🌊 {t.habitat}</Text>
          <Text style={styles.sectionText}>{info.habitat}</Text>
        </View>

        {/* Diet section */}
        <View style={styles.infoSectionCard}>
          <Text style={styles.sectionTitle}>🍽️ {t.diet}</Text>
          <Text style={styles.sectionText}>{info.diet}</Text>
        </View>

        {/* Physical features */}
        <View style={styles.infoSectionCard}>
          <Text style={styles.sectionTitle}>🔍 {t.physicalFeatures}</Text>
          <Text style={styles.sectionText}>{info.features}</Text>
        </View>

        {/* Fishing season and economic value - 2 columns */}
        <View style={styles.infoRow2Cols}>
          <View style={styles.halfCard}>
            <Text style={styles.sectionTitle}>🎣 {t.fishingSeason}</Text>
            <Text style={styles.sectionText}>{info.fishingSeason}</Text>
          </View>
          <View style={styles.halfCard}>
            <Text style={styles.sectionTitle}>💰 {t.economicValue}</Text>
            <Text style={styles.sectionText}>{info.economicValue}</Text>
          </View>
        </View>
      </View>
    );
  };

  // ========== MAIN APP UI ==========
  const MainApp = () => (
    <>
      {/* Menu button (three lines) at top left */}
      <MenuButton onPress={() => setSettingsVisible(true)} />
      
      {/* Background video playing behind everything */}
      <BackgroundVideo videoSource={BACKGROUND_VIDEO} opacity={0.3}>
        <SafeAreaView style={styles.container}>
          <ScrollView 
            contentContainerStyle={styles.scrollContent} 
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* App title */}
            <Text style={styles.title}>{t.appName}</Text>
            <Text style={styles.subtitle}>{t.appSubtitle}</Text>
            
            {/* Gallery and Camera buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.button, styles.galleryButton]} 
                onPress={pickImage}
                disabled={!isModelReady || isProcessing}
              >
                <Text style={styles.buttonText}>{t.gallery}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.cameraButton]} 
                onPress={takePhoto}
                disabled={!isModelReady || isProcessing}
              >
                <Text style={styles.buttonText}>{t.camera}</Text>
              </TouchableOpacity>
            </View>
            
            {/* Show selected image preview */}
            {selectedImage && (
              <View style={[styles.imageContainer, styles.glassEffect]}>
                <Image source={{ uri: selectedImage }} style={styles.previewImage} />
              </View>
            )}
            
            {/* Show loading spinner while processing */}
            {isProcessing && (
              <View style={[styles.processingContainer, styles.glassEffect]}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.processingText}>{t.analyzing}</Text>
              </View>
            )}
            
            {/* Show identification result */}
            {prediction && !isProcessing && (
              <>
                <View style={[styles.resultContainer, styles.glassEffect]}>
                  <Text style={styles.resultTitle}>
                    {prediction.isUnknown ? t.analysisResult : t.identifiedSpecies}
                  </Text>
          
                  {prediction.isUnknown ? (
                    // Unknown fish display
                    <>
                      <Text style={styles.unknownText}>{prediction.label}</Text>
                      <Text style={styles.confidence}>
                        {t.confidence}: {prediction.confidence}%
                      </Text>
                      {prediction.topGuess && (
                        <View style={styles.topGuessContainer}>
                          <Text style={styles.topGuessText}>
                            {t.closestMatch}: {t.fishNames?.[prediction.topGuess] || prediction.topGuess}
                          </Text>
                          <Text style={styles.topGuessSubtext}>
                            ({prediction.topGuessConfidence}% {t.confidence.toLowerCase()})
                          </Text>
                        </View>
                      )}
                      <Text style={styles.unknownMessage}>
                        {t.notInDatabase}
                      </Text>
                      <Text style={styles.unknownTip}>
                        {t.tip}
                      </Text>
                    </>
                  ) : (
                    // Known fish display
                    <>
                      <Text style={styles.speciesName}>
                        {t.fishNames?.[prediction.label] || prediction.label} {FISH_BASE_DATA[prediction.label]?.image}
                      </Text>
                      <Text style={styles.confidence}>
                        {t.confidence}: {prediction.confidence}%
                      </Text>
                    </>
                  )}
                </View>
                
                {/* Show detailed fish info if identified */}
                {selectedFishInfo && (
                  <FishInfoCard 
                    info={selectedFishInfo} 
                    speciesKey={prediction?.label}
                  />
                )}
              </>
            )}
            
            {/* Show other possible matches (top 5) */}
            {allPredictions.length > 0 && !isProcessing && (
              <>
                <Text style={[styles.otherTitle, styles.textWhite]}>{t.otherMatches}</Text>
                {allPredictions.slice(1).map((pred, idx) => (
                  <TouchableOpacity 
                    key={idx} 
                    style={[styles.predictionRow, styles.glassEffect]}
                    onPress={() => {
                      Alert.alert(
                        t.infoTitle,
                        `${t.infoMessage} ${t.fishNames?.[pred.species] || pred.species}`,
                        [{ text: t.ok }]
                      );
                    }}
                  >
                    <Text style={styles.predictionName}>
                      {idx + 2}. {t.fishNames?.[pred.species] || pred.species}
                    </Text>
                    <View style={styles.progressBarContainer}>
                      <View 
                        style={[
                          styles.progressBar, 
                          { 
                            width: `${pred.probability * 100}%`,
                            backgroundColor: '#FF9800'
                          }
                        ]} 
                      />
                      <Text style={styles.predictionProb}>{pred.percent}%</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </>
            )}
            
            {/* Instructions when no image selected */}
            {!selectedImage && !isProcessing && (
              <View style={[styles.instructions, styles.glassEffect]}>
                <Text style={styles.instructionText}>
                  {t.uploadInstruction}
                </Text>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </BackgroundVideo>
      
      {/* Settings modal popup */}
      <SettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
        currentLanguage={language}
        onLanguageChange={setLanguage}
      />
    </>
  );

  // Show splash screen first, then main app
  if (showSplash) {
    return <SplashScreen onAnimationComplete={() => setShowSplash(false)} />;
  }

  return <MainApp />;
};

// ========== STYLES ==========
// All the visual styling for components
const styles = StyleSheet.create({
  container: {
    flex: 1, // Take full screen
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    paddingTop: 60, // Space for menu button
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 14,
    color: '#E0E0E0',
    textAlign: 'center',
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  glassEffect: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // Frosted glass look
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonRow: {
    flexDirection: 'row', // Side by side
    justifyContent: 'space-around',
    marginBottom: 16,
    gap: 12,
  },
  button: {
    flex: 1, // Equal width
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  galleryButton: {
    backgroundColor: '#2196F3', // Blue
  },
  cameraButton: {
    backgroundColor: '#FF9800', // Orange
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  imageContainer: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
  },
  previewImage: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  processingContainer: {
    padding: 20,
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 16,
  },
  processingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  resultContainer: {
    padding: 16,
    borderRadius: 12,
    elevation: 3,
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 12,
    textAlign: 'center',
  },
  speciesName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  unknownText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF9800',
    textAlign: 'center',
    marginBottom: 8,
  },
  confidence: {
    fontSize: 16,
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 5,
    fontWeight: '600',
  },
  otherTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  textWhite: {
    color: '#FFFFFF',
  },
  predictionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    padding: 10,
    borderRadius: 10,
  },
  predictionName: {
    fontSize: 13,
    color: '#333',
    width: 100,
    fontWeight: '500',
  },
  predictionProb: {
    fontSize: 11,
    color: '#333',
    fontWeight: '500',
    position: 'absolute',
    right: 8,
  },
  instructions: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 15,
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '500',
  },
  progressBarContainer: {
    flex: 1,
    height: 24,
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    overflow: 'hidden',
    marginLeft: 10,
    position: 'relative',
    justifyContent: 'center',
  },
  progressBar: {
    height: '100%',
    borderRadius: 12,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  topGuessContainer: {
    backgroundColor: '#FFF3E0',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  topGuessText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF9800',
  },
  topGuessSubtext: {
    fontSize: 11,
    color: '#F57C00',
    marginTop: 4,
  },
  unknownMessage: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  unknownTip: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
    marginTop: 6,
  },
  infoWrapper: {
    marginBottom: 12,
  },
  infoHeaderCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: '#fff',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerEmoji: {
    fontSize: 48,
  },
  fishName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  scientificName: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#666',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  descriptionCard: {
    padding: 14,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  descriptionText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  statsGrid: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    gap: 10,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
  },
  statEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#666',
    marginBottom: 2,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  infoSectionCard: {
    padding: 14,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 6,
  },
  sectionText: {
    fontSize: 12,
    color: '#555',
    lineHeight: 18,
  },
  infoRow2Cols: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    overflow: 'hidden',
    gap: 1,
  },
  halfCard: {
    flex: 1,
    padding: 14,
    backgroundColor: '#fff',
  },
});

export default App;