/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { motion, useScroll, useSpring, AnimatePresence } from 'motion/react';
import { 
  Brain, 
  Rocket, 
  Code, 
  BarChart3, 
  ChevronRight, 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  Menu, 
  X, 
  CheckCircle2, 
  ArrowRight,
  Quote,
  Calendar,
  User,
  MessageSquare,
  MessageCircle
} from 'lucide-react';

import ProfileImage from './assets/images/profile.png';

// --- Configuration & Image Management ---
/**
 * HOW TO CHANGE IMAGES:
 * 1. To use a URL: Replace the strings in the CONFIG object below with your image URLs.
 * 2. To use your own files: 
 *    - Upload your images to the 'src/assets/images' folder.
 *    - Import them at the top of this file: import MyImage from './assets/images/my-photo.jpg';
 *    - Reference them in the CONFIG object: profileImage: MyImage
 */
const CONFIG = {
  profileImage: ProfileImage, // Using imported image for better deployment reliability
  workspaceImage: "https://picsum.photos/seed/workspace/800/1000",
  projectImages: {
    eval: "https://picsum.photos/seed/ai-evaluation-dashboard/800/600",
    bletofu: "https://picsum.photos/seed/educational-platform/800/600",
    smb: "https://picsum.photos/seed/business-automation/800/600",
  },
  blogImages: [
    "https://picsum.photos/seed/blog1/800/500",
    "https://picsum.photos/seed/blog2/800/500",
    "https://picsum.photos/seed/blog3/800/500",
  ],
  testimonialImages: [
    "https://picsum.photos/seed/person1/100/100",
    "https://picsum.photos/seed/person2/100/100",
  ],
  contactThumbnail: ProfileImage,
  skillImages: {
    evaluation: "https://picsum.photos/seed/ai-evaluation/800/600",
    hitl: "https://picsum.photos/seed/human-in-the-loop/800/600",
    prompt: "https://picsum.photos/seed/prompt-engineering/800/600",
    strategy: "https://picsum.photos/seed/ai-strategy/800/600",
    development: "https://picsum.photos/seed/digital-development/800/600",
    data: "https://picsum.photos/seed/data-strategy/800/600",
  },
};

// --- Components ---

const AIVisual = ({ prompt, fallbackImage, alt }: { prompt: string, fallbackImage?: string, alt: string }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateImage = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9",
          },
        },
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64Data = part.inlineData.data;
          setImageUrl(`data:image/png;base64,${base64Data}`);
          return;
        }
      }
      throw new Error("No image data returned from model.");
    } catch (err) {
      console.error("Image generation error:", err);
      setError("Failed to generate custom visual. Using fallback.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateImage();
  }, [prompt]);

  if (isLoading) {
    return (
      <div className="w-full h-full min-h-[200px] rounded-2xl bg-white/5 flex flex-col items-center justify-center gap-4 animate-pulse border border-white/10">
        <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Generating AI Visual...</p>
      </div>
    );
  }

  if (error || !imageUrl) {
    return (
      <div className="relative group w-full h-full min-h-[200px] rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex flex-col items-center justify-center p-8 text-center border border-white/10 overflow-hidden">
        {fallbackImage && (
          <img 
            src={fallbackImage} 
            alt={alt} 
            className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale"
            referrerPolicy="no-referrer"
          />
        )}
        <div className="relative z-10 flex flex-col items-center justify-center">
          <Brain className="text-primary/40 mb-4" size={40} />
          <h4 className="text-white/60 font-bold mb-1 text-xs">AI Visual Generation</h4>
          <p className="text-white/30 text-[9px] max-w-[200px] mb-4">We couldn't generate the custom AI illustration at this moment.</p>
          <button 
            onClick={generateImage}
            className="px-5 py-2 glass rounded-full text-[9px] font-bold hover:bg-white/10 transition-all text-primary"
          >
            Retry AI Generation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group h-full w-full overflow-hidden">
      <img 
        src={imageUrl} 
        alt={alt} 
        className="w-full h-full object-cover rounded-2xl shadow-2xl border border-white/10 transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute top-3 right-3 glass px-2 py-1 rounded-full text-[7px] font-bold uppercase text-primary border border-primary/20">
        Generated by Nano Banana
      </div>
      <button 
        onClick={generateImage}
        className="absolute bottom-3 right-3 p-2 glass rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10"
        title="Regenerate Visual"
      >
        <Rocket size={12} />
      </button>
    </div>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Work', href: '#work' },
    { name: 'Expertise', href: '#expertise' },
    { name: 'Experience', href: '#experience' },
    { name: 'Insights', href: '#insights' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'glass py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <a href="#" className="text-2xl font-bold tracking-tighter">
          MO<span className="text-primary">.</span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-sm font-medium text-white/70 hover:text-primary transition-colors"
            >
              {link.name}
            </a>
          ))}
          <a 
            href="#contact" 
            className="px-5 py-2 bg-primary text-white rounded-full text-sm font-semibold hover:bg-primary/80 transition-all active:scale-95"
          >
            Hire Me
          </a>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white z-50 relative p-2" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/98 backdrop-blur-2xl md:hidden z-40 flex flex-col items-center justify-center"
          >
            <div className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.a 
                  key={link.name} 
                  href={link.href} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-3xl font-bold tracking-tighter hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </motion.a>
              ))}
              <motion.a 
                href="#contact"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.1 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-8 py-3 bg-primary text-white rounded-full text-lg font-bold"
              >
                Hire Me
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden bg-gradient-mesh">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-1 glass rounded-full text-[10px] md:text-xs font-bold text-accent uppercase tracking-widest mb-6"
          >
            Available for Collaboration
          </motion.div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight mb-6 tracking-tighter">
            Moshood <br />
            <span className="text-gradient">Ogundiran</span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-white/60 font-medium mb-4">
            AI Evaluator | Generative AI Quality Specialist | Digital Product Builder
          </p>
          <p className="text-base md:text-lg text-white/40 max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed">
            Helping organizations build reliable AI systems and scalable digital products through rigorous evaluation and strategic AI implementation.
          </p>
          <div className="flex flex-wrap justify-center lg:justify-start gap-4">
            <a href="#work" className="px-6 md:px-8 py-3 md:py-4 bg-primary text-white rounded-xl font-bold hover:shadow-[0_0_30px_rgba(108,59,255,0.4)] transition-all flex items-center gap-2 group text-sm md:text-base">
              View My Work <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#contact" className="px-6 md:px-8 py-3 md:py-4 glass text-white rounded-xl font-bold hover:bg-white/10 transition-all text-sm md:text-base">
              Contact Me
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative"
        >
          <div className="relative w-full aspect-square max-w-[320px] md:max-w-md mx-auto">
            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-32 md:w-40 h-32 md:h-40 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-10 -left-10 w-32 md:w-40 h-32 md:h-40 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-700" />
            
            {/* Image Frame */}
            <div className="w-full h-full rounded-3xl overflow-hidden glass p-2 rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="w-full h-full rounded-2xl overflow-hidden bg-white/5 relative group">
                <img 
                  src={CONFIG.profileImage} 
                  alt="Moshood Ogundiran" 
                  className="w-full h-full object-cover hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            
            {/* Floating Badges */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -right-2 md:-right-4 top-1/4 glass p-2 md:p-4 rounded-xl md:rounded-2xl shadow-2xl"
            >
              <Brain className="text-primary mb-1" size={20} />
              <div className="text-[8px] md:text-[10px] font-bold uppercase text-white/50">AI Expert</div>
            </motion.div>
            
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
              className="absolute -left-4 md:-left-6 bottom-1/4 glass p-2 md:p-4 rounded-xl md:rounded-2xl shadow-2xl"
            >
              <Rocket className="text-accent mb-1" size={20} />
              <div className="text-[8px] md:text-[10px] font-bold uppercase text-white/50">Strategist</div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Background Neural Network Pattern (Simulated) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
    </section>
  );
};

const About = () => {
  const expertise = [
    { icon: <Brain size={20} />, title: 'AI Evaluation', desc: 'Rigorous quality assessment' },
    { icon: <MessageSquare size={20} />, title: 'Prompt Engineering', desc: 'Optimizing LLM outputs' },
    { icon: <BarChart3 size={20} />, title: 'Product Strategy', desc: 'Go-to-market excellence' },
    { icon: <Code size={20} />, title: 'Web Development', desc: 'Building digital solutions' },
  ];

  return (
    <section id="about" className="py-24 bg-background relative">
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          whileInView={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: 30 }}
          viewport={{ once: true }}
          className="order-1 lg:order-2"
        >
          <h2 className="text-sm font-bold text-primary uppercase tracking-[0.3em] mb-4">About Me</h2>
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 tracking-tight">
            Bridging the gap between <span className="text-gradient">AI potential</span> and real-world impact.
          </h3>
          <p className="text-base md:text-lg text-white/60 mb-8 leading-relaxed">
            I am Moshood Ogundiran, a multi-disciplinary professional dedicated to the advancement of Generative AI systems. My work focuses on ensuring AI outputs meet the highest standards of quality, safety, and utility.
          </p>
          <p className="text-base md:text-lg text-white/60 mb-12 leading-relaxed">
            With a background in AI evaluation and digital product development, I bring a unique strategic lens to every project, helping startups and established teams navigate the complex landscape of modern technology.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {expertise.map((item, i) => (
              <motion.div 
                key={item.title}
                whileHover={{ y: -5 }}
                className="p-4 glass rounded-2xl"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary mb-3">
                  {item.icon}
                </div>
                <h4 className="font-bold mb-1">{item.title}</h4>
                <p className="text-xs text-white/40">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          whileInView={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: -30 }}
          viewport={{ once: true }}
          className="relative order-2 lg:order-1"
        >
          <div className="aspect-4/5 rounded-3xl overflow-hidden glass p-3 relative z-10">
            <img 
              src={CONFIG.workspaceImage} 
              alt="Workspace" 
              className="w-full h-full object-cover rounded-2xl"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-primary/30 rounded-full blur-3xl -z-10" />
        </motion.div>
      </div>
    </section>
  );
};

const Projects = () => {
  const projects = [
    {
      title: "AI Output Evaluation Framework",
      desc: "Architected and deployed a sophisticated, multi-dimensional evaluation system for Large Language Models (LLMs). This framework integrates automated scoring metrics (like BLEU, ROUGE, and BERTScore) with custom human-in-the-loop (HITL) review pipelines to rigorously benchmark model performance. It focuses on critical dimensions such as logical consistency, factual grounding, and safety alignment, providing actionable insights that have directly led to a measurable reduction in model hallucinations and improved reliability for production-grade AI applications.",
      tech: ["Python", "OpenAI API", "Data Analysis"],
      image: CONFIG.projectImages.eval,
      aiPrompt: "Create a detailed modern illustration of a Large Language Model evaluation framework pipeline. The scene shows: An AI language model generating responses, A structured evaluation pipeline analyzing the outputs, Automated scoring modules labeled BLEU, ROUGE, and BERTScore, A human-in-the-loop review interface where evaluators approve, flag, or correct outputs, Data dashboards displaying metrics like logical consistency, factual grounding, and safety alignment. Include visual elements like data flows, modular AI components, evaluation nodes, charts, and feedback loops improving the system. Style: modern machine learning architecture diagram mixed with SaaS dashboard design, clean and professional, minimalistic tech illustration, purple and yellow accent colors, white background, futuristic but realistic AI engineering aesthetic."
    },
    {
      title: "BLETOFU Learning Platform",
      desc: "Designed and built an AI-native educational ecosystem that transforms the traditional learning experience through deep personalization. By utilizing Generative AI to analyze individual student progress, cognitive styles, and knowledge gaps, the platform dynamically generates custom-tailored curriculum modules, interactive quizzes, and real-time corrective feedback. This initiative aims to bridge educational divides by providing high-quality, adaptive learning tools that scale to meet the needs of diverse learners globally.",
      tech: ["React", "Node.js", "Tailwind CSS"],
      image: CONFIG.projectImages.bletofu,
      aiPrompt: "Create a modern illustration of an AI-powered personalized learning platform. The scene shows a student interacting with a digital learning dashboard while an artificial intelligence system analyzes their learning progress. Visualize the AI generating personalized curriculum modules, quizzes, and feedback tailored to the student. Include elements like: AI brain or neural network connected to learning modules, Progress charts and skill maps, Adaptive learning paths branching into different subjects, Interactive quizzes and feedback panels, Data flows representing analysis of knowledge gaps. Style: modern edtech SaaS illustration, clean UI dashboard aesthetic, minimalistic design, futuristic but friendly, purple and yellow accent colors, white background, professional and scalable technology vibe. Use a wide 16:9 hero illustration style suitable for a modern AI product portfolio."
    },
    {
      title: "Digital Solutions for SMBs",
      desc: "Developed a comprehensive suite of intelligent automation tools specifically engineered to empower small and medium-sized businesses. These solutions include custom-trained customer support agents, automated document processing pipelines, and intelligent lead qualification systems. By lowering the barrier to entry for advanced technology, this project has enabled traditional businesses to achieve significant operational efficiency gains and successfully transition into a digital-first operational model.",
      tech: ["Next.js", "Firebase", "Stripe"],
      image: CONFIG.projectImages.smb,
      aiPrompt: "Create a modern 16:9 hero illustration of an AI-powered automation platform designed for small and medium-sized businesses. The scene features a sleek digital dashboard used by business owners to manage operations with intelligent automation tools. The interface displays multiple modules connected by flowing data lines. Include visual elements such as: an AI customer support chatbot assisting customers through a chat interface, automated document processing pipelines scanning and analyzing business documents, an intelligent lead qualification system categorizing potential customers (high, medium, low priority), integrated payment processing representing online payments (Stripe-like checkout module), business analytics dashboards with graphs, KPIs, and workflow automation panels. Show a clear system architecture where data flows between web applications, cloud databases, APIs, and automation engines. Use glowing connectors and modular blocks to represent the AI workflow. Style: modern SaaS product illustration, startup-style UI, clean minimalistic design, futuristic automation platform aesthetic, soft gradients, professional tech environment. Color palette: purple and yellow accent colors on a clean white background. Make the composition feel like a polished hero illustration for a technology startup portfolio website."
    }
  ];

  return (
    <section id="work" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-sm font-bold text-primary uppercase tracking-[0.3em] mb-4">Featured Work</h2>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              Selected <span className="text-gradient">Projects</span> & Initiatives
            </h3>
          </div>
          <a href="#" className="group flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-bold">
            View all projects <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 30 }}
              whileHover={{ y: -10, scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group glass rounded-3xl overflow-hidden transition-colors duration-300"
            >
              <div className="aspect-video overflow-hidden relative">
                {project.aiPrompt ? (
                  <AIVisual prompt={project.aiPrompt} fallbackImage={project.image} alt={project.title} />
                ) : (
                  <>
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-background to-transparent opacity-60" />
                  </>
                )}
              </div>
              <div className="p-8">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map(t => (
                    <span key={t} className="text-[10px] font-bold uppercase px-2 py-1 bg-white/5 rounded-md text-white/40">{t}</span>
                  ))}
                </div>
                <h4 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{project.title}</h4>
                <p className="text-white/50 text-sm leading-relaxed">{project.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CaseStudies = () => {
  const cases = [
    {
      title: "Improving AI Reliability for the Yohanna Platform – Alveum",
      problem: "The Yohanna AI product required rigorous evaluation to ensure responses were aligned with intended use cases and free from misleading or low-quality outputs. As the platform scaled, maintaining consistency, safety, and contextual accuracy across generated responses became a key challenge.",
      solution: "Led structured human-in-the-loop evaluation processes to assess AI outputs against quality, safety, and relevance standards. Worked closely with the AI team to review model responses, flag inconsistencies, and provide detailed feedback that helped refine prompt structures and improve response alignment with the product’s objectives.",
      impact: "Improved overall response reliability and helped strengthen the product’s quality assurance framework, enabling the team to iterate faster and deploy updates with greater confidence in AI output accuracy and user experience.",
      aiPrompt: "Create a modern tech illustration showing a Human-in-the-Loop AI evaluation workflow. The scene shows an AI system generating responses on a dashboard while a human reviewer evaluates the outputs. Some responses are marked approved, others flagged for correction. Include visual elements like data flows, AI nodes, review checkmarks, and feedback loops improving the system. Style: clean SaaS product illustration, purple and yellow accent colors, modern UI dashboard look, minimalistic, futuristic but professional."
    }
  ];

  return (
    <section className="py-24 bg-background/50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-sm font-bold text-primary uppercase tracking-[0.3em] mb-16 text-center">Case Studies</h2>
        
        {cases.map((cs, i) => (
          <div key={cs.title} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              whileInView={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.95 }}
              viewport={{ once: true }}
              className="rounded-3xl overflow-hidden glass p-2"
            >
              <AIVisual prompt={cs.aiPrompt} alt={cs.title} />
            </motion.div>
            
            <motion.div
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: 30 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl md:text-3xl font-bold mb-8">{cs.title}</h3>
              
              <div className="space-y-8">
                <div>
                  <h4 className="text-accent font-bold text-xs uppercase tracking-widest mb-2">Problem</h4>
                  <p className="text-sm md:text-base text-white/60 leading-relaxed">{cs.problem}</p>
                </div>
                <div>
                  <h4 className="text-primary font-bold text-xs uppercase tracking-widest mb-2">Solution</h4>
                  <p className="text-sm md:text-base text-white/60 leading-relaxed">{cs.solution}</p>
                </div>
                <div className="p-6 glass rounded-2xl border-l-4 border-primary">
                  <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-2">Impact</h4>
                  <p className="text-sm md:text-base text-white/80 font-medium">{cs.impact}</p>
                </div>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
};

const Skills = () => {
  const skills = [
    { 
      title: "AI Evaluation", 
      icon: <Brain />, 
      image: CONFIG.skillImages.evaluation,
      desc: "Comprehensive assessment of Large Language Model outputs using a blend of automated benchmarks and qualitative analysis. I specialize in identifying subtle hallucinations, measuring reasoning consistency, and ensuring that AI systems adhere to strict safety and ethical guidelines before deployment. My approach involves creating custom evaluation datasets and implementing rigorous testing protocols to validate model reliability across diverse edge cases.",
      focus: ["Hallucination Detection", "Safety Benchmarking", "Reasoning Analysis"]
    },
    { 
      title: "HITL Review", 
      icon: <User />, 
      image: CONFIG.skillImages.hitl,
      desc: "Designing and managing Human-in-the-loop workflows to provide high-quality ground truth data. I bridge the gap between raw model outputs and human expectations, utilizing expert feedback loops to iteratively refine model behavior and improve overall system reliability. This includes managing annotation teams, defining clear labeling guidelines, and integrating human feedback directly into the model fine-tuning process.",
      focus: ["Annotation Management", "Feedback Loops", "Ground Truth Data"]
    },
    { 
      title: "Prompt Engineering", 
      icon: <MessageSquare />, 
      image: CONFIG.skillImages.prompt,
      desc: "Advanced prompt design using techniques like chain-of-thought, few-shot prompting, and structured output enforcement. I craft precise instructions that maximize model utility, reduce latency, and ensure consistent performance across diverse use cases and model architectures. I also implement dynamic prompt templates that adapt to user context, ensuring highly relevant and accurate model responses.",
      focus: ["Chain-of-Thought", "Few-Shot Learning", "Structured Outputs"]
    },
    { 
      title: "AI Strategy", 
      icon: <Rocket />, 
      image: CONFIG.skillImages.strategy,
      desc: "Strategic advisory on the implementation and optimization of AI solutions within existing business processes. I help organizations identify high-impact AI opportunities, navigate technical trade-offs, and develop long-term roadmaps for sustainable AI integration. My strategy work focuses on maximizing ROI while minimizing risks associated with AI deployment, including ethical considerations and technical scalability.",
      focus: ["Implementation Roadmaps", "ROI Analysis", "Ethical AI"]
    },
    { 
      title: "Digital Development", 
      icon: <Code />, 
      image: CONFIG.skillImages.development,
      desc: "Full-stack development of scalable web applications and internal AI tools. I build robust digital products that seamlessly integrate AI capabilities, focusing on performance, user experience, and maintainable architecture using modern frameworks like React and Next.js. I specialize in creating intuitive interfaces for complex AI systems, making advanced technology accessible to non-technical users.",
      focus: ["Full-Stack Apps", "AI Tooling", "User Experience"]
    },
    { 
      title: "Data Strategy", 
      icon: <BarChart3 />, 
      image: CONFIG.skillImages.data,
      desc: "Leveraging data analytics and visualization to drive informed product decisions. I design data pipelines and dashboards that provide clear insights into AI system performance, user behavior, and business growth, ensuring that every move is backed by rigorous data. My work ensures that data is not just collected, but transformed into actionable intelligence that guides the entire product lifecycle.",
      focus: ["Performance Analytics", "Data Pipelines", "Actionable Insights"]
    },
  ];

  return (
    <section id="expertise" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-sm font-bold text-primary uppercase tracking-[0.3em] mb-4">Expertise</h2>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Core <span className="text-gradient">Competencies</span>
          </h3>
          <p className="text-white/50 text-lg">
            A specialized skill set designed to tackle the unique challenges of the generative AI era.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skills.map((skill, i) => (
            <motion.div
              key={skill.title}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 30 }}
              whileHover={{ y: -10, scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group glass rounded-3xl overflow-hidden transition-all duration-300"
            >
              <div className="aspect-video overflow-hidden relative">
                <img 
                  src={skill.image} 
                  alt={skill.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-linear-to-t from-background to-transparent opacity-80" />
                <div className="absolute bottom-4 left-6 w-12 h-12 rounded-xl bg-primary/20 backdrop-blur-md flex items-center justify-center text-primary border border-white/10">
                  {React.cloneElement(skill.icon as React.ReactElement, { size: 24 })}
                </div>
              </div>
              <div className="p-8">
                <div className="flex flex-wrap gap-2 mb-4">
                  {skill.focus.map(f => (
                    <span key={f} className="text-[9px] font-bold uppercase px-2 py-1 bg-primary/10 rounded-md text-primary/70 border border-primary/20">{f}</span>
                  ))}
                </div>
                <h4 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">{skill.title}</h4>
                <p className="text-white/50 text-sm leading-relaxed">{skill.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Timeline = () => {
  const experiences = [
    {
      role: "AI Evaluator / AI Quality Reviewer",
      company: "Generative AI Lab",
      period: "2023 - Present",
      desc: "Leading evaluation efforts for large-scale language models, focusing on reasoning capabilities and safety guardrails.",
      image: "https://picsum.photos/seed/logo1/100/100"
    },
    {
      role: "AI Product Strategist",
      company: "TechScale Solutions",
      period: "2021 - 2023",
      desc: "Spearheaded AI integration strategies for B2B SaaS products, enhancing user engagement through intelligent automation.",
      image: "https://picsum.photos/seed/logo2/100/100"
    },
    {
      role: "Digital Product Builder",
      company: "Freelance / Independent",
      period: "2019 - 2021",
      desc: "Designed and developed custom digital solutions for startups, from MVP to full-scale production.",
      image: "https://picsum.photos/seed/logo3/100/100"
    }
  ];

  return (
    <section id="experience" className="py-24 bg-background/30">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-sm font-bold text-primary uppercase tracking-[0.3em] mb-16 text-center">Professional Journey</h2>
        
        <div className="relative border-l border-white/10 ml-4 md:ml-0">
          {experiences.map((exp, i) => (
            <motion.div 
              key={exp.role}
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -20 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="mb-12 last:mb-0 pl-10 relative"
            >
              <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-background" />
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                <div>
                  <h4 className="text-xl font-bold">{exp.role}</h4>
                  <p className="text-primary font-medium">{exp.company}</p>
                </div>
                <span className="text-xs font-bold text-white/30 bg-white/5 px-3 py-1 rounded-full">{exp.period}</span>
              </div>
              <p className="text-white/50 leading-relaxed">{exp.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CTO @ AI Nexus",
      text: "Moshood's evaluation framework was a game-changer for our model alignment. His attention to detail and strategic insights are unmatched.",
      image: CONFIG.testimonialImages[0]
    },
    {
      name: "David Miller",
      role: "Founder @ ScaleUp",
      text: "Working with Moshood on our product strategy helped us find the perfect market fit. He understands both the tech and the business.",
      image: CONFIG.testimonialImages[1]
    }
  ];

  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-sm font-bold text-primary uppercase tracking-[0.3em] mb-16 text-center">Client Feedback</h2>
        
        <div className="flex flex-wrap justify-center gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              whileInView={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.9 }}
              viewport={{ once: true }}
              className="max-w-md p-8 glass rounded-3xl relative"
            >
              <Quote className="absolute top-6 right-8 text-primary/20" size={40} />
              <p className="text-lg text-white/70 italic mb-8 leading-relaxed relative z-10">"{t.text}"</p>
              <div className="flex items-center gap-4">
                <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" referrerPolicy="no-referrer" />
                <div>
                  <h4 className="font-bold">{t.name}</h4>
                  <p className="text-xs text-white/40">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Insights = () => {
  const posts = [
    {
      title: "The Future of AI Evaluation",
      excerpt: "Why human-in-the-loop remains critical as models become more autonomous.",
      date: "Mar 15, 2026",
      image: CONFIG.blogImages[0]
    },
    {
      title: "Scaling AI Evaluation Workflows",
      excerpt: "Best practices for maintaining quality as your AI systems grow in complexity.",
      date: "Feb 28, 2026",
      image: CONFIG.blogImages[1]
    },
    {
      title: "Building Scalable Digital Products",
      excerpt: "Best practices for moving from MVP to production-ready systems.",
      date: "Jan 12, 2026",
      image: CONFIG.blogImages[2]
    }
  ];

  return (
    <section id="insights" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-sm font-bold text-primary uppercase tracking-[0.3em] mb-4">Insights</h2>
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight">Latest <span className="text-gradient">Articles</span></h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <motion.div
              key={post.title}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="aspect-video rounded-2xl overflow-hidden mb-6 glass p-1">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex items-center gap-2 text-white/30 text-xs font-bold uppercase mb-3">
                <Calendar size={14} /> {post.date}
              </div>
              <h4 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{post.title}</h4>
              <p className="text-white/50 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
              <span className="text-sm font-bold text-accent group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                Read More <ChevronRight size={16} />
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -30 }}
            viewport={{ once: true }}
          >
            <h2 className="text-sm font-bold text-primary uppercase tracking-[0.3em] mb-4">Get In Touch</h2>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Let's build the <span className="text-gradient">future</span> together.</h3>
            <p className="text-base md:text-lg text-white/50 mb-12 leading-relaxed">
              Whether you're looking for an AI evaluation partner, an AI strategist, or a digital builder, I'm always open to discussing new projects and opportunities.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl glass flex items-center justify-center text-primary">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-white/30 font-bold uppercase">Email</p>
                  <a href="mailto:ogundiranadeniyi1@gmail.com" className="font-medium text-sm md:text-base hover:text-primary transition-colors">ogundiranadeniyi1@gmail.com</a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl glass flex items-center justify-center text-primary">
                  <Linkedin size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-white/30 font-bold uppercase">LinkedIn</p>
                  <a href="https://www.linkedin.com/in/moshood-ogundiran-79a19b2a4/" target="_blank" rel="noopener noreferrer" className="font-medium text-sm md:text-base hover:text-primary transition-colors">Moshood Ogundiran</a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl glass flex items-center justify-center text-primary">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-white/30 font-bold uppercase">WhatsApp</p>
                  <a href="https://wa.me/2347078324988" target="_blank" rel="noopener noreferrer" className="font-medium text-sm md:text-base hover:text-primary transition-colors">+234 707 832 4988</a>
                </div>
              </div>
            </div>

            <div className="mt-12 flex items-center gap-4 p-6 glass rounded-3xl max-w-sm">
              <img src={CONFIG.contactThumbnail} alt="Moshood" className="w-16 h-16 rounded-2xl object-cover" />
              <div>
                <h4 className="font-bold">Moshood Ogundiran</h4>
                <p className="text-xs text-white/40">Ready to collaborate</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: 30 }}
            viewport={{ once: true }}
            className="glass p-6 md:p-12 rounded-3xl"
          >
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/50 uppercase">Name</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-sm" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/50 uppercase">Email</label>
                  <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-sm" placeholder="john@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/50 uppercase">Subject</label>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-sm" placeholder="Project Inquiry" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/50 uppercase">Message</label>
                <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors resize-none text-sm" placeholder="Tell me about your project..."></textarea>
              </div>
              <button className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/80 transition-all active:scale-[0.98] text-sm">
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-12 border-t border-white/5 bg-background">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-xl font-bold tracking-tighter">
          MO<span className="text-primary">.</span>
        </div>
        
        <div className="flex gap-8 text-sm text-white/40">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Cookies</a>
        </div>

        <div className="flex gap-4">
          <a href="#" className="w-10 h-10 glass rounded-full flex items-center justify-center text-white/60 hover:text-primary transition-all">
            <Github size={18} />
          </a>
          <a href="https://www.linkedin.com/in/moshood-ogundiran-79a19b2a4/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 glass rounded-full flex items-center justify-center text-white/60 hover:text-primary transition-all">
            <Linkedin size={18} />
          </a>
          <a href="mailto:ogundiranadeniyi1@gmail.com" className="w-10 h-10 glass rounded-full flex items-center justify-center text-white/60 hover:text-primary transition-all">
            <Mail size={18} />
          </a>
          <a href="https://wa.me/2347078324988" target="_blank" rel="noopener noreferrer" className="w-10 h-10 glass rounded-full flex items-center justify-center text-white/60 hover:text-primary transition-all">
            <MessageCircle size={18} />
          </a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-12 text-center text-xs text-white/20">
        &copy; {new Date().getFullYear()} Moshood Ogundiran. All rights reserved. Designed for the AI era.
      </div>
    </footer>
  );
};

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div 
      className="fixed top-0 left-0 right-0 h-1 bg-primary z-[60] origin-left" 
      style={{ scaleX }} 
    />
  );
};

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center"
    >
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold tracking-tighter mb-8"
      >
        MO<span className="text-primary">.</span>
      </motion.div>
      <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ x: "-100%" }}
          animate={{ x: "0%" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="w-full h-full bg-primary"
        />
      </div>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative selection:bg-primary/30 selection:text-white">
      <AnimatePresence>
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {!isLoading && (
        <>
          <ScrollProgress />
          <Navbar />
          <main>
            <Hero />
            <About />
            <Projects />
            <CaseStudies />
            <Skills />
            <Timeline />
            <Testimonials />
            <Insights />
            <Contact />
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}
