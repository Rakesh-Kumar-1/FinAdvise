// // Custom storage engine that handles different storage for different fields
// const customStorage = multer.memoryStorage(); // Default to memory for all files initially

// // We'll use multer with memory storage and then manually handle file saving
// const upload = multer({ 
//   storage: customStorage,
//   limits: {
//     fileSize: 10 * 1024 * 1024, // 10MB limit per file
//   },
//   fileFilter: (req, file, cb) => {
//     if (file.fieldname === 'photo') {
//       // Only accept image files for profile photo
//       if (file.mimetype.startsWith('image/')) {
//         cb(null, true);
//       } else {
//         cb(new Error('Profile photo must be an image file (jpg, jpeg, png, gif, etc.)'), false);
//       }
//     } else if (file.fieldname === 'images') {
//       // Accept PDF and image files for certificates
//       const allowedTypes = [
//         'application/pdf', 
//         'image/jpeg', 
//         'image/jpg', 
//         'image/png',
//         'image/gif',
//         'image/webp'
//       ];
//       if (allowedTypes.includes(file.mimetype)) {
//         cb(null, true);
//       } else {
//         cb(new Error('Certificate files must be PDF or image files (jpg, jpeg, png, gif, webp, pdf)'), false);
//       }
//     } else {
//       cb(new Error('Unexpected field: ' + file.fieldname), false);
//     }
//   }
// }).fields([
//   { name: 'photo', maxCount: 1 },
//   { name: 'images', maxCount: 5 }
// ]);

// // Helper function to generate unique filename
// const generateUniqueFilename = (originalname) => {
//   return new Promise((resolve, reject) => {
//     crypto.randomBytes(12, (err, bytes) => {
//       if (err) reject(err);
//       else resolve(bytes.toString("hex") + path.extname(originalname));
//     });
//   });
// };

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const uploadDir = path.join(__dirname, '..', 'files');

// router.post("/verify", upload, async (req, res) => {
//   let savedFiles = []; // Keep track of saved files for cleanup on error
  
//   try {
//     const { fullname, email, phone, qualification, linkedIn, experience, bio } = req.body;

//     // Validate required fields
//     if (!fullname || !email || !phone || !qualification || !linkedIn || !experience || !bio) {
//       return res.status(400).json({ message: "All fields are required", success: false });
//     }

//     // Check if user already exists
//     const existingUser = await Advisor.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "Advisor already exists", success: false });
//     }

//     // Validate required files
//     if (!req.files || !req.files.photo || !req.files.images) {
//       return res.status(400).json({ 
//         message: "Both profile photo and certificate files are required", 
//         success: false 
//       });
//     }

//     if (req.files.images.length === 0) {
//       return res.status(400).json({ 
//         message: "At least one certificate file is required", 
//         success: false 
//       });
//     }

//     // ===== HANDLE PROFILE PHOTO (Store in MongoDB) =====
//     const photoFile = req.files.photo[0];
//     const profilePhotoBuffer = photoFile.buffer; // Keep in memory for MongoDB
//     const profilePhotoMimetype = photoFile.mimetype;

//     console.log(`Profile photo received: ${photoFile.originalname}, Size: ${photoFile.size} bytes`);

//     // ===== HANDLE CERTIFICATE FILES (Store in Folder) =====
//     const imageFilenames = [];
    
//     for (const file of req.files.images) {
//       try {
//         // Generate unique filename
//         const uniqueFilename = await generateUniqueFilename(file.originalname);
//         const filePath = path.join(uploadDir, uniqueFilename);
        
//         // Write file to disk
//         fs.writeFileSync(filePath, file.buffer);
        
//         imageFilenames.push(uniqueFilename);
//         savedFiles.push(filePath); // Track for cleanup
        
//         console.log(`Certificate saved: ${uniqueFilename}, Original: ${file.originalname}, Size: ${file.size} bytes`);
//       } catch (fileError) {
//         console.error(`Error saving certificate file ${file.originalname}:`, fileError);
//         throw new Error(`Failed to save certificate file: ${file.originalname}`);
//       }
//     }

//     // ===== CREATE ADVISOR IN DATABASE =====
//     const newAdvisor = await Advisor.create({
//       fullname,
//       email,
//       phone,
//       qualification,
//       linkedIn,
//       experience,
//       bio,
//       images: imageFilenames, // Certificate filenames (stored in folder)
//       profilePhoto: {
//         data: profilePhotoBuffer, // Photo buffer (stored in MongoDB)
//         contentType: profilePhotoMimetype,
//       },
//     });

//     console.log(`New advisor created: ${newAdvisor._id}`);
//     console.log(`Profile photo stored in MongoDB, Size: ${profilePhotoBuffer.length} bytes`);
//     console.log(`Certificate files stored in folder: ${imageFilenames.join(', ')}`);

//     return res.status(201).json({
//       message: "Account created successfully. It will be reviewed shortly.",
//       success: true,
//       advisorId: newAdvisor._id
//     });

//   } catch (error) {
//     console.error("Error creating advisor:", error);
    
//     // ===== CLEANUP: Delete saved certificate files if database operation failed =====
//     savedFiles.forEach(filePath => {
//       try {
//         if (fs.existsSync(filePath)) {
//           fs.unlinkSync(filePath);
//           console.log(`Cleaned up file: ${filePath}`);
//         }
//       } catch (cleanupError) {
//         console.error(`Error cleaning up file ${filePath}:`, cleanupError);
//       }
//     });
    
//     // Return appropriate error message
//     if (error.code === 11000) {
//       return res.status(400).json({ 
//         message: "An advisor with this email already exists", 
//         success: false 
//       });
//     }
    
//     return res.status(500).json({ 
//       message: "Internal server error. Please try again.", 
//       success: false 
//     });
//   }
// });

// // ===== ROUTE TO SERVE PROFILE PHOTOS FROM MONGODB =====
// router.get("/photo/:advisorId", async (req, res) => {
//   try {
//     const advisor = await Advisor.findById(req.params.advisorId);
    
//     if (!advisor || !advisor.profilePhoto || !advisor.profilePhoto.data) {
//       return res.status(404).json({ message: "Profile photo not found" });
//     }
    
//     res.set('Content-Type', advisor.profilePhoto.contentType);
//     res.set('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
//     res.send(advisor.profilePhoto.data);
    
//   } catch (error) {
//     console.error("Error retrieving profile photo:", error);
//     res.status(500).json({ message: "Error retrieving profile photo" });
//   }
// });

// // ===== ROUTE TO SERVE CERTIFICATE FILES FROM FOLDER =====
// router.get("/certificate/:filename", (req, res) => {
//   try {
//     const filename = req.params.filename;
//     const filePath = path.join(uploadDir, filename);
    
//     // Security check: ensure filename doesn't contain path traversal
//     if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
//       return res.status(400).json({ message: "Invalid filename" });
//     }
    
//     // Check if file exists
//     if (!fs.existsSync(filePath)) {
//       return res.status(404).json({ message: "Certificate file not found" });
//     }
    
//     // Set appropriate content type based on file extension
//     const ext = path.extname(filename).toLowerCase();
//     let contentType = 'application/octet-stream';
    
//     switch (ext) {
//       case '.pdf':
//         contentType = 'application/pdf';
//         break;
//       case '.jpg':
//       case '.jpeg':
//         contentType = 'image/jpeg';
//         break;
//       case '.png':
//         contentType = 'image/png';
//         break;
//       case '.gif':
//         contentType = 'image/gif';
//         break;
//       case '.webp':
//         contentType = 'image/webp';
//         break;
//     }
    
//     res.set('Content-Type', contentType);
//     res.set('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
//     res.sendFile(filePath);
    
//   } catch (error) {
//     console.error("Error serving certificate file:", error);
//     res.status(500).json({ message: "Error serving certificate file" });
//   }
// });