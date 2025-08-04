# 🚀 StartwiseAI - AI-Powered Startup Evaluation Platform

## 📋 Table of Contents

- [🌟 Overview](#-overview)
- [✨ Features](#-features)
- [💻 Technology Stack](#-technology-stack)
- [🏗️ Project Architecture](#️-project-architecture)
- [🚀 Getting Started](#-getting-started)
- [🔧 Backend Architecture](#-backend-architecture)
- [🌐 Flowise API Integration](#-flowise-api-integration)
- [📖 Usage Guide](#-usage-guide)
- [📁 Project Structure](#-project-structure)
- [🔄 Development Workflow](#-development-workflow)
- [🛠️ Troubleshooting](#️-troubleshooting)
- [🤝 Contributing](#-contributing)

## 🌟 Overview

**StartwiseAI** is an advanced startup idea evaluation platform that provides comprehensive analysis using RAG (Retrieval-Augmented Generation) and AI-powered insights. Unlike simple pitch deck generators, StartwiseAI evaluates your startup from multiple angles to give you actionable, data-driven recommendations.

### Key Value Propositions:

- **Comprehensive Analysis**: 6-section evaluation framework covering all aspects of startup viability
- **AI-Powered Insights**: Uses advanced Flowise API integration for intelligent analysis
- **RAG Technology**: Retrieval-Augmented Generation for context-aware evaluations
- **Professional Output**: Investor-ready pitch generation and market analysis
- **Real-time Processing**: Fast evaluation with robust error handling and fallback systems

## ✨ Features

### 🎯 Core Features

- **Startup Idea Evaluation**: Comprehensive analysis of business concepts
- **Uniqueness Assessment**: Competitor analysis and market differentiation
- **Tech Stack Recommendations**: Technology choices based on project requirements
- **Pitch Generation**: Professional elevator pitches for investors
- **Market Analysis**: Similar startups analysis and improvement suggestions
- **Success Probability**: Data-driven market statistics and risk assessment

### 🔧 Technical Features

- **Flowise API Integration**: Custom endpoint for AI processing
- **File Upload Support**: Attach documents for enhanced analysis
- **Responsive Design**: Mobile-first UI with Tailwind CSS
- **Error Handling**: Robust fallback systems and user feedback
- **Real-time Loading**: Smooth user experience with loading states
- **Content Cleaning**: Removes AI artifacts and formats responses

## 💻 Technology Stack

### Frontend

- **React 18**: Modern UI library with hooks and context
- **TypeScript**: Type-safe development experience
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Beautiful and accessible component library
- **GSAP**: High-performance animations
- **Framer Motion**: Smooth animations and transitions
- **Vite**: Fast build tool and dev server
- **React Router**: Client-side routing
- **TanStack Query**: Data fetching and caching

### Backend Integration

- **Flowise API**: Custom AI agent endpoint
- **REST API**: HTTP communication with JSON payloads
- **File Processing**: Base64 encoding for file uploads
- **Error Recovery**: Fallback response generation
- **Multi-Service Architecture**: Extended API functionality with multiple service layers

### Development Tools

- **ESLint**: Code linting and formatting
- **PostCSS**: CSS processing and optimization
- **Bun**: Fast package manager and runtime

## 🏗️ Project Architecture

### Data Flow Overview

```
User Input → Frontend Validation → Service Layer → HTTP Request → Flowise API → AI Agent → RAG Processing → Response → Content Cleaning → Section Parsing → UI Display
```

### Core Components

1. **Landing Page** (`src/pages/Index.tsx`) - Main entry point with hero section
2. **Evaluation Interface** (`src/pages/PitchFormPage.tsx`) - Dedicated evaluation page
3. **Service Layer** (`src/services/flowiseApi.ts`) - Primary API integration
4. **UI Components** (`src/components/`) - Reusable React components
5. **Flowise Integration** (Custom API endpoint) - AI processing backend

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or bun package manager
- Flowise API endpoint running locally
- ChromaDB setup for vector storage

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd ai-pitch-builder

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun dev
```

### 🔧 Setting Up Your Flowise RAG Agent

#### Step 1: Install Flowise

```bash
npm install -g flowise
npx flowise start
```

#### Step 2: Create RAG Agent Flow

1. **Open Flowise UI**: Navigate to `http://localhost:3000`
2. **Create New Chatflow**: Click "Add New Chatflow"
3. **Add Document Loader**:
   - Drag "Custom Document Loader" node
   - Configure for PDF, DOCX, TXT file support
4. **Add Text Splitter**:
   - Use "Recursive Character Text Splitter"
   - Set chunk size: 1000, overlap: 200
5. **Add Embeddings**:
   - Use "HuggingFace Embeddings"
   - Model: "all-MiniLM-L6-v2"
6. **Add Vector Store**:
   - Use "ChromaDB" node
   - Collection name: "startup_knowledge_base"
7. **Add Retrieval Tool**:
   - Connect to ChromaDB for similarity search
   - Set top_k: 10, similarity threshold: 0.7
8. **Add GPT Agent**:
   - Use "GPT-4" or "GPT-3.5-turbo"
   - Connect retrieval tool as available tool
9. **Configure Agent Memory**:
   - Add "Agent Memory" for conversation context
10. **Add End Node**:
    - Final response formatting

#### Step 3: Configure Agent Prompt

```text
You are an expert startup advisor with access to a comprehensive knowledge base.
Analyze the provided startup idea and return a structured evaluation covering:

1. Uniqueness Check - Market differentiation and competitive analysis
2. Tech Stack Recommendation - Technology choices and architecture
3. Pitch Generation - Investor-ready elevator pitch
4. Similar Startups - Market landscape and competitors
5. Improvement Suggestions - Enhancement recommendations
6. Success Probability - Market statistics and viability assessment

Use the retrieved context from the knowledge base to provide data-driven insights.
Structure your response with clear section headers and actionable recommendations.
```

#### Step 4: Deploy and Test

1. **Save Chatflow**: Save your RAG agent configuration
2. **Get API Endpoint**: Copy the prediction API URL
3. **Update Frontend**: Replace `{YOUR_FLOWISE_ENDPOINT_ID}` in the code
4. **Test Integration**: Submit a startup idea to verify the pipeline

### Environment Setup

1. **Flowise API**: Ensure your Flowise API is running on `http://localhost:3000`
2. **API Endpoint**: Configure the application with your specific Flowise prediction endpoint ID
3. **CORS**: Configure Flowise to allow requests from your frontend domain

## 🔧 Backend Architecture

### Service Layer (`src/services/flowiseApi.ts`)

#### Core Methods:

- **`generatePitchDeck()`**: Main evaluation orchestration
- **`formatEvaluationPrompt()`**: AI prompt engineering
- **`cleanResponse()`**: Content cleaning and formatting
- **`formatSections()`**: Section parsing and organization
- **`fileToBase64()`**: File upload processing
- **`getFallbackEvaluationResponse()`**: Error recovery

#### Evaluation Framework:

1. **Uniqueness Check**: Competitor analysis and differentiation
2. **Tech Stack Recommendation**: Technology choices and architecture
3. **Pitch Generation**: Investor-ready presentations
4. **Similar Startups**: Market landscape analysis
5. **Improvement Suggestions**: Enhancement recommendations
6. **Success Probability**: Market statistics and risk assessment

### Response Processing Pipeline:

```typescript
Raw API Response → Content Extraction → Artifact Removal → Section Parsing → Formatted Output
```

## 🌐 Flowise RAG Agent Architecture

### RAG Agent Design Overview

This project utilizes a sophisticated Flowise RAG (Retrieval-Augmented Generation) agent that combines multiple AI technologies for comprehensive startup evaluation. The agent architecture includes document processing, vector embeddings, similarity search, and intelligent response generation.

### 🏗️ Flowise Agent Components

#### Data Ingestion Layer

- **Chrome Embeddings**: Web scraping and real-time data collection
- **Custom Document Loader**: Handles multiple file formats (PDF, DOCX, TXT)
- **Retrieval Tool**: Processes user uploads and external documents

#### Knowledge Processing Pipeline

- **ChromaDB Vector Store**: High-performance vector database for embeddings
- **Recursive Character Text Splitter**: Intelligent document chunking
- **HuggingFace Embeddings**: Advanced text-to-vector conversion
- **Semantic Search**: Context-aware information retrieval

#### Intelligence Layer

- **GPT-4 Agent**: Primary reasoning and analysis engine
- **Sequential Node Processing**: Multi-step evaluation workflow
- **Agent Memory**: Maintains context across evaluation stages
- **ConditionalNode**: Dynamic response routing based on content

#### Response Generation

- **End Node**: Final response formatting and delivery
- **LLM Node**: Language model for natural text generation
- **Loop Detection**: Prevents circular processing issues

### 🔧 RAG Agent Configuration

#### Vector Database Setup (ChromaDB)

```typescript
// ChromaDB Configuration
Collection Name: "startup_knowledge_base"
Embedding Model: "all-MiniLM-L6-v2"
Similarity Threshold: 0.7
Max Documents Retrieved: 10
```

#### Agent Workflow

1. **Document Ingestion**: Processes uploaded files and web content
2. **Embedding Creation**: Converts text to vector representations
3. **Knowledge Storage**: Stores embeddings in ChromaDB
4. **Query Processing**: Analyzes user startup idea
5. **Context Retrieval**: Finds relevant information from knowledge base
6. **Intelligent Analysis**: GPT-4 agent performs comprehensive evaluation
7. **Response Formatting**: Structures output into 6 evaluation sections

### 🚀 API Integration

#### API Configuration

```typescript
const FLOWISE_API_URL =
  "http://localhost:3000/api/v1/prediction/{YOUR_FLOWISE_ENDPOINT_ID}";
```

**Note**: Replace `{YOUR_FLOWISE_ENDPOINT_ID}` with your actual Flowise prediction endpoint identifier.

### Request Format

```json
{
  "question": "Structured evaluation prompt...",
  "uploads": ["base64_encoded_file"] // Optional
}
```

### RAG Agent Capabilities

#### Knowledge Sources

- **Startup Databases**: YCombinator, Crunchbase, TechCrunch archives
- **Market Research**: Industry reports and analysis documents
- **Technical Documentation**: Best practices and technology guides
- **Investment Data**: Funding trends and investor preferences

#### Intelligent Features

- **Context-Aware Analysis**: Uses retrieved documents for informed responses
- **Multi-Modal Processing**: Handles text, images, and structured data
- **Semantic Understanding**: Goes beyond keyword matching
- **Dynamic Knowledge Updates**: Continuously learns from new documents

### Response Processing

- **Multi-field Support**: Handles `text`, `message`, `data` response fields
- **Content Cleaning**: Removes thinking processes and system messages
- **Section Parsing**: Organizes content into structured sections
- **Error Handling**: Graceful degradation with fallback responses

## 📖 Usage Guide

### Basic Evaluation

1. Enter your startup idea in the main form
2. Optionally specify industry and target audience
3. Upload relevant documents (optional)
4. Click "Evaluate Startup" to generate analysis
5. Review the 6-section comprehensive report

### Advanced Features

- **File Uploads**: Attach pitch decks, business plans, or market research
- **Industry Context**: Specify your target industry for relevant insights
- **Audience Targeting**: Define your target audience for focused analysis

### Expected Output Sections

1. **Uniqueness Check**: Market differentiation analysis
2. **Tech Stack**: Technology recommendations
3. **Pitch**: Investor-ready elevator pitch
4. **Competitors**: Similar startups analysis
5. **Improvements**: Enhancement suggestions
6. **Success Metrics**: Market statistics and probability

## 📁 Project Structure

```
ai-pitch-builder/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components library
│   │   ├── HeroSection.tsx # Landing page hero section
│   │   ├── PitchForm.tsx   # Startup evaluation form
│   │   ├── PitchResults.tsx # Results display component
│   │   ├── ThemeToggle.tsx # Dark/light theme switcher
│   │   └── themeprovider.tsx # Theme context provider
│   ├── pages/
│   │   ├── Index.tsx       # Main landing page
│   │   ├── PitchFormPage.tsx # Evaluation form page
│   │   └── NotFound.tsx    # 404 error page
│   ├── services/
│   │   ├── flowiseApi.ts   # Main Flowise API integration
│   │   ├── flowiseApi_new.ts # Extended API functionality
│   │   └── startwiseApi.ts # Additional API services
│   ├── hooks/
│   │   ├── use-mobile.tsx  # Mobile detection hook
│   │   └── use-toast.ts    # Toast notification hook
│   ├── lib/
│   │   └── utils.ts        # Utility functions and helpers
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   ├── index.css           # Global styles and CSS variables
│   └── vite-env.d.ts       # Vite environment types
├── public/
│   ├── favicon.ico         # Application favicon
│   ├── placeholder.svg     # Placeholder graphics
│   └── robots.txt          # SEO robots configuration
├── components.json         # shadcn/ui configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── vite.config.ts          # Vite build configuration
├── tsconfig.json           # TypeScript configuration
├── eslint.config.js        # ESLint linting rules
├── postcss.config.js       # PostCSS configuration
└── package.json           # Dependencies and scripts
```

## 🔄 Development Workflow

### Local Development

```bash
# Start development server
npm run dev

# Run linting
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Quality

- **TypeScript**: Full type safety throughout the application
- **ESLint**: Automated code linting and formatting
- **Component Architecture**: Modular, reusable React components
- **Service Layer**: Clean separation of API logic

## 🛠️ Troubleshooting

### Common Issues

#### Flowise RAG Agent Setup

- **Issue**: ChromaDB connection failures
- **Solution**: Ensure ChromaDB is properly installed and running
- **Command**: `pip install chromadb` and verify collection creation

#### Vector Embeddings

- **Issue**: Embedding generation errors
- **Solution**: Check HuggingFace model download and API limits
- **Alternative**: Use OpenAI embeddings if HuggingFace fails

#### Document Processing

- **Issue**: File upload processing failures
- **Solution**: Verify document loader supports file format
- **Supported**: PDF, DOCX, TXT, HTML, CSV formats

#### Flowise API Connection

- **Issue**: API requests failing
- **Solution**: Ensure Flowise is running on `http://localhost:3000`
- **Check**: CORS settings in Flowise configuration

#### Response Parsing

- **Issue**: Malformed or incomplete responses
- **Solution**: Check Flowise agent configuration and prompt structure
- **Fallback**: System provides fallback responses for API failures

#### File Upload Errors

- **Issue**: File uploads not working
- **Solution**: Check file size limits and Base64 encoding
- **Supported**: Common document formats (PDF, DOC, TXT)

### RAG Agent Debugging

#### Vector Search Issues

```bash
# Check ChromaDB collections
curl -X GET "http://localhost:8000/api/v1/collections"

# Verify embedding dimensions
curl -X POST "http://localhost:8000/api/v1/collections/{collection_name}/query" \
  -H "Content-Type: application/json" \
  -d '{"query_texts": ["test query"], "n_results": 1}'
```

#### Agent Memory Problems

- **Clear Memory**: Reset agent memory between sessions
- **Context Length**: Monitor token usage and context window limits
- **Memory Persistence**: Ensure conversation history is properly stored

### Debugging Tools

- **Console Logging**: Detailed logs at each processing step
- **Error Boundaries**: React error handling for UI failures
- **Network Monitoring**: Browser dev tools for API debugging

## 🤝 Contributing

### Development Guidelines

1. **Code Style**: Follow TypeScript and React best practices
2. **Component Design**: Use shadcn/ui components for consistency
3. **API Integration**: Maintain service layer abstraction
4. **Testing**: Ensure all features work with Flowise API
5. **Documentation**: Update README for significant changes

### Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Implement changes with proper testing
4. Update documentation as needed
5. Submit pull request with clear description

---

**Built with ❤️ using React, TypeScript, Tailwind CSS, and Flowise AI**
