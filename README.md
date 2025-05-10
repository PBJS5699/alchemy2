Project Structure

/alchemy2
├── /public                      # Static assets
│   ├── /assets                  # Images, icons, etc.
│   └── /sample-data             # Example datasets
│
├── /src                         # Source code
│   ├── /app                     # Next.js app routes
│   │   ├── /api                 # API routes
│   │   │   ├── /auth            # Authentication endpoints
│   │   │   ├── /workflows       # Workflow management
│   │   │   ├── /processing      # Image processing
│   │   │   ├── /ml              # Machine learning
│   │   │   └── /assistant       # AI assistant
│   │   ├── /dashboard           # Main dashboard page
│   │   ├── /projects            # Project management pages
│   │   └── /settings            # User settings pages
│   │
│   ├── /components              # UI components
│   │   ├── /common              # Shared UI components
│   │   │   ├── /buttons
│   │   │   ├── /inputs
│   │   │   ├── /modals
│   │   │   └── /navigation
│   │   │
│   │   ├── /layout              # Layout components
│   │   │
│   ├── /nodes
│   │   ├── /input-output          # File operations
│   │   │   ├── /open-image        # Load images into the workflow
│   │   │   └── /save-as           # Save results
│   │   │
│   │   ├── /preprocessing         # Initial image preparation
│   │   │   ├── /threshold         # All thresholding operations
│   │   │   ├── /background        # Background processing
│   │   │   └── /conversion        # Format conversions
│   │   │
│   │   ├── /segmentation          # Object isolation
│   │   │   ├── /binary-operations # Binary morphological operations
│   │   │   ├── /watershed         # Watershed segmentation
│   │   │   └── /mask              # Masking operations
│   │   │
│   │   ├── /transformation        # Image transformations
│   │   │   ├── /crop              # Cropping operations
│   │   │   └── /calibration       # Scaling and calibration
│   │   │
│   │   ├── /annotation            # Manual drawing and annotation
│   │   │   ├── /drawing           # Drawing tools
│   │   │   └── /boundaries        # Boundary identification
│   │   │
│   │   ├── /analysis              # Measurement and analysis
│   │   │   ├── /particles         # Particle analysis
│   │   │   ├── /measurements      # Distance calculations
│   │   │   └── /specialized       # Domain-specific analyses
│   │   │
│   │   ├── /common                # Shared node components
│   │   │   ├── /base-node         # Base node implementation
│   │   │   ├── /handles           # Input/output handles
│   │   │   └── /parameters        # Parameter controls
│   │   │
│   │   ├── /interactive         # Interactive components
│   │   │   ├── /canvas          # Drawing canvas components
│   │   │   └── /tools           # Interactive tool components
│   │
│   ├── /core                    # Core application logic
│   │   ├── /node-system         # Node system core
│   │   │   └── /types           # Type definitions
│   │   │
│   │   ├── /code-generation     # Code-node synchronization
│   │   │   ├── /parser          # Code parsing modules
│   │   │   └── /generator       # Code generation modules
│   │   │
│   │   │
│   │   ├── /interactive         # Interactive node handling
│   │   │   └── /tools           # Interactive tool implementations
│   │   │
│   │   ├── /ml-system           # ML integration
│   │   │   ├── /models          # ML model definitions
│   │   │   ├── /training        # Training pipeline
│   │   │   ├── /prediction      # Prediction system
│   │   │   └── /feature-extraction # Feature extraction from images
│   │   │
│   │   └── /assistant           # AI assistant implementation
│   │       ├── /agents          # Agent definitions
│   │       ├── /reasoning       # Reasoning modules
│   │       └── /actions         # Agent actions
│   │
│   ├── /hooks                   # Custom React hooks
│   │
│   ├── /lib                     # Utility libraries
│   │   ├── /api-client          # API client functions
│   │   ├── /validators          # Validation utilities
│   │   ├── /helpers             # Helper functions
│   │   └── /transforms          # Data transformation utilities
│   │
│   ├── /store                   # State management
│   │   └── /slices              # Store slices
│   │
│   ├── /styles                  # Global styles
│   │
│   └── /types                   # TypeScript type definitions
│
├── /server                      # Backend server (if separate)
│   ├── /api                     # API endpoints
│   ├── /services                # Business logic services
│   ├── /models                  # Data models
│   └── /utils                   # Utility functions
│
├── /ml                          # ML training scripts & models
│   ├── /models                  # Model definitions
│   ├── /training                # Training scripts
│   └── /inference               # Inference scripts
│
├── /tests                       # Test files
│   ├── /unit                    # Unit tests
│   ├── /integration             # Integration tests
│   └── /e2e                     # End-to-end tests
│
└── /docs                        # Documentation
    ├── /architecture            # Architecture documentation
    ├── /api                     # API documentation
    └── /user-guides             # User guides