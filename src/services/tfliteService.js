// tfliteService.js
// Optimized for react-native-fast-tflite with YOLO TFLite model
// This service handles loading and running the AI fish detection model

// ==================== GLOBAL VARIABLES ====================
// These track the state of our AI model throughout the app

let _model = null;           // Stores the loaded AI model object
let _loading = false;       // Prevents multiple simultaneous loading attempts
let _inputDetails = null;   // Stores information about model's expected input format
let _outputDetails = null;  // Stores information about model's output format

// ==================== DEBUG HELPER ====================
// A simple wrapper for console.log to easily identify logs from this service

const debug = (...args) => {
  try { 
    console.log('[tfliteService]', ...args); 
  } catch (e) {} // Silently fail if console is not available
};

// ==================== REQUIRE FAST TFLITE ====================
// Attempts to import the react-native-fast-tflite library
// This library provides high-performance TensorFlow Lite operations

const tryRequireFast = () => {
  try {
    const fast = require('react-native-fast-tflite');
    return fast;
  } catch (e) {
    debug('react-native-fast-tflite not found:', e && e.message);
    throw e; // Re-throw so caller knows the library is missing
  }
};

/**
 * ==================== PRELOAD THE AI MODEL ====================
 * This function loads the .tflite model file into memory
 * 
 * @param {object} modelPath - Usually require('./assets/model/best_float32.tflite')
 * @param {object} options - Configuration like delegate ('cpu', 'gpu', 'npu')
 * @returns {object} - The loaded model object
 * 
 * The function handles:
 * - Preventing multiple simultaneous loads
 * - Caching the model after loading
 * - Detecting and using the appropriate loading method
 */
export const preloadModel = async (modelPath, options = {}) => {
  // STEP 1: Check if model is already loaded
  if (_model) {
    debug('Model already loaded, returning existing model');
    return _model;
  }
  
  // STEP 2: Prevent loading while another load is in progress
  if (_loading) {
    debug('Model loading in progress, waiting...');
    // Wait until loading finishes (check every 50ms)
    while (_loading && !_model) {
      await new Promise((r) => setTimeout(r, 50));
    }
    return _model;
  }

  // STEP 3: Start loading process
  _loading = true;
  try {
    // Get the TFLite library
    const fast = tryRequireFast();

    // Prepare loading options (default to GPU for better performance)
    const modelOptions = {
      delegate: options.delegate || 'gpu',  // 'cpu', 'gpu', or 'npu'
      ...options
    };

    // STEP 4: Try different loading methods based on library version
    
    // Method 1: Modern API (loadTensorflowModel)
    if (typeof fast.loadTensorflowModel === 'function') {
      debug('Calling loadTensorflowModel with options:', modelOptions);
      _model = await fast.loadTensorflowModel(modelPath, modelOptions);
      debug('✅ Model loaded successfully');
      
      // STEP 5: Extract model input/output information (if available)
      if (_model && _model.getInputDetails) {
        _inputDetails = _model.getInputDetails();
        _outputDetails = _model.getOutputDetails();
        debug('Input shape:', _inputDetails?.shape);
        debug('Output shape:', _outputDetails?.shape);
      } else if (_model && _model.inputs) {
        // Fallback: read from model properties directly
        debug('Input shape:', _model.inputs[0]?.shape);
        debug('Output shape:', _model.outputs[0]?.shape);
      }
      
      return _model;
    }

    // Method 2: Legacy API (loadModel)
    if (typeof fast.loadModel === 'function') {
      debug('Calling loadModel (fallback)');
      _model = await fast.loadModel(modelPath, modelOptions);
      debug('✅ Model loaded via loadModel fallback');
      return _model;
    }

    // STEP 6: If no loading method found, throw error
    throw new Error('No loadTensorflowModel / loadModel function found');
  } catch (err) {
    debug('❌ preloadModel error:', err);
    throw err; // Propagate error to caller
  } finally {
    _loading = false; // Always reset loading flag, even on error
  }
};

/**
 * ==================== GET THE LOADED MODEL ====================
 * Simple getter function to access the model from other components
 * 
 * @returns {object|null} - The loaded model or null if not loaded
 */
export const getModel = () => _model;

/**
 * ==================== GET MODEL DETAILS ====================
 * Returns information about the loaded model
 * Useful for debugging and ensuring model compatibility
 * 
 * @returns {object} - Contains input/output shapes and load status
 */
export const getModelDetails = () => {
  return {
    inputDetails: _inputDetails,   // Expected input format (shape, type)
    outputDetails: _outputDetails,  // Expected output format
    isLoaded: !!_model              // Boolean indicating if model is ready
  };
};

/**
 * ==================== RUN MODEL INFERENCE ====================
 * This is the core function that processes an image through the AI model
 * 
 * @param {Float32Array|TypedArray|Array|ArrayBuffer} input - Preprocessed image data
 * @returns {object} - Model output (confidence scores for each fish species)
 * 
 * Input tensor shape: [1, 224, 224, 3] - Batch=1, Height=224, Width=224, RGB=3 channels
 * Output shape: [1, 14, 1029] - Model-specific output format that we parse elsewhere
 * 
 * The function handles:
 * - Converting various input types to Float32Array
 * - Running inference synchronously or asynchronously
 * - Measuring performance (inference time)
 * - Error handling
 */
export const runModelFlexible = async (input) => {
  // STEP 1: Verify model is ready
  if (!_model) {
    throw new Error('Model not loaded. Call preloadModel() first.');
  }

  // STEP 2: Convert input to Float32Array (the format the model expects)
  let tensor = null;

  if (input instanceof Float32Array) {
    // Already in correct format
    tensor = input;
  } else if (ArrayBuffer.isView(input)) {
    // TypedArray (Uint8Array, Int16Array, etc.)
    tensor = new Float32Array(input.buffer);
  } else if (input instanceof ArrayBuffer) {
    // Raw binary data
    tensor = new Float32Array(input);
  } else if (Array.isArray(input)) {
    // Regular JavaScript array
    tensor = new Float32Array(input);
  } else {
    // Unsupported format
    throw new Error('runModelFlexible: input must be Float32Array/TypedArray/Array/ArrayBuffer');
  }

  // STEP 3: Log input size for debugging
  debug(`Running inference with tensor size: ${tensor.length}`);
  const startTime = Date.now(); // Start timing for performance measurement

  try {
    // STEP 4: Run the model inference using available method
    let output;
    
    // Method 1: Synchronous inference (faster, but blocks UI thread)
    if (typeof _model.runSync === 'function') {
      output = _model.runSync([tensor]); // Wrap in array as model expects batch
    } 
    // Method 2: Asynchronous inference (doesn't block UI)
    else if (typeof _model.run === 'function') {
      output = await _model.run([tensor]);
    } 
    // Method 3: No valid inference method found
    else {
      throw new Error('Model does not expose run/runSync methods');
    }

    // STEP 5: Calculate and log inference time
    const inferenceTime = Date.now() - startTime;
    debug(`✅ Inference completed in ${inferenceTime}ms`);

    // STEP 6: Return the raw model output
    // This output will be parsed by parseModelOutput() in App.js
    return output;
  } catch (err) {
    debug('❌ runModelFlexible error:', err);
    throw new Error(`Inference failed: ${err.message}`);
  }
};

/**
 * ==================== CHECK IF MODEL IS READY ====================
 * Quick way to check if model is loaded and not currently loading
 * 
 * @returns {boolean} - True if model is ready to use
 */
export const isModelReady = () => {
  return _model !== null && !_loading;
};

/**
 * ==================== UNLOAD MODEL (CLEANUP) ====================
 * Properly disposes of the model to free up memory
 * Important for large models to prevent memory leaks
 * 
 * @returns {Promise<void>}
 */
export const unloadModel = async () => {
  // Call dispose() if available (cleans up native resources)
  if (_model && typeof _model.dispose === 'function') {
    debug('Unloading model...');
    await _model.dispose();
  }
  
  // Reset all global variables
  _model = null;
  _inputDetails = null;
  _outputDetails = null;
  
  debug('Model unloaded');
};