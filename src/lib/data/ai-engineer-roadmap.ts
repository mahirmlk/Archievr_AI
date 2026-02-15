export const aiEngineerRoadmap = {
    name: "AI Engineer Roadmap 2026",
    description: "Building production-ready AI applications with LLMs, agents, and generative AI",
    phases: [
        {
            order: 1,
            title: "Phase 1: Foundation & AI Basics",
            description: "Programming, cloud infrastructure, and AI fundamentals",
            topics: [
                {
                    order: 1,
                    title: "1.1 Python & Software Engineering",
                    description: "Modern Python development and best practices",
                    skills: [
                        "Python 3.11+",
                        "Type Hints",
                        "Async/Await",
                        "Poetry/Uv",
                        "Pydantic",
                        "FastAPI",
                        "Testing (pytest)",
                        "Git & GitHub",
                        "CI/CD Basics",
                        "Docker Fundamentals"
                    ],
                    resources: [],
                    projects: [
                        {
                            title: "RESTful API with Authentication",
                            description: "Build a FastAPI service with JWT auth, rate limiting, and Swagger docs",
                            difficulty: "beginner",
                        },
                        {
                            title: "CLI Tool with Rich Output",
                            description: "Create a command-line app using Click/Typer with progress bars and colored output",
                            difficulty: "beginner",
                        },
                    ],
                },
                {
                    order: 2,
                    title: "1.2 Cloud & DevOps Essentials",
                    description: "Cloud platforms and infrastructure basics",
                    skills: [
                        "AWS (S3, Lambda, EC2)",
                        "Google Cloud (Cloud Run, GCS)",
                        "Azure Basics",
                        "Serverless Functions",
                        "Environment Variables",
                        "Secrets Management",
                        "API Gateways",
                        "Load Balancing"
                    ],
                    resources: [],
                    projects: [
                        {
                            title: "Serverless Image Processor",
                            description: "Deploy AWS Lambda function that resizes images from S3 triggers",
                            difficulty: "beginner",
                        },
                    ],
                },
                {
                    order: 3,
                    title: "1.3 Introduction to AI & LLMs",
                    description: "Understanding large language models and their capabilities",
                    skills: [
                        "LLM Basics",
                        "Tokenization",
                        "Context Windows",
                        "Temperature & Top-p",
                        "OpenAI API",
                        "Anthropic Claude",
                        "Gemini API",
                        "API Cost Optimization",
                        "Rate Limiting"
                    ],
                    resources: [],
                    projects: [
                        {
                            title: "AI Content Generator",
                            description: "Build a multi-purpose content generator using OpenAI API with streaming responses",
                            difficulty: "beginner",
                        },
                        {
                            title: "Intelligent Summarizer",
                            description: "Create a document summarizer with chunk processing and cost tracking",
                            difficulty: "beginner",
                        },
                    ],
                },
            ],
        },
        {
            order: 2,
            title: "Phase 2: LLM Engineering Fundamentals",
            description: "Prompt engineering, fine-tuning, and model optimization",
            topics: [
                {
                    order: 1,
                    title: "2.1 Advanced Prompt Engineering",
                    description: "Techniques for reliable LLM outputs",
                    skills: [
                        "Chain-of-Thought",
                        "Few-Shot Learning",
                        "ReAct Pattern",
                        "Tree of Thoughts",
                        "Constrained Generation",
                        "JSON Mode",
                        "Function Calling",
                        "Structured Outputs",
                        "Prompt Templates",
                        "DSPy"
                    ],
                    resources: [],
                    projects: [
                        {
                            title: "Reliable Data Extractor",
                            description: "Extract structured data from unstructured text with validation and retry logic",
                            difficulty: "intermediate",
                        },
                        {
                            title: "Multi-Step Reasoning System",
                            description: "Implement Chain-of-Thought and Self-Consistency for complex problem solving",
                            difficulty: "intermediate",
                        },
                    ],
                },
                {
                    order: 2,
                    title: "2.2 Model Fine-Tuning & Customization",
                    description: "Adapting models for specific domains",
                    skills: [
                        "Fine-Tuning Basics",
                        "LoRA & QLoRA",
                        "Instruction Tuning",
                        "Dataset Curation",
                        "Evaluation Metrics",
                        "Hugging Face Hub",
                        "Transformers Library",
                        "PEFT",
                        "Unsloth",
                        "Axolotl"
                    ],
                    resources: [],
                    projects: [
                        {
                            title: "Domain-Specific Chatbot",
                            description: "Fine-tune Llama 3.1 8B on custom dataset with LoRA for specific domain knowledge",
                            difficulty: "intermediate",
                            isPortfolio: true,
                        },
                    ],
                },
                {
                    order: 3,
                    title: "2.3 Model Optimization & Deployment",
                    description: "Efficient serving and cost reduction",
                    skills: [
                        "Quantization (GPTQ, AWQ, GGUF)",
                        "Model Compression",
                        "vLLM",
                        "TensorRT-LLM",
                        "llama.cpp",
                        "Ollama",
                        "LocalAI",
                        "OpenRouter",
                        "LiteLLM",
                        "Response Caching"
                    ],
                    resources: [],
                    projects: [
                        {
                            title: "Cost-Optimized LLM API",
                            description: "Deploy quantized model with vLLM, implement caching and routing for 10x cost reduction",
                            difficulty: "intermediate",
                        },
                        {
                            title: "Edge AI Deployment",
                            description: "Run optimized LLM on edge devices using llama.cpp with streaming",
                            difficulty: "intermediate",
                        },
                    ],
                },
            ],
        },
        {
            order: 3,
            title: "Phase 3: RAG & Knowledge Systems",
            description: "Retrieval-augmented generation and semantic search",
            topics: [
                {
                    order: 1,
                    title: "3.1 Embeddings & Vector Search",
                    description: "Semantic search foundations",
                    skills: [
                        "Embedding Models (OpenAI, Cohere, BGE, E5)",
                        "Vector Similarity",
                        "Dense Retrieval",
                        "Semantic Search",
                        "Hybrid Search",
                        "BM25",
                        "Cross-Encoders",
                        "Late Interaction (ColBERT)"
                    ],
                    resources: [],
                    projects: [
                        {
                            title: "Semantic Code Search",
                            description: "Build a code search engine using BGE embeddings with hybrid retrieval",
                            difficulty: "intermediate",
                        },
                    ],
                },
                {
                    order: 2,
                    title: "3.2 Vector Databases",
                    description: "Scalable vector storage and retrieval",
                    skills: [
                        "Pinecone",
                        "Weaviate",
                        "Qdrant",
                        "Milvus",
                        "pgvector",
                        "Chroma",
                        "FAISS",
                        "Indexing Strategies",
                        "Metadata Filtering",
                        "Namespaces"
                    ],
                    resources: [],
                    projects: [
                        {
                            title: "Multi-Tenant Knowledge Base",
                            description: "Implement vector DB with namespace isolation and metadata filtering",
                            difficulty: "intermediate",
                        },
                    ],
                },
                {
                    order: 3,
                    title: "3.3 Advanced RAG Techniques",
                    description: "Production-grade retrieval systems",
                    skills: [
                        "Chunking Strategies",
                        "Parent-Child Chunking",
                        "Hypothetical Questions",
                        "Query Decomposition",
                        "Reranking (Cohere, JinaAI)",
                        "Retrieval Evaluation",
                        "RAGAS",
                        "Context Compression",
                        "RAG Fusion",
                        "Self-RAG"
                    ],
                    resources: [],
                    projects: [
                        {
                            title: "Production RAG System",
                            description: "Full RAG pipeline with hybrid search, reranking, chunking optimization, and RAGAS evaluation",
                            difficulty: "advanced",
                            isPortfolio: true,
                        },
                        {
                            title: "Conversational RAG with Memory",
                            description: "Context-aware retrieval with conversation history and follow-up question handling",
                            difficulty: "advanced",
                        },
                    ],
                },
                {
                    order: 4,
                    title: "3.4 Document Processing",
                    description: "Ingesting diverse document types",
                    skills: [
                        "PDF Processing (PyMuPDF, pdfplumber)",
                        "OCR (Tesseract, PaddleOCR)",
                        "Layout Analysis",
                        "DocumentLayoutLM",
                        "Table Extraction (Camelot, Tabula)",
                        "Markdown Parsing",
                        "Web Scraping (Scrapy, Playwright)",
                        "Unstructured.io",
                        "LlamaParse"
                    ],
                    resources: [],
                    projects: [
                        {
                            title: "Intelligent Document Processor",
                            description: "Process mixed documents (PDFs, images, web pages) with layout-aware chunking",
                            difficulty: "advanced",
                        },
                    ],
                },
            ],
        },
        {
            order: 4,
            title: "Phase 4: AI Agents & Orchestration",
            description: "Building autonomous AI agents and workflows",
            topics: [
                {
                    order: 1,
                    title: "4.1 Agent Frameworks",
                    description: "Tools for building AI agents",
                    skills: [
                        "LangChain",
                        "LangGraph",
                        "LlamaIndex",
                        "AutoGen",
                        "CrewAI",
                        "AgentOps",
                        "Composio",
                        "Tool/Function Calling",
                        "Agent Memory",
                        "Reflection"
                    ],
                    resources: [],
                    projects: [
                        {
                            title: "Research Assistant Agent",
                            description: "Build agent with web search, document summarization, and report generation capabilities",
                            difficulty: "advanced",
                        },
                        {
                            title: "Multi-Tool SQL Agent",
                            description: "Natural language to SQL with schema understanding and query validation",
                            difficulty: "advanced",
                        },
                    ],
                },
                {
                    order: 2,
                    title: "4.2 Multi-Agent Systems",
                    description: "Coordinating multiple specialized agents",
                    skills: [
                        "Agent Collaboration",
                        "Task Decomposition",
                        "Hierarchical Agents",
                        "Communication Protocols",
                        "Shared Memory",
                        "Agent Handoff",
                        "Supervisor Pattern",
                        "Debate Pattern"
                    ],
                    resources: [],
                    projects: [
                        {
                            title: "Content Creation Pipeline",
                            description: "Multi-agent system: Researcher -> Outline Writer -> Content Creator -> Editor -> SEO Optimizer",
                            difficulty: "advanced",
                            isPortfolio: true,
                        },
                        {
                            title: "Autonomous Code Reviewer",
                            description: "Agent team analyzing code for bugs, security, performance, and style",
                            difficulty: "advanced",
                        },
                    ],
                },
                {
                    order: 3,
                    title: "4.3 Workflow Orchestration",
                    description: "Complex AI workflows and pipelines",
                    skills: [
                        "LangGraph State Machines",
                        "Directed Acyclic Graphs (DAGs)",
                        "Conditional Routing",
                        "Human-in-the-Loop",
                        "Streaming Workflows",
                        "Error Handling",
                        "Retries & Fallbacks",
                        "Persistence"
                    ],
                    resources: [],
                    projects: [
                        {
                            title: "Customer Support Automation",
                            description: "Workflow with triage -> knowledge base -> escalation -> ticket creation",
                            difficulty: "advanced",
                        },
                    ],
                },
                {
                    order: 4,
                    title: "4.4 Agent Tools & Integrations",
                    description: "Extending agent capabilities",
                    skills: [
                        "API Integrations",
                        "Web Browsing (Playwright)",
                        "Code Execution (E2B, Modal)",
                        "Database Queries",
                        "File Operations",
                        "Email & Slack",
                        "Calendar APIs",
                        "Search APIs (Tavily, Serper)",
                        "Vision APIs"
                    ],
                    resources: [],
                    projects: [
                        {
                            title: "Personal AI Assistant",
                            description: "Agent with email, calendar, search, and task management integrations",
                            difficulty: "advanced",
                            isPortfolio: true,
                        },
                    ],
                },
            ],
        },
        {
            order: 5,
            title: "Phase 5: Production AI Systems",
            description: "Deploying, monitoring, and scaling AI applications",
            topics: [
                {
                    order: 1,
                    title: "5.1 AI Application Architecture",
                    description: "System design for AI products",
                    skills: [
                        "Microservices",
                        "Message Queues (Redis, RabbitMQ)",
                        "WebSockets",
                        "Server-Sent Events (SSE)",
                        "Background Workers (Celery, RQ)",
                        "Caching Strategies",
                        "Database Design",
                        "PostgreSQL",
                        "Redis"
                    ],
                    resources: [],
                    projects: [
                        {
                            title: "Scalable AI API Platform",
                            description: "FastAPI + Redis + PostgreSQL with background processing and real-time streaming",
                            difficulty: "advanced",
                        },
                    ],
                },
                {
                    order: 2,
                    title: "5.2 Monitoring & Observability",
                    description: "Tracking AI system performance",
                    skills: [
                        "LangSmith",
                        "Langfuse",
                        "Helicone",
                        "PromptLayer",
                        "Phoenix",
                        "Logging (Loguru, structlog)",
                        "Metrics (Prometheus)",
                        "Tracing (Jaeger, Zipkin)",
                        "Error Tracking (Sentry)",
                        "Cost Tracking"
                    ],
                    resources: [],
                    projects: [
                        {
                            title: "AI Observability Dashboard",
                            description: "Complete monitoring with LangSmith + custom metrics for latency, cost, and quality",
                            difficulty: "advanced",
                        },
                    ],
                },
                {
                    order: 3,
                    title: "5.3 Evaluation & Testing",
                    description: "Ensuring AI system quality",
                    skills: [
                        "LLM-as-a-Judge",
                        "RAGAS",
                        "DeepEval",
                        "Evaluation Datasets",
                        "A/B Testing",
                        "Regression Testing",
                        "Golden Datasets",
                        "Human Evaluation",
                        "Prompt Testing",
                        "Guardrails"
                    ],
                    resources: [],
                    projects: [
                        {
                            title: "Automated AI Testing Suite",
                            description: "Comprehensive test suite with LLM judges, RAGAS metrics, and CI/CD integration",
                            difficulty: "advanced",
                            isPortfolio: true,
                        },
                    ],
                },
                {
                    order: 4,
                    title: "5.4 Security & Governance",
                    description: "Safe and compliant AI systems",
                    skills: [
                        "Prompt Injection Defense",
                        "Input Validation",
                        "Output Filtering",
                        "PII Detection & Removal",
                        "Content Moderation",
                        "Guardrails AI",
                        "NeMo Guardrails",
                        "Rate Limiting",
                        "Access Control",
                        "Audit Logging"
                    ],
                    resources: [],
                    projects: [
                        {
                            title: "Enterprise-Grade AI Gateway",
                            description: "Secure API gateway with guardrails, PII filtering, and compliance logging",
                            difficulty: "advanced",
                        },
                    ],
                },
            ],
        },
        {
            order: 6,
            title: "Phase 6: Specialization Tracks",
            description: "Advanced AI specializations",
            topics: [
                {
                    order: 1,
                    title: "Track A: Multimodal AI Engineer",
                    description: "Vision, audio, and cross-modal systems",
                    skills: [
                        "GPT-4 Vision",
                        "Claude Vision",
                        "Gemini Pro Vision",
                        "CLIP",
                        "LLaVA",
                        "CogVLM",
                        "Whisper",
                        "TTS (ElevenLabs, Coqui)",
                        "Image Generation (DALL-E, Midjourney, SDXL)",
                        "Video Understanding"
                    ],
                    resources: [],
                    projects: [
                        {
                            title: "Visual Q&A System",
                            description: "Upload images and ask questions with GPT-4V, handle multi-image comparisons",
                            difficulty: "advanced",
                            isPortfolio: true,
                        },
                        {
                            title: "Voice-Enabled AI Assistant",
                            description: "Full voice pipeline: speech-to-text, LLM processing, text-to-speech with interruption handling",
                            difficulty: "advanced",
                            isPortfolio: true,
                        },
                    ],
                },
                {
                    order: 2,
                    title: "Track B: AI Infrastructure Engineer",
                    description: "Scalable AI platforms and serving",
                    skills: [
                        "Kubernetes for AI",
                        "Ray Serve",
                        "KServe",
                        "BentoML",
                        "Model Serving at Scale",
                        "GPU Optimization",
                        "Batch Inference",
                        "Model Routing",
                        "Load Balancing",
                        "Cost Optimization"
                    ],
                    resources: [],
                    projects: [
                        {
                            title: "Internal AI Platform",
                            description: "Self-service platform for deploying AI models with auto-scaling and cost tracking",
                            difficulty: "advanced",
                            isPortfolio: true,
                        },
                    ],
                },
                {
                    order: 3,
                    title: "Track C: Domain-Specific AI (Legal/Medical/Finance)",
                    description: "Specialized AI applications",
                    skills: [
                        "Domain Knowledge Graphs",
                        "Regulatory Compliance",
                        "Explainability",
                        "Audit Trails",
                        "Domain-Specific Fine-Tuning",
                        "HIPAA/GDPR for AI",
                        "Bias Detection",
                        "Fairness Metrics"
                    ],
                    resources: [],
                    projects: [
                        {
                            title: "Compliance-Ready Legal AI",
                            description: "RAG system for legal documents with citation tracking and explainable outputs",
                            difficulty: "advanced",
                            isPortfolio: true,
                        },
                    ],
                },
                {
                    order: 4,
                    title: "Track D: AI Product Engineer",
                    description: "Building AI-first products",
                    skills: [
                        "Product Thinking",
                        "User Research for AI",
                        "Frontend Integration (React, Next.js)",
                        "Real-time UX",
                        "Streaming UI",
                        "Vercel AI SDK",
                        "Monetization Strategies",
                        "Analytics",
                        "Growth Metrics"
                    ],
                    resources: [],
                    projects: [
                        {
                            title: "AI SaaS Product",
                            description: "Full-stack AI application with authentication, subscriptions, usage limits, and analytics",
                            difficulty: "advanced",
                            isPortfolio: true,
                        },
                    ],
                },
            ],
        },
    ],
    topProjects: [
        {
            title: "Enterprise RAG Platform",
            description: "Multi-tenant RAG system with role-based access, 1M+ documents, hybrid search, reranking, and comprehensive evaluation",
            tech: ["LangChain", "Pinecone", "FastAPI", "PostgreSQL", "React"],
            impact: "Production-scale AI infrastructure",
            difficulty: "advanced",
            isPortfolio: true,
        },
        {
            title: "Autonomous Customer Service Agent",
            description: "Multi-agent system handling inquiries, checking orders, processing refunds with 95% automation rate and human handoff",
            tech: ["LangGraph", "AutoGen", "RAG", "Webhooks", "Slack"],
            impact: "Demonstrable business value",
            difficulty: "advanced",
            isPortfolio: true,
        },
        {
            title: "AI-Powered Code Review Platform",
            description: "Analyze pull requests for bugs, security, performance, style with custom rules and GitHub Actions integration",
            tech: ["LangChain", "GitHub API", "Tree-sitter", "FastAPI"],
            impact: "Developer tools expertise",
            difficulty: "advanced",
            isPortfolio: true,
        },
        {
            title: "Real-Time AI Analytics Dashboard",
            description: "Monitor AI applications with latency, cost, quality metrics, automatic alerting, and trend analysis",
            tech: ["LangSmith", "Prometheus", "Grafana", "WebSocket", "React"],
            impact: "Observability and operations mastery",
            difficulty: "advanced",
            isPortfolio: true,
        },
        {
            title: "Multimodal Content Generator",
            description: "Generate blog posts, images, videos, and social media content from single prompt with brand consistency",
            tech: ["GPT-4V", "DALL-E", "RunwayML", "LangChain", "Next.js"],
            impact: "Cutting-edge multimodal AI",
            difficulty: "advanced",
            isPortfolio: true,
        },
    ],
} as const;
