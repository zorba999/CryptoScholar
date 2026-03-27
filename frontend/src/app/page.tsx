"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  Cpu, 
  Award, 
  Search, 
  Send, 
  CheckCircle, 
  ExternalLink,
  ShieldCheck,
  Zap,
  Globe,
  Wallet,
  Menu,
  X,
  Share2,
  Activity,
  Layers,
  Shield
} from "lucide-react";

const QUICK_TOPICS = [
  "Zero-Knowledge Proofs",
  "Automated Market Makers",
  "Layer-2 Rollups",
  "Liquid Staking",
  "DAO Governance"
];

export default function Home() {
  const [topic, setTopic] = useState("");
  const [lesson, setLesson] = useState("");
  const [loadingLesson, setLoadingLesson] = useState(false);
  const [answer, setAnswer] = useState("");
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);

  const shareToTwitter = () => {
    const text = `I just mastered '${topic}' and earned my Verifiable AI Diploma via CryptoScholar! 🎓🚀\n\nVerified by @OpenGradient TEE technology.\n\n#Web3Education #OpenGradient #Base`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const generateLesson = async () => {
    if (!topic) return;
    setLoadingLesson(true);
    setLesson("");
    setResult(null);
    try {
      const res = await fetch("http://localhost:8000/generate_lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const data = await res.json();
      if (data.lesson_data) {
        setLesson(data.lesson_data);
        // Scroll to lesson smoothly
        setTimeout(() => {
           document.getElementById('lesson-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } catch (err) {
      console.error(err);
    }
    setLoadingLesson(false);
  };

  const verifyAnswer = async () => {
    if (!answer) return;
    setLoadingVerify(true);
    setResult(null);
    try {
      const res = await fetch("http://localhost:8000/verify_answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          question: lesson,
          user_answer: answer,
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    }
    setLoadingVerify(false);
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-white selection:bg-purple-500/30">
      {/* OpenGradient Network Status Panel (Floating) */}
      <div className="fixed top-24 right-6 z-40 hidden xl:block">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-dark p-5 rounded-2xl border border-white/5 w-64 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-green-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-tighter text-gray-400">OG Network Status</span>
            </div>
            <span className="bg-green-500/20 text-green-500 text-[8px] px-1.5 py-0.5 rounded-full font-bold">LIVE</span>
          </div>

          <div className="space-y-3">
            {[
              { label: "TEE Compute Nodes", val: "1,204 Active", icon: <Cpu size={12} /> },
              { label: "Proof Generation", val: "0.2s Avg", icon: <Zap size={12} /> },
              { label: "V-LLM Security", val: "Enclave Level 3", icon: <Shield size={12} /> },
              { label: "Total Proofs Minted", val: "42.8k+", icon: <Layers size={12} /> }
            ].map((stat, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-500">
                  {stat.icon}
                  <span className="text-[9px] font-medium">{stat.label}</span>
                </div>
                <span className="text-[9px] text-white font-mono">{stat.val}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-white/5">
             <div className="text-[10px] text-gray-600 font-medium leading-tight">
               Your interaction is cryptographically secured via OpenGradient Oracle nodes.
             </div>
          </div>
        </motion.div>
      </div>

      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px]" />
      </div>

      {/* Header / Logo Only */}
      <div className="relative z-10 pt-12 flex justify-center">
        <div className="flex items-center gap-4 scale-110 md:scale-125 transition-transform">
          <div className="w-12 h-12 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Award className="text-white" size={28} />
          </div>
          <span className="text-3xl font-extrabold tracking-tighter">Crypto<span className="text-purple-400">Scholar</span></span>
        </div>
      </div>

      {/* Hero Section */}
      <header className="relative pt-20 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-xs font-bold uppercase tracking-widest mb-6">
              <Zap size={14} />
              Powered by OpenGradient Verifiable LLM
            </div>
            <h1 className="text-6xl lg:text-7xl font-extrabold leading-tight mb-6 gradient-text">
              Master Web3.<br />Get Verified.
            </h1>
            <p className="text-xl text-gray-400 mb-10 max-w-lg leading-relaxed">
              Deepen your understanding of complex blockchain concepts with our verifiable AI tutor. Prove your knowledge and earn on-chain diplomas.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-400 transition-colors">
                  <Search size={18} />
                </div>
                <input 
                  type="text" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all text-lg placeholder:text-gray-600"
                  placeholder="What do you want to learn today?"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && generateLesson()}
                />
              </div>
              <button 
                onClick={generateLesson}
                disabled={loadingLesson || !topic}
                className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-purple-600/20 whitespace-nowrap"
              >
                {loadingLesson ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : <Cpu size={20} />}
                {loadingLesson ? "AI Thinking..." : "Start Learning"}
              </button>
            </div>

            {/* Quick Topic Chips */}
            <div className="mt-6 flex flex-wrap gap-2 items-center">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mr-2">Try:</span>
              {QUICK_TOPICS.map((t, i) => (
                <button
                  key={i}
                  onClick={() => { setTopic(t); /* Optional: auto-trigger */ }}
                  className="px-3 py-1 bg-white/5 border border-white/5 hover:border-purple-500/50 hover:bg-purple-500/10 rounded-full text-xs text-gray-400 hover:text-purple-300 transition-all cursor-pointer"
                >
                  {t}
                </button>
              ))}
            </div>
            
            <div className="mt-8 flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-green-500" />
                TEE Encrypted
              </div>
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-blue-500" />
                On-Chain Proof
              </div>
            </div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative hidden lg:block group"
          >
            {/* Pulsing glow background */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/30 to-blue-600/30 rounded-3xl blur-3xl opacity-40 group-hover:opacity-70 transition-opacity duration-1000" />
            
            <div className="relative bg-white/5 border border-white/10 rounded-3xl p-2 glow-purple overflow-hidden transition-all duration-500 group-hover:scale-[1.02] group-hover:rotate-1 shadow-2xl">
               <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden rounded-2xl">
                 {/* Scanning Beam */}
                 <div className="absolute h-[250%] w-[150px] bg-white/10 blur-3xl -top-1/2 -left-1/2 rotate-[35deg] animate-[scan_4s_linear_infinite]" />
               </div>
               
               <img 
                 src="/hero.png" 
                 alt="Future of Education" 
                 className="w-full h-auto rounded-2xl grayscale-[15%] group-hover:grayscale-0 transition-all duration-1000 brightness-90 group-hover:brightness-110"
               />

               {/* Tech Overlays */}
               <div className="absolute bottom-6 left-6 z-20 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="text-[10px] font-black tracking-widest text-blue-400 uppercase">Neural Context Loaded</div>
                  <div className="h-1 w-24 bg-blue-500/30 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400 w-2/3 animate-pulse" />
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Features Grid */}
      <section className="py-20 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why CryptoScholar?</h2>
            <p className="text-gray-400 max-w-lg mx-auto">A revolutionary educational experience blending decentralized AI with immutable proof of knowledge.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Cpu className="text-purple-400" />, title: "Verifiable LLM", desc: "Our lessons are generated by AI running in secure Enclaves (TEE). No tampering possible." },
              { icon: <ShieldCheck className="text-blue-400" />, title: "On-Chain Minting", desc: "Proof of your knowledge is minted as an NFT on Base Sepolia for a permanent academic record." },
              { icon: <Zap className="text-amber-400" />, title: "Real-time Verification", desc: "Submit your answers and get cryptographically verified instantly by the AI itself." }
            ].map((f, i) => (
              <motion.div 
                whileHover={{ y: -10, border: "1px solid rgba(139, 92, 246, 0.4)" }}
                key={i} 
                className="bg-white/5 border border-white/10 p-8 rounded-3xl transition-all relative overflow-hidden group"
              >
                <div className="absolute -right-4 -top-4 w-12 h-12 bg-purple-500/10 rounded-full blur-xl group-hover:bg-purple-500/20 transition-all" />
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* OpenGradient Verifiable AI Badge Section */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-20 glass p-10 rounded-[3rem] border border-purple-500/10 flex flex-col md:flex-row items-center gap-10 overflow-hidden relative"
          >
             <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-transparent pointer-events-none" />
             <div className="relative z-10 w-full md:w-1/3">
                <div className="text-purple-400 font-black text-4xl mb-2">OG</div>
                <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-6" />
                <h3 className="text-2xl font-bold mb-4">Verifiable Artificial Intelligence</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  OpenGradient transforms LLMs from "Black Boxes" into verifiable services. Every response you receive is accompanied by a cryptographic proof, ensuring the AI output hasn't been tampered with.
                </p>
             </div>

             <div className="w-full md:w-2/3 grid grid-cols-2 gap-4">
                {[
                  { title: "TEE Execution", desc: "Hardware-level security for your prompts." },
                  { title: "On-Chain Registry", desc: "Model parameters are immutable on-chain." },
                  { title: "Zero-Knowledge Proofs", desc: "Verify results without exposing private data." },
                  { title: "Decentralized Oracle", desc: "Trustless bridge between AI and Blockchain." }
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="font-bold text-sm mb-1 text-white">{item.title}</div>
                    <p className="text-[10px] text-gray-500">{item.desc}</p>
                  </div>
                ))}
             </div>
          </motion.div>
        </div>
      </section>

      {/* Main Interactive Section */}
      <AnimatePresence>
        {lesson && (
          <motion.section 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            id="lesson-section" 
            className="py-20 px-6"
          >
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
                {/* Lesson Header */}
                <div className="p-8 border-b border-white/10 bg-white/[0.02] flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-400">
                      <BookOpen size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Deep Dive: {topic}</h2>
                      <span className="text-sm text-gray-500">AI-Generated Curriculum</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-[10px] font-bold uppercase">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Verified On-TEE
                  </div>
                </div>

                {/* Lesson Body */}
                <div className="p-10">
                  <div className="prose prose-invert prose-purple max-w-none mb-12">
                     <div className="whitespace-pre-wrap text-lg text-gray-300 leading-loose font-light">
                        {lesson}
                     </div>
                  </div>

                  {/* Quiz Interaction */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-purple-600/5 to-transparent rounded-3xl" />
                    <div className="relative glass-dark p-8 rounded-3xl border border-white/10 glow-purple">
                      <div className="flex items-center gap-3 mb-6">
                        <Zap size={20} className="text-purple-400" />
                        <h3 className="text-xl font-bold">Test Your Knowledge</h3>
                      </div>
                      
                      <div className="mb-6">
                        <label className="block text-sm text-gray-400 mb-4 font-medium uppercase tracking-wider">Your Answer</label>
                        <textarea 
                          className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 outline-none focus:border-purple-500/50 transition-all text-white placeholder:text-gray-700 min-h-[120px] resize-none"
                          placeholder="Example: The correct answer is B because rollups process transactions off-chain to reduce mainnet congestion..."
                          value={answer}
                          onChange={(e) => setAnswer(e.target.value)}
                        />
                      </div>

                      <button 
                         onClick={verifyAnswer}
                         disabled={loadingVerify || !answer}
                         className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                      >
                        {loadingVerify ? (
                           <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : <ShieldCheck size={20} />}
                        {loadingVerify ? "Cryptographic Verification..." : "Submit for Diploma"}
                      </button>
                    </div>
                  </div>

                  {/* Result Message */}
                  {result && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-10 p-8 rounded-3xl border ${result.is_correct ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-start gap-4">
                           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${result.is_correct ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                             {result.is_correct ? <CheckCircle size={28} /> : <X size={28} />}
                           </div>
                           <div>
                             <h4 className={`text-xl font-bold mb-1 ${result.is_correct ? 'text-green-400' : 'text-red-400'}`}>
                                {result.is_correct ? 'Challenge Succeeded!' : 'Try Again'}
                             </h4>
                             <p className="text-gray-400 text-sm leading-relaxed max-w-md">{result.message}</p>
                           </div>
                        </div>

                        {result.is_correct && (
                          <div className="flex flex-col sm:flex-row gap-3">
                            <button 
                              onClick={shareToTwitter}
                              className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-5 py-2.5 rounded-xl border border-blue-500/20 flex items-center justify-center gap-2 transition-all font-semibold text-sm"
                            >
                               <Share2 size={16} />
                               Share on X
                            </button>
                            
                            {result.nft_mint_tx && (
                              <a 
                                href={`https://sepolia.basescan.org/tx/${result.nft_mint_tx}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors border border-white/5 font-medium text-sm text-gray-300"
                              >
                                 Scan Link
                                 <ExternalLink size={14} />
                              </a>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Verifiable Hash Footer */}
                      <div className="mt-8 pt-6 border-t border-white/5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                           <div className="flex items-center gap-3 text-xs font-mono text-gray-500">
                              <span className="text-purple-500">OPENGRADIENT PROOF:</span>
                              <span className="break-all opacity-70 max-w-[200px] md:max-w-none inline-block truncate">{result.verifiable_og_transaction_hash}</span>
                           </div>
                           <button className="text-[10px] uppercase font-black tracking-widest text-gray-600 hover:text-white transition">Verify Payload</button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 mt-20 relative z-10 bg-black/40">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6 text-xl font-bold tracking-tight">
              <Award className="text-purple-500" size={24} />
              <span>Crypto<span className="text-purple-400">Scholar</span></span>
            </div>
            <p className="text-gray-500 text-sm max-w-sm leading-relaxed mb-8">
              The world's first educational platform using Verifiable AI technology to provide trustless proof of knowledge. Built on OpenGradient and Base.
            </p>
            <div className="flex gap-4">
              {/* Social links can be added here later */}
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-white">Platform</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li className="hover:text-purple-400 transition cursor-pointer">Learning Paths</li>
              <li className="hover:text-purple-400 transition cursor-pointer">Verification Registry</li>
              <li className="hover:text-purple-400 transition cursor-pointer">API Keys</li>
              <li className="hover:text-purple-400 transition cursor-pointer">SDK Docs</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-white">Governance</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li className="hover:text-purple-400 transition cursor-pointer">Scholar DAO</li>
              <li className="hover:text-purple-400 transition cursor-pointer">Vote on Topics</li>
              <li className="hover:text-purple-400 transition cursor-pointer">Grant Program</li>
              <li className="hover:text-purple-400 transition cursor-pointer">Community</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600">© 2026 CryptoScholar. All rights reserved.</p>
          <div className="flex gap-8 text-xs text-gray-600">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
