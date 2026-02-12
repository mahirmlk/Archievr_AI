export const defaultRoadmap = {
  name: "Complete ML/AI Engineer Roadmap 2025",
  description: "From zero to high-impact AI engineer with production-ready skills",
  phases: [
    {
      order: 1,
      title: "Phase 1: Foundation & Prerequisites",
      duration: "Weeks 1-8",
      description: "Programming, CS fundamentals, and mathematics",
      topics: [
        {
          order: 1,
          title: "1.1 Programming & CS Fundamentals",
          description: "Python mastery and computer science basics",
          skills: ["Python 3.10+", "OOP", "Data Structures", "Algorithms", "System Design Basics", "NumPy", "Pandas", "Polars", "PyArrow"],
          projects: [
            {
              title: "Algorithmic Trading Simulator",
              description: "Build a backtesting engine from scratch using only NumPy/Pandas",
              difficulty: "beginner",
            },
            {
              title: "Custom Matrix Library",
              description: "Implement matrix operations without using NumPy (educational)",
              difficulty: "beginner",
            },
            {
              title: "Statistical Analysis Tool",
              description: "Analyze a real dataset (Kaggle) with hypothesis testing and visualizations",
              difficulty: "beginner",
            },
          ],
        },
        {
          order: 2,
          title: "1.2 Mathematics for ML",
          description: "Linear algebra, calculus, probability, and information theory",
          skills: ["Linear Algebra", "Matrix Operations", "SVD", "Calculus", "Gradients", "Probability", "Statistics", "Bayesian Thinking", "Information Theory", "Entropy", "KL-Divergence"],
          projects: [],
        },
      ],
    },
    {
      order: 2,
      title: "Phase 2: Core Machine Learning",
      duration: "Weeks 9-20",
      description: "Classical ML, deep learning fundamentals",
      topics: [
        {
          order: 1,
          title: "2.1 Classical ML & Scikit-Learn",
          description: "Supervised and unsupervised learning algorithms",
          skills: ["Scikit-learn", "Linear Regression", "Logistic Regression", "SVM", "Random Forest", "XGBoost", "LightGBM", "CatBoost", "K-Means", "DBSCAN", "PCA", "t-SNE", "UMAP", "Optuna", "Ray Tune", "SHAP"],
          projects: [
            {
              title: "End-to-End Churn Prediction System",
              description: "Feature engineering pipeline, compare 5+ algorithms, hyperparameter tuning with Optuna, SHAP analysis, deploy with Flask/FastAPI",
              difficulty: "intermediate",
            },
          ],
        },
        {
          order: 2,
          title: "2.2 Deep Learning Fundamentals",
          description: "Neural networks and frameworks",
          skills: ["PyTorch", "TensorFlow", "Keras", "MLPs", "CNNs", "RNNs", "LSTMs", "Backpropagation", "Batch Normalization", "Dropout", "SGD", "Adam", "AdamW", "Mixed Precision Training"],
          projects: [
            {
              title: "Computer Vision Pipeline",
              description: "Build CNN from scratch, transfer learning with ResNet/EfficientNet, object detection with YOLOv8, deploy to AWS Lambda",
              difficulty: "intermediate",
            },
            {
              title: "NLP Sentiment Analysis at Scale",
              description: "Compare TF-IDF + Logistic Regression vs Fine-tuned DistilBERT, build real-time inference API",
              difficulty: "intermediate",
            },
            {
              title: "Anomaly Detection for Time Series",
              description: "Implement Isolation Forest, Autoencoders, and Prophet with real-time streaming simulation",
              difficulty: "intermediate",
              isPortfolio: true,
            },
          ],
        },
      ],
    },
    {
      order: 3,
      title: "Phase 3: MLOps & Production Engineering",
      duration: "Weeks 21-32",
      description: "Data engineering, deployment, monitoring",
      topics: [
        { order: 1, title: "3.1 Data Engineering & Pipelines", description: "Workflow orchestration and big data processing", skills: ["Apache Airflow", "Prefect", "Dagster", "Apache Spark", "Dask", "Ray", "Feast", "Tecton", "Great Expectations", "Pandera"], projects: [] },
        { order: 2, title: "3.2 Model Deployment & Serving", description: "Production deployment patterns", skills: ["FastAPI", "Flask", "Docker", "Kubernetes", "KServe", "BentoML", "TensorFlow Lite", "ONNX Runtime", "Quantization"], projects: [] },
        { order: 3, title: "3.3 Experiment Tracking & Model Registry", description: "MLflow, Weights & Biases, DVC", skills: ["MLflow", "Weights & Biases", "DVC", "Git LFS"], projects: [] },
        {
          order: 4,
          title: "3.4 Monitoring & Observability",
          description: "Production ML monitoring",
          skills: ["Evidently AI", "WhyLabs", "Fiddler", "Prometheus", "Grafana", "LangSmith", "Langfuse", "Helicone"],
          projects: [
            {
              title: "Full MLOps Pipeline",
              description: "Airflow DAG for data ingestion to feature engineering to training to validation to deployment with monitoring",
              difficulty: "advanced",
            },
            {
              title: "Real-Time Recommendation System",
              description: "Feature store (Feast), Redis low-latency serving, FastAPI service, A/B testing framework",
              difficulty: "advanced",
            },
            {
              title: "Multi-Model Serving Platform",
              description: "Deploy sklearn, PyTorch, TensorFlow models in single service with canary and rollback",
              difficulty: "advanced",
              isPortfolio: true,
            },
          ],
        },
      ],
    },
    {
      order: 4,
      title: "Phase 4: LLM Engineering & AI Agents",
      duration: "Weeks 33-44",
      description: "Large language models, RAG, agents",
      topics: [
        {
          order: 1,
          title: "4.1 Large Language Model Fundamentals",
          description: "Transformers, fine-tuning, optimization",
          skills: ["Transformer Architecture", "Self-Attention", "LoRA", "QLoRA", "Instruction Tuning", "Prompt Engineering", "Chain-of-Thought", "ReAct", "Quantization", "GPTQ", "AWQ", "GGUF", "vLLM", "TensorRT-LLM"],
          projects: [],
        },
        {
          order: 2,
          title: "4.2 Retrieval-Augmented Generation (RAG)",
          description: "Vector databases and advanced retrieval",
          skills: ["Pinecone", "Weaviate", "Milvus", "pgvector", "Chroma", "OpenAI Embeddings", "Cohere", "BGE", "E5", "Hybrid Search", "BM25", "Reranking", "Cohere Rerank"],
          projects: [],
        },
        {
          order: 3,
          title: "4.3 AI Agents & Orchestration",
          description: "Agent frameworks and patterns",
          skills: ["LangChain", "LangGraph", "LlamaIndex", "AutoGen", "CrewAI", "ReAct Pattern", "Plan-and-Solve", "Multi-Agent Systems", "Reflection"],
          projects: [],
        },
        {
          order: 4,
          title: "4.4 LLM Infrastructure & Production",
          description: "Serving and cost optimization",
          skills: ["vLLM", "TGI", "Triton", "Caching", "Model Routing", "LLM-as-a-Judge", "RAGAS", "Guardrails"],
          projects: [
            {
              title: "Production RAG System",
              description: "Process 10K+ documents with hybrid retrieval and evaluation",
              difficulty: "advanced",
            },
            {
              title: "Autonomous Research Agent",
              description: "Multi-agent system with web search, memory, and human-in-the-loop",
              difficulty: "advanced",
            },
            {
              title: "Domain-Specific Fine-tuned Model",
              description: "Fine-tune Llama with LoRA and deploy a custom inference stack",
              difficulty: "advanced",
              isPortfolio: true,
            },
          ],
        },
      ],
    },
    {
      order: 5,
      title: "Phase 5: Specialization & Advanced Topics",
      duration: "Weeks 45-52",
      description: "Choose specialization track",
      topics: [
        {
          order: 1,
          title: "Track A: Computer Vision Engineer",
          description: "Advanced CV and video analysis",
          skills: ["Vision Transformers", "ViT", "DETR", "SAM", "Action Recognition", "Object Tracking", "Point Clouds", "NeRF", "Gaussian Splatting", "TensorRT", "OpenVINO"],
          projects: [{ title: "Real-time Multi-Object Tracking", description: "Custom YOLO + DeepSORT implementation for video analysis", difficulty: "advanced", isPortfolio: true }],
        },
        {
          order: 2,
          title: "Track B: NLP/LLM Specialist",
          description: "Advanced NLP and multimodal models",
          skills: ["RLHF", "DPO", "CLIP", "LLaVA", "GPT-4V", "Whisper", "TTS"],
          projects: [{ title: "Multilingual Conversational AI", description: "Voice interface with speech recognition and synthesis", difficulty: "advanced", isPortfolio: true }],
        },
        {
          order: 3,
          title: "Track C: ML Platform/Infrastructure Engineer",
          description: "Distributed training and feature platforms",
          skills: ["DeepSpeed", "FSDP", "Model Parallelism", "Tecton", "Spot Instances", "Model Compression"],
          projects: [{ title: "Internal ML Platform", description: "Platform serving 10+ teams with auto-scaling training clusters", difficulty: "advanced", isPortfolio: true }],
        },
        {
          order: 4,
          title: "Track D: Robotics/Embodied AI",
          description: "ROS2 and reinforcement learning",
          skills: ["ROS2", "Isaac Sim", "Gazebo", "PPO", "SAC", "Sim-to-Real"],
          projects: [{ title: "Autonomous Robot Navigation", description: "RL in simulation to real world deployment", difficulty: "advanced", isPortfolio: true }],
        },
      ],
    },
  ],
  topProjects: [
    {
      title: "Intelligent Document Processing Platform",
      description: "LayoutLMv3 + RAG for invoice/contract extraction with confidence scoring and human review loop",
      tech: ["LayoutLMv3", "RAG", "FastAPI", "React"],
      impact: "$50K+ cost savings simulation",
      difficulty: "advanced",
      isPortfolio: true,
    },
    {
      title: "Real-Time Fraud Detection at Scale",
      description: "Kafka + Flink + XGBoost with under 50ms latency, high uptime, and automated retraining",
      tech: ["Kafka", "Flink", "XGBoost", "Redis", "FastAPI"],
      impact: "Production-grade SLAs",
      difficulty: "advanced",
      isPortfolio: true,
    },
    {
      title: "Multi-Agent Coding Assistant",
      description: "LangGraph + CodeT5+ with repository-wide context and CI integration",
      tech: ["LangGraph", "CodeT5+", "Vector DB", "Tree-sitter"],
      impact: "Agentic AI beyond basic prompting",
      difficulty: "advanced",
      isPortfolio: true,
    },
    {
      title: "Personalized Learning Recommendation Engine",
      description: "Two-tower neural nets + RL with cold-start handling",
      tech: ["Two-Tower Networks", "RL", "FastAPI", "React"],
      impact: "15% engagement improvement simulation",
      difficulty: "advanced",
      isPortfolio: true,
    },
  ],
} as const;
