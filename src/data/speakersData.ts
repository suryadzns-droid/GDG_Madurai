export interface Speaker {
  id: string;
  name: string;
  designation: string;
  topic: string;
  image: string;
  ambientColor?: string;
}

export const SPEAKERS: Speaker[] = [
  {
    id: "marline-bettye",
    name: "Marline Bettye",
    designation: "Lead AI Research Scientist, Google DeepMind",
    topic: "Architecting Multimodal Neural Agents for Real-World Problem Solving",
    image: "/images/speakers/speaker-1.jpg",
    ambientColor: "rgba(34, 197, 94, 0.35)", // Lush subtle green matching reference photo
  },
  {
    id: "arun-kumar",
    name: "Arun Kumar",
    designation: "Principal Cloud Architect, Google Cloud",
    topic: "Zero-Trust Security & Kubernetes at Planetary Scale",
    image: "/images/speakers/speaker-2.jpg",
    ambientColor: "rgba(66, 133, 244, 0.35)", // Google blue
  },
  {
    id: "elena-rostova",
    name: "Elena Rostova",
    designation: "Head of Developer Ecosystem, Android & Web",
    topic: "Building Ultra-Responsive Apps with Jetpack Compose & Impeller",
    image: "/images/speakers/speaker-3.jpg",
    ambientColor: "rgba(234, 67, 53, 0.35)", // Google red
  },
  {
    id: "david-chen",
    name: "David Chen",
    designation: "Director of Machine Learning, TensorFlow",
    topic: "On-Device TinyML & Neural Synthesis in Resource-Constrained Environments",
    image: "/images/speakers/speaker-4.jpg",
    ambientColor: "rgba(249, 171, 0, 0.35)", // Google yellow
  },
  {
    id: "priya-ramesh",
    name: "Priya Ramesh",
    designation: "VP of Product Experience, Chrome & Web Standards",
    topic: "The Future of Web Capabilities: WebGPU, WebAssembly & Local AI",
    image: "/images/speakers/speaker-5.jpg",
    ambientColor: "rgba(168, 85, 247, 0.35)", // Purple accent
  },
];
