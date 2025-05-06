const mongoose = require("mongoose");
const User = require("./User");

const architectSchema = new mongoose.Schema(
  {
    //auth
    authMethod: {
      type: String,
      default: "local",
      enum: ["local"],
      required: true,
    },
    firstLogin: { type: Boolean, default: false },

    //personal info
    profilePicture: { type: String }, // URL to profile image
    bio: { type: String }, // Paragraph about the architect
    phoneNumber: { type: String },

    //business info
    companyName: { type: String },
    companyLogo: { type: String }, // URL to company logo
    experienceYears: { type: Number },
    specialization: { type: [String] }, // Array of specializations
    specialty: { type: String }, // Primary specialty
    certification: { type: String }, // Primary certification
    isVerified: { type: Boolean, default: false }, // Verification status
    portfolioURL: { type: String },
    certifications: { type: [String] },
    patenteNumber: { type: String, required: true },
    cin: { type: String, required: true },

    //portfolio
    portfolio: [{ type: String }], // Array of image URLs showcasing work

    education: {
      degree: { type: String },
      institution: String,
      graduationYear: Number,
    },

    softwareProficiency: [
      {
        name: { type: String },
        level: {
          type: String,
          enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
        },
      },
    ],

    location: {
      country: { type: String },
      region: { type: String },
      city: { type: String },
      coordinates: {
        type: { type: String, enum: ["Point"] },
        coordinates: {
          type: [Number],
          validate: {
            validator: function (arr) {
              return arr.length === 2;
            },
            message: "Coordinates must be an array of [longitude, latitude]",
          },
        },
      },
    },

    website: { type: String },
    socialMedia: {
      linkedin: String,
      instagram: String,
      facebook: String,
      twitter: String,
    },

    // Languages spoken
    languages: [
      {
        language: String,
        proficiency: {
          type: String,
          enum: ["Basic", "Intermediate", "Fluent", "Native", "Professional"],
          default: "Intermediate",
        },
      },
    ],

    // Project types
    projectTypes: [{ type: String }], // e.g., Residential, Commercial, Industrial, etc.

    // Service offerings
    services: [
      {
        type: String,
        enum: [
          // Architectural Design
          "Residential Architecture",
          "Commercial Architecture",
          "Industrial Architecture",
          "Renovation and Adaptive Reuse",
          "Space Programming and Planning",
          "Conceptual/Schematic Design",
          "Design Development",
          "Construction Documentation",
          "Building Code and Code Compliance",

          // Interior Design
          "Client Consultation and Programming",
          "Interior Space Planning",
          "Interior Concept Development",
          "3D Interior Renderings and Visualization",
          "Material and Finish Selection",
          "Lighting and Color Design",
          "Furniture, Fixtures & Equipment (FF&E)",
          "Interior Renovation and Restoration",
          "Interior Project Coordination and Management",

          // Landscape Architecture
          "Site Analysis and Conceptual Landscape Design",
          "Landscape Master Planning",
          "Planting Design",
          "Hardscape Design",
          "Water Feature Design",
          "Sustainability and Environmental Landscape Design",
          "Urban and Streetscape Design",
          "Landscape Construction Documentation and Administration",
          "Landscape Maintenance and Management Planning",

          // Urban Planning
          "Land Use and Zoning Analysis",
          "Site Planning and Subdivision Layout",
          "Zoning Code Preparation",
          "Comprehensive and Master Planning",
          "Urban Design and Redevelopment",
          "Resilience and Sustainability Planning",
          "Community Engagement in Planning",
          "GIS and Urban Data Analysis",

          // Specialized Consulting
          "Sustainability Consulting",
          "Heritage and Historic Preservation",
          "Accessibility Consulting",

          // Project Management and Supervision
          "Project Scheduling and Cost Control",
          "Contract and Tender Management",
          "Construction Supervision",
          "Quality Assurance and Quality Control",
          "Progress Monitoring and Reporting",
          "Safety and Compliance Oversight",
          "Punch List and Project Closeout",

          // Feasibility and Site Analysis
          "Site Inventory and Analysis",
          "Concept Feasibility Studies",
          "Regulatory Feasibility Analysis",
          "Market and Program Studies",
          "Environmental and Impact Assessments",

          // 3D Modeling and BIM
          "3D CAD Modeling",
          "Building Information Modeling (BIM)",
          "3D Renderings and Visualizations",
          "Virtual and Augmented Reality",
          "Laser Scanning and Point-Cloud Services",

          // Permit Drawings and Approvals
          "Permit Drawing Preparation",
          "Regulatory Submissions",
          "Code Compliance Documentation",
          "Official Hearings and Negotiations",
        ],
      },
    ],

    //for the stats
    stats: {
      projects: { type: Number, default: 0 }, // Number of completed projects
      reviews: { type: Number, default: 0 }, // Number of reviews
      earnings: { type: Number, default: 0 }, // Earnings in USD
      views: { type: Number, default: 0 }, // Profile views
    },
    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    profileViews: { type: Number, default: 0 },
    profileViewsTimestamps: [{ type: Date }],

    reviews: [
      {
        client: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        comment: { type: String },
        rating: { type: Number },
        date: { type: Date, default: Date.now },
      },
    ],

    //for the clients
    clientsCount: { type: Number, default: 0 },
    clients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ArchitectClient",
      },
    ],
    //subs
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
    },
    subscriptionType: {
      type: String,
      enum: ["Free", "premium", "vip", "none"],
      default: "none",
    },

    //stripe/payment
    customerId: { type: String },
    priceId: { type: String },
    hasAccess: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },

    //admin verification
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionDetails: {
      reason: {
        type: String,
        enum: [
          "Incomplete Documentation",
          "Invalid Professional Credentials",
          "Insufficient Portfolio Quality",
          "Duplicate Account",
          "Inappropriate Content",
          "Terms Violation",
          "Other",
        ],
      },
      customReason: { type: String }, // For "Other" or additional details
      rejectedAt: { type: Date },
    },

    documents: [{ type: String }],
    isActive: { type: Boolean, default: true },

    termsAccepted: {
      content: { type: Boolean, default: false },
      cgvCgu: { type: Boolean, default: false },
      privacy: { type: Boolean, default: false },
      lastUpdated: Date,
    },
  },
  { timestamps: true }
);

architectSchema.index({ "location.coordinates": "2dsphere" });

module.exports = User.discriminator("architect", architectSchema);
