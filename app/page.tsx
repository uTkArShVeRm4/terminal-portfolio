"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { Palette, Github, Linkedin, Twitter } from "lucide-react"

// Color themes
const themes = {
  red: "#ff3333",
  blue: "#3b82f6",
  green: "#22c55e",
  purple: "#a855f7",
  pink: "#ec4899",
  orange: "#f97316",
  yellow: "#eab308",
  teal: "#14b8a6",
  cyan: "#06b6d4",
  indigo: "#6366f1",
  violet: "#8b5cf6",
  fuchsia: "#d946ef",
  rose: "#f43f5e",
  lime: "#84cc16",
  emerald: "#10b981",
}

type CommandEntry = {
  command: string
  output: string[]
}

export default function Home() {
  const [currentSection, setCurrentSection] = useState("home")
  const [command, setCommand] = useState("")
  const [commandHistory, setCommandHistory] = useState<CommandEntry[]>([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [theme, setTheme] = useState<keyof typeof themes>("cyan")
  const [showThemeMenu, setShowThemeMenu] = useState(false)
  const [terminalSize, setTerminalSize] = useState<"normal" | "expanded" | "fullscreen">("normal")

  const [isAnimating, setIsAnimating] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)
  const themeMenuRef = useRef<HTMLDivElement>(null)


const [showEmulator, setShowEmulator] = useState(false)


  const [sampleRoms, setSampleRoms] = useState([
    { name: "Brix", filename: "brix.ch8" },
    { name: "Pong", filename: "pong.ch8" },
    { name: "Tetris", filename: "tetris.ch8" }
  ]);



const handleLaunchEmulator = () => {
  setShowEmulator(true)
  // If we're not already in the projects section, switch to it
    setCurrentSection("emulator")
    handleTerminalResize("fullscreen")
  }


  // Create stars
  useEffect(() => {
    const starsContainer = document.createElement("div")
    starsContainer.className = "stars"

    for (let i = 0; i < 500; i++) {
      const star = document.createElement("div")
      star.className = "star"
      star.style.left = `${Math.random() * 100}%`
      star.style.top = `${Math.random() * 100}%`
      star.style.width = `${Math.random() * 2}px`
      star.style.height = star.style.width
      star.style.animationDelay = `${Math.random() * 4}s`
      starsContainer.appendChild(star)
    }

    document.body.appendChild(starsContainer)
    return () => {
      if (document.body.contains(starsContainer)) {
        document.body.removeChild(starsContainer)
      }
    }
  }, [])

  // Update CSS variables when theme changes
  useEffect(() => {
    document.documentElement.style.setProperty("--accent", themes[theme])
    document.documentElement.style.setProperty("--terminal-border", `${themes[theme]}4D`) // 30% opacity
    document.documentElement.style.setProperty("--terminal-glow", `${themes[theme]}26`) // 15% opacity
  }, [theme])

  // Close theme menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setShowThemeMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Track mouse movement for glow effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Calculate uptime based on birth date (May 24, 2003)
  const calculateUptime = () => {
    const birthDate = new Date(2003, 4, 24)
    const currentDate = new Date()

    let years = currentDate.getFullYear() - birthDate.getFullYear()
    let months = currentDate.getMonth() - birthDate.getMonth()
    let days = currentDate.getDate() - birthDate.getDate()

    if (days < 0) {
      months--
      const prevMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0)
      days += prevMonthDate.getDate()
    }

    if (months < 0) {
      years--
      months += 12
    }

    return `${years} years, ${months} months, ${days} days`
  }

  // Focus input when clicking anywhere in the terminal
  const handleTerminalClick = (e: React.MouseEvent) => {
    if (themeMenuRef.current && themeMenuRef.current.contains(e.target as Node)) {
      return
    }
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  // Handle terminal size change
  const handleTerminalResize = (size: "normal" | "expanded" | "fullscreen") => {
    if (terminalSize !== size) {
      setIsAnimating(true)
      setTerminalSize(size)

      // Wait for animation to complete before showing content
      setTimeout(() => {
        setIsAnimating(false)
      }, 500) // Match this with the CSS transition duration
    }
  }

  // Handle command execution
  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase()
    let output: string[] = []

    if (trimmedCmd === "about") {
      setCurrentSection("about")
      handleTerminalResize("expanded")
      output = ["ABOUT_OUTPUT"]
    } else if (trimmedCmd === "projects") {
      setCurrentSection("projects")
      handleTerminalResize("fullscreen")
      output = ["PROJECTS_OUTPUT"]
    } else if (trimmedCmd === "blogs") {
      setCurrentSection("blogs")
      handleTerminalResize("expanded")
      output = ["BLOGS_OUTPUT"]
    } else if (trimmedCmd === "home" || trimmedCmd === "neofetch") {
      setCurrentSection("home")
      handleTerminalResize("normal")
      output = ["NEOFETCH_OUTPUT"]
    } else if (trimmedCmd === "help") {
      output = [
        "Available commands:",
        "  about     - View information about me",
        "  projects  - View my projects",
        "  blogs     - View my blog posts",
        "  home      - Return to home screen",
        "  clear     - Clear the terminal",
        "  help      - Show this help message",
      ]
    } else if (trimmedCmd === "clear") {
      setCommandHistory([])
      setCommand("")
      // Replace the direct function calls with new entry in command history
      setCommandHistory([
        { command: "neofetch", output: ["NEOFETCH_OUTPUT"] },
        { command: "help", output: [
          "Available commands:",
          "  about     - View information about me",
          "  projects  - View my projects",
          "  blogs     - View my blog posts",
          "  home      - Return to home screen",
          "  clear     - Clear the terminal",
          "  help      - Show this help message",
        ] }
      ])
      return
    } else if (trimmedCmd !== "") {
      output = [`Command not found: ${cmd}`]
    }

    setCommandHistory((prev) => [...prev, { command: cmd, output }])
    setCommand("")

    // Scroll to bottom
    if (outputRef.current) {
      setTimeout(() => {
        outputRef.current!.scrollTop = outputRef.current!.scrollHeight
      }, 200)
    }
  }

  // Handle tab navigation
 const handleTabClick = (section: string) => {
  setCurrentSection(section)

  if (section === "home") {
    handleTerminalResize("normal")
  } else if (section === "projects" || section === "emulator") {  
    handleTerminalResize("fullscreen")
  } else {
    handleTerminalResize("expanded")
  }

if (section !== "emulator") {
    setCommandHistory([
      {
        command: section,
        output:
          section === "home"
            ? ["NEOFETCH_OUTPUT"]
            : section === "about"
              ? ["ABOUT_OUTPUT"]
              : section === "projects"
                ? ["PROJECTS_OUTPUT"]
                : ["BLOGS_OUTPUT"],
      },
    ])
    
    // Hide the emulator when switching to any other tab
    if (section !== "emulator" && showEmulator) {
      setShowEmulator(false)
    }
  }
} 

  // Handle command input
  const handleCommandInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommand(e.target.value)
  }

  // Handle command submission
  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    executeCommand(command)
  }

  // Initial commands - only run once
  useEffect(() => {
    if (!isInitialized) {
      // Set initial command history instead of calling executeCommand
      setCommandHistory([
        { command: "neofetch", output: ["NEOFETCH_OUTPUT"] },
        { command: "help", output: [
          "Available commands:",
          "  about     - View information about me",
          "  projects  - View my projects",
          "  blogs     - View my blog posts",
          "  home      - Return to home screen",
          "  clear     - Clear the terminal",
          "  help      - Show this help message",
        ] }
      ])
      setIsInitialized(true)
    }
  }, [isInitialized])


const renderEmulator = () => (
  <div className="mt-4 space-y-4">
    <h2 className="section-title text-lg">CHIP-8 Emulator</h2>
    
    <div className="card p-4 flex flex-col items-center">
      {/* Emulator controls - removed file input */}
      <div className="controls mb-4 w-full flex flex-wrap justify-center gap-2">
        <button id="start-button" className="btn">Start</button>
        <button id="pause-button" className="btn">Pause</button>
        <button id="restart-button" className="btn" disabled>Restart ROM</button>
        <button id="reset-button" className="btn">Reset</button>
      </div>
      
      {/* Sample ROMs section - expanded and styled better */}
      <div className="w-full mb-4">
        <h3 className="font-bold mb-2" style={{ color: themes[theme] }}>Available ROMs:</h3>
        <div className="flex flex-wrap gap-2">
          {sampleRoms.map((rom) => (
            <button
              key={rom.filename}
              className="btn"
              onClick={() => handleLoadSampleRom(rom.filename)}
            >
              {rom.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Canvas for the emulator */}
      <canvas 
        id="chip8-canvas" 
        width="960"
        height="480"
        className="border-2 border-gray-600 bg-black mb-4"
        style={{ 
          imageRendering: 'pixelated',
          boxShadow: `0 0 20px ${themes[theme]}33`
        }}
      ></canvas>
    </div>
  </div>
)

// Update the handleLoadSampleRom function to reset the emulator first
const handleLoadSampleRom = useCallback(async (filename: string) => {
  try {
    // Reset any currently running ROM first
    const resetEvent = new CustomEvent('resetemulator');
    document.dispatchEvent(resetEvent);
    
    // Then load the new ROM
    const response = await fetch(`/roms/${filename}`);
    const arrayBuffer = await response.arrayBuffer();
    const romData = new Uint8Array(arrayBuffer);
    
    // Create a custom event to notify the emulator
    const customEvent = new CustomEvent('loadrom', { 
      detail: { romData }
    });
    document.dispatchEvent(customEvent);
    
  } catch (error) {
    console.error("Failed to load ROM:", error);
  }
}, []);

// Update the emulator script to listen for the reset event
useEffect(() => {
  if (showEmulator) {
    // Create a script element
    const script = document.createElement('script');
    script.type = 'module';
    script.innerHTML = `
      import init, { Emulator } from '/pkg/chip8_emulator.js';
      
      // Key mapping from keyboard to CHIP-8 keypad
      const keyMap = {
          '1': 0x1, '2': 0x2, '3': 0x3, '4': 0xC,
          'q': 0x4, 'w': 0x5, 'e': 0x6, 'r': 0xD,
          'a': 0x7, 's': 0x8, 'd': 0x9, 'f': 0xE,
          'z': 0xA, 'x': 0x0, 'c': 0xB, 'v': 0xF
      };
      
      let emulator = null;
      let animationId = null;
      let lastTime = 0;
      const cyclesPerFrame = 10; // Adjust based on desired speed
      let currentRomData = null; // Store the current ROM data
      
      async function run() {
          // Initialize the WebAssembly module
          await init();
          
          // Set up DOM elements
          const canvas = document.getElementById('chip8-canvas');
          const startButton = document.getElementById('start-button');
          const pauseButton = document.getElementById('pause-button');
          const restartButton = document.getElementById('restart-button');
          const resetButton = document.getElementById('reset-button');
          
          // Create the emulator with 15px per CHIP-8 pixel
          try {
              emulator = new Emulator('chip8-canvas', 15);
          } catch (e) {
              console.error('Failed to create emulator:', e);
              return;
          }
          
          // Set up event listeners
          startButton.addEventListener('click', startEmulation);
          pauseButton.addEventListener('click', pauseEmulation);
          restartButton.addEventListener('click', restartRom);
          resetButton.addEventListener('click', resetEmulation);
          
          // Listen for custom loadrom events (for sample ROMs)
          document.addEventListener('loadrom', (e) => {
              loadRom(e.detail.romData);
          });
          
          // Listen for reset event
          document.addEventListener('resetemulator', resetEmulation);
          
          // Set up keyboard input
          document.addEventListener('keydown', (event) => handleKey(event, true));
          document.addEventListener('keyup', (event) => handleKey(event, false));
      }
      
      function loadRom(romData) {
          // Store the ROM data for later reuse
          currentRomData = romData;
          
          // Load the ROM into the emulator
          emulator.load_rom(romData);
          
          // Enable the restart button
          document.getElementById('restart-button').disabled = false;
          
          // Start emulation automatically
          startEmulation();
      }
      
      function startEmulation() {
          if (animationId) return;
          lastTime = performance.now();
          animationLoop();
      }
      
      function pauseEmulation() {
          if (animationId) {
              cancelAnimationFrame(animationId);
              animationId = null;
          }
      }
      
      function restartRom() {
          // Pause the emulation
          pauseEmulation();
          
          // Re-create the emulator
          emulator = new Emulator('chip8-canvas', 15);
          
          // Re-load the current ROM
          if (currentRomData) {
              emulator.load_rom(currentRomData);
              
              // Restart the emulation
              startEmulation();
          }
      }
      
      function resetEmulation() {
          pauseEmulation();
          
          // Re-create the emulator
          emulator = new Emulator('chip8-canvas', 15);
          
          // Reset the current ROM data
          currentRomData = null;
          
          // Disable the restart button
          document.getElementById('restart-button').disabled = true;
      }
      
      function handleKey(event, pressed) {
          const key = event.key.toLowerCase();
          if (key in keyMap && emulator) {
              emulator.set_key(keyMap[key], pressed);
              event.preventDefault();
          }
      }
      
      function animationLoop(time = 0) {
          animationId = requestAnimationFrame(animationLoop);
          
          // Calculate time delta and run appropriate number of cycles
          const delta = time - lastTime;
          const cyclesThisFrame = Math.floor(delta / 16.67 * cyclesPerFrame); // ~60 FPS target
          
          if (cyclesThisFrame > 0) {
              for (let i = 0; i < cyclesThisFrame; i++) {
                  emulator.cycle();
              }
              lastTime = time;
          }
      }
      
      // Start the application
      run();
    `;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }
}, [showEmulator, theme]);  // Render about section
  const renderAbout = () => (
    <div className="space-y-4">
      <h2 className="section-title text-lg">About Me</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="font-bold mb-2" style={{ color: themes[theme] }}>
            $ whoami
          </h3>
          <p className="text-sm">
            I&apos;m a chronic terminal addict who is on a mission to convert you into one as well. I spend my days automating everything I can and writing terminal programs.
          </p>
        </div>
        <div className="card">
          <h3 className="font-bold mb-2" style={{ color: themes[theme] }}>
            $ skills --list
          </h3>
          <ul className="list-disc pl-5 text-sm">
            <li>Golang, Rust, Python</li>
            <li>Cloud Infrastructure, DevOps, Kubernetes</li>
            <li>Linux, Bash, Docker</li>
            <li>AWS, GCP, Terraform</li>
            <li>LLMs, Retrieval Augmented Generation</li>
          </ul>
        </div>
      </div>
      <div className="card">
        <h3 className="font-bold mb-2" style={{ color: themes[theme] }}>
          $ experience --timeline
        </h3>
        <div className="space-y-2 text-sm">
          <div>
            <p className="text-white/80">Feb 2024 - Present</p>
            <p className="font-bold">Research Engineer Intern @ SimPPL</p>
            <p className="text-xs">Leading development of a whatsapp based digital literacy platform dedicated to transforming preventative healthcare for underserved women. </p>
          </div>
          <div>
            <p className="text-white/80">Jul 2024 - Aug 2024</p>
            <p className="font-bold">Data Analyst Intern @ Merkle DGS India</p>
            <p className="text-xs">Conducted comprehensive market analysis and user sentiment analysis across attributes such as delivery, product quality, and cost. Built data pipelines to scrape insights from Home Depot, leading to the development of an LLM-based chatbot that enabled automated insight generation for product catalog managers in specific categories.k</p>
          </div>
        </div>
      </div>
    </div>
  )

  // Render projects section
const renderProjects = () => (
  <div className="space-y-4">
    <h2 className="section-title text-lg">Projects</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="card">
        <h3 className="font-bold" style={{ color: themes[theme] }}>Simple Raytracer</h3>
        <p className="text-white/80 text-xs">Rust</p>
        <p className="my-2 text-sm">A simple raytracer written in Rust. First step of my graphics programming journey.</p>
        <div className="flex gap-2 mt-4">
          <button className="btn" onClick={() => window.open("https://github.com/utkarshverm4/raytracer")}>Github</button>
        </div>
      </div>
      <div className="card">
        <h3 className="font-bold" style={{ color: themes[theme] }}>Toy Redis</h3>
        <p className="text-white/80 text-xs">Rust</p>
        <p className="my-2 text-sm">A toy Redis implementation in Rust.</p>
        <div className="flex gap-2 mt-4">
          <button className="btn" onClick={() => window.open("https://github.com/utkarshverm4/toy_redis")}>Github</button>
        </div>
      </div>
      <div className="card">
        <h3 className="font-bold" style={{ color: themes[theme] }}>Chip-8 Emulator</h3>
        <p className="text-white/80 text-xs">Rust + WebAssembly</p>
        <p className="my-2 text-sm">A Chip-8 emulator written in Rust and compiled to WebAssembly. Run classic games directly in your browser.</p>
        <div className="flex gap-2 mt-4">
          <button className="btn" onClick={() => window.open("https://github.com/utkarshverm4/chip8_emulator")}>Github</button>
          <button 
            className="btn" 
            style={{ backgroundColor: themes[theme], opacity: 0.9 }}
            onClick={handleLaunchEmulator}
          >
            Launch Emulator
          </button>
        </div>
      </div>
      <div className="card">
        <h3 className="font-bold" style={{ color: themes[theme] }}>Hecto</h3>
        <p className="text-white/80 text-xs">Rust</p>
        <p className="my-2 text-sm">A terminal based text editor written in Rust. Came from my neovim addiction.</p>
        <div className="flex gap-2 mt-4">
          <button className="btn" onClick={() => window.open("https://github.com/utkarshverm4/hecto")}>Github</button>   
        </div>
      </div>
    </div>

  </div>
)
  

  // Render blogs section
  const renderBlogs = () => (
    <div className="space-y-4">
      <h2 className="section-title text-lg">Blog Posts</h2>
      <div className="space-y-4">
        <div className="card">
          <h3 className="font-bold" style={{ color: themes[theme] }}>Coming Soon...</h3>
          <p className="text-white/80 text-xs">Published on May 15, 2023</p>
          <p className="my-2 text-sm">Underconstruction</p>
          <a href="#" className="hover:underline text-sm" style={{ color: themes[theme] }}>
            Read more →
          </a>
        </div>
        <div className="card">
          <h3 className="font-bold" style={{ color: themes[theme] }}>Coming Soon...</h3>
          <p className="text-white/80 text-xs">Published on April 3, 2023</p>
          <p className="my-2 text-sm">Underconstruction</p>
          <a href="#" className="hover:underline text-sm" style={{ color: themes[theme] }}>
            Read more →
          </a>
        </div>
        <div className="card">
          <h3 className="font-bold" style={{ color: themes[theme] }}>Coming Soon...</h3>
          <p className="text-white/80 text-xs">Published on March 10, 2023</p>
          <p className="my-2 text-sm">Underconstruction</p>
          <a href="#" className="hover:underline text-sm" style={{ color: themes[theme] }}>
            Read more →
          </a>
        </div>
      </div>
    </div>
  )

  // Render social media icons that match the current theme color
  const renderSocialIcons = () => (
    <div className="flex items-center gap-4 mt-3">
      <a 
        href="https://github.com/utkarshverm4" 
        target="_blank" 
        rel="noopener noreferrer"
        className="transition-transform hover:scale-110"
      >
        <Github size={20} color={themes[theme]} />
      </a>
      <a 
        href="https://www.linkedin.com/in/utkarsh-verm4/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="transition-transform hover:scale-110"
      >
        <Linkedin size={20} color={themes[theme]} />
      </a>
      <a 
        href="https://x.com/UtkrshVrm" 
        target="_blank" 
        rel="noopener noreferrer"
        className="transition-transform hover:scale-110"
      >
        <Twitter size={20} color={themes[theme]} />
      </a>
    </div>
  )

  return (
    <div className="min-h-screen bg-black text-white font-mono relative overflow-hidden flex items-center justify-center">
      {/* Cursor glow effect */}
      <div className="glow-container">
        <div
          className="cursor-glow"
          style={{
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y}px`,
            background: `radial-gradient(circle, ${themes[theme]}26 0%, ${themes[theme]}00 70%)`,
          }}
        />
      </div>

     <div
  className={`terminal-window ${
    terminalSize === "expanded" 
      ? "terminal-expanded" 
      : terminalSize === "fullscreen" 
        ? "terminal-fullscreen" 
        : ""
  }`}
  ref={containerRef}
  onClick={handleTerminalClick}
  style={{
    borderColor: themes[theme],
    boxShadow: `0 0 80px ${themes[theme]}26, 0 0 32px ${themes[theme]}1A, 0 0 16px ${themes[theme]}0D, inset 0 0 8px rgba(255, 255, 255, 0.05)`,
  }}
> 
        {/* Terminal header */}
        <header className="terminal-header" style={{ borderBottomColor: `${themes[theme]}4D` }}>
          <div className="flex items-center gap-2">
            <div className="flex gap-2">
              <div className="h-3 w-3 rounded-full bg-[#ff5f57]"></div>
              <div className="h-3 w-3 rounded-full bg-[#febc2e]"></div>
              <div className="h-3 w-3 rounded-full bg-[#28c840]"></div>
            </div>
            <span className="text-white/60 text-sm ml-4">~/portfolio</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-white/60 hover:text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </header>

        {/* Terminal tabs */}
       <div className="terminal-tabs" style={{ borderBottomColor: `${themes[theme]}4D` }}>
  <button
    className={`terminal-tab ${currentSection === "home" ? "active" : ""}`}
    onClick={() => handleTabClick("home")}
  >
    home
  </button>
  <button
    className={`terminal-tab ${currentSection === "projects" ? "active" : ""}`}
    onClick={() => handleTabClick("projects")}
  >
    projects
  </button>
  <button
    className={`terminal-tab ${currentSection === "about" ? "active" : ""}`}
    onClick={() => handleTabClick("about")}
  >
    about
  </button>
  <button
    className={`terminal-tab ${currentSection === "blogs" ? "active" : ""}`}
    onClick={() => handleTabClick("blogs")}
  >
    blogs
  </button>
  {showEmulator && (
    <button
      className={`terminal-tab ${currentSection === "emulator" ? "active" : ""}`}
      onClick={() => setCurrentSection("emulator")}
    >
      emulator
    </button>
  )} 
          <div className="relative">
            <button className="terminal-tab flex items-center gap-2" onClick={() => setShowThemeMenu(!showThemeMenu)}>
              <Palette size={14} />
              <span>theme</span>
            </button>
            {showThemeMenu && (
              <div
                ref={themeMenuRef}
                className="absolute top-full left-0 mt-1 bg-[#1a1a1a] border border-gray-800 rounded shadow-lg z-50 w-32 py-1"
              >
                {Object.entries(themes).map(([name, color]) => (
                  <button
                    key={name}
                    onClick={() => {
                      setTheme(name as keyof typeof themes)
                      setShowThemeMenu(false)
                    }}
                    className="flex items-center gap-2 px-3 py-1 w-full text-left hover:bg-[#2a2a2a] text-white/80"
                  >
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Terminal content */}
        <div className="terminal-content">
          <main className="overflow-auto terminal-output-area" ref={outputRef}>
            {/* Command history with block separation */}
            {!isAnimating &&( 
              <>
              {currentSection !== "emulator" && (
              commandHistory.map((entry, index) => (
                <div key={index} className="command-block">
                  <div className="prompt">~/portfolio git:(main) $</div>
                  <div className="command">
                    <span style={{ color: themes[theme] }}>$</span>
                    <span>{entry.command}</span>
                  </div>
                  {entry.output.length > 0 && (
                    <div className="output">
                      {entry.output[0] === "NEOFETCH_OUTPUT" ? (
                        <div className="flex gap-8">
                          <pre style={{ color: themes[theme] }} className="text-sm">
                            {` _    _ _   _                  _      __      __                       
| |  | | | | |                | |     \\ \\    / /                       
| |  | | |_| | ____ _ _ __ ___| |__    \\ \\  / /__ _ __ _ __ ___   __ _ 
| |  | | __| |/ / _\` | '__/ __| '_ \\    \\ \\/ / _ \\ '__| '_ \\\`_ \\ / _\` |
| |__| | |_|   < (_| | |  \\__ \\ | | |    \\  /  __/ |  | | | | | | (_| |
 \\____/ \\__|_|\\_\\__,_|_|  |___/_| |_|     \\/ \\___|_|  |_| |_| |_|\\__,_|`}
                          </pre>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                              <span style={{ color: themes[theme] }} className="font-bold">
                                OS:
                              </span>
                              <span>OverengineeredOS v2.0</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span style={{ color: themes[theme] }} className="font-bold">
                                Host:
                              </span>
                              <span>Thinkpad Carbon-based Lifeform</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span style={{ color: themes[theme] }} className="font-bold">
                                Uptime:
                              </span>
                              <span>{calculateUptime()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span style={{ color: themes[theme] }} className="font-bold">
                                Configs Tweaked:
                              </span>
                              <span>314</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span style={{ color: themes[theme] }} className="font-bold">
                                READMEs Updated:
                              </span>
                              <span>0</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span style={{ color: themes[theme] }} className="font-bold">
                                Browser Tabs Open:
                              </span>
                              <span>1,337</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span style={{ color: themes[theme] }} className="font-bold">
                                AWS bill:
                              </span>
                              <span>$24,601</span>
                            </div>
                            
                            {/* Social Media Icons */}
                            {renderSocialIcons()}
                          </div>
                        </div>
                      ) : entry.output[0] === "ABOUT_OUTPUT" ? (
                        renderAbout()
                      ) : entry.output[0] === "PROJECTS_OUTPUT" ? (
                        renderProjects()
                      ) : entry.output[0] === "BLOGS_OUTPUT" ? (
                        renderBlogs()
                      ) : (
                        entry.output.map((line, i) => (
                          <div key={i} className="text-sm">
                            {line}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                
              )))}
{currentSection === "emulator" && showEmulator && (
        <div className="command-block">
          <div className="prompt">~/portfolio git:(main) $</div>
          <div className="command">
            <span style={{ color: themes[theme] }}>$</span>
            <span>launch-emulator</span>
          </div>
          <div className="output">
            {renderEmulator()}
          </div>
        </div>
      )}
    </>
  )}
            {isAnimating && (
              <div className="flex items-center justify-center h-full">
                <div className="loading-dots">
                  <span style={{ backgroundColor: themes[theme] }}></span>
                  <span style={{ backgroundColor: themes[theme] }}></span>
                  <span style={{ backgroundColor: themes[theme] }}></span>
                </div>
              </div>
            )}

          </main>

          {/* Command input - fixed at bottom */}
          {!showEmulator && (
          <div className="command-input-block" style={{ borderTopColor: `${themes[theme]}4D` }}>
  <form onSubmit={handleCommandSubmit} className="flex items-center">
    <span className="text-white/60 text-sm mr-2">~/portfolio git:(main) $</span>
    <div className="flex items-center relative">
      {/* Display the command text */}
      <span>{command}</span>
      
      {/* Blinking cursor */}
      <span className="inline-block h-5 w-2 bg-white blink"></span>
      
      {/* Hidden actual input that captures keys */}
      <input
        ref={inputRef}
        type="text"
        value={command}
        onChange={handleCommandInput}
        className="absolute inset-0 opacity-0 w-full cursor-text"
        style={{ caretColor: 'transparent' }}
        autoFocus
      />
    </div>
  </form>
</div>)}       </div>
      </div>
    </div>
  )
}
