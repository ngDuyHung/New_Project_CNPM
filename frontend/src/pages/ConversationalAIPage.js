import React, { useState, useEffect, useRef } from 'react';
import { ChatBubbleLeftIcon, MicrophoneIcon, SpeakerWaveIcon, PaperAirplaneIcon, StopIcon } from '@heroicons/react/24/outline';
import axiosInstance from '../api/axios';
import topicService from '../api/topicService';
import * as THREE from 'three';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const ConversationalAIPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [aiPersona, setAiPersona] = useState({
    loading: false,
    error: null,
    response: ''
  });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const sceneRef = useRef(null);
  const avatarRef = useRef(null);
  const speechSynthesisRef = useRef(null);
  const [avatarMode, setAvatarMode] = useState('idle'); // 'idle', 'listening', 'speaking'

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Effect for speech recognition
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  // Sync listening state from speech recognition
  useEffect(() => {
    setIsListening(listening);
  }, [listening]);

  // Update avatar mode based on speaking and listening states
  useEffect(() => {
    if (isSpeaking) {
      setAvatarMode('speaking');
    } else if (isListening) {
      setAvatarMode('listening');
    } else {
      setAvatarMode('idle');
    }
  }, [isSpeaking, isListening]);

  // Initialize 3D scene with enhanced avatar - optimized for performance
  useEffect(() => {
    if (!canvasContainerRef.current) return;
    
    // Clear any existing content
    while (canvasContainerRef.current.firstChild) {
      canvasContainerRef.current.removeChild(canvasContainerRef.current.firstChild);
    }
    
    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.className = 'w-full h-full';
    canvasContainerRef.current.appendChild(canvas);
    
    // Set up scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Detect if device is likely to have low performance
    const isLowPerfDevice = window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Set up renderer with antialiasing for better visuals (disable on low-perf devices)
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvas,
      alpha: true,
      antialias: !isLowPerfDevice,
      powerPreference: isLowPerfDevice ? 'low-power' : 'high-performance'
    });
    
    // Responsive canvas sizing
    const canvasSize = Math.min(240, window.innerWidth * 0.6);
    renderer.setSize(canvasSize, canvasSize);
    renderer.setPixelRatio(isLowPerfDevice ? 1 : (window.devicePixelRatio || 1));
    
    // Set up camera with perspective for 3D effect
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    camera.position.z = 5;
    
    // Create a group to hold all avatar elements
    const avatarGroup = new THREE.Group();
    scene.add(avatarGroup);
    avatarRef.current = avatarGroup;
    
    // Create ambient and directional lights for better rendering
    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(2, 2, 2);
    scene.add(directionalLight);
    
    // Add a subtle point light for highlighting
    const pointLight = new THREE.PointLight(0x6366F1, 1.2, 10);
    pointLight.position.set(-1, 0, 3);
    scene.add(pointLight);
    
    // Create the main orb (core sphere with glass-like material)
    const coreGeometry = new THREE.SphereGeometry(0.85, isLowPerfDevice ? 32 : 64, isLowPerfDevice ? 32 : 64);
    const coreMaterial = new THREE.MeshPhysicalMaterial({ 
      color: 0x8B5CF6, // Purple color for Gemini/Claude-like appearance
      transparent: true,
      opacity: 0.9,
      metalness: 0.1,
      roughness: 0.2,
      reflectivity: 0.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      envMapIntensity: 1.0,
      emissive: 0x8B5CF6,
      emissiveIntensity: 0.3
    });
    const coreOrb = new THREE.Mesh(coreGeometry, coreMaterial);
    avatarGroup.add(coreOrb);
    
    // Create an inner energy sphere
    const energyGeometry = new THREE.SphereGeometry(0.7, isLowPerfDevice ? 24 : 32, isLowPerfDevice ? 24 : 32);
    const energyMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xA78BFA,
      transparent: true,
      opacity: 0.7,
      emissive: 0xA78BFA,
      emissiveIntensity: 0.5,
      shininess: 80,
      side: THREE.FrontSide
    });
    const energyCore = new THREE.Mesh(energyGeometry, energyMaterial);
    avatarGroup.add(energyCore);
    
    // Create outer energy field (higher quality for desktop)
    const fieldGeometry = new THREE.SphereGeometry(1.1, isLowPerfDevice ? 24 : 48, isLowPerfDevice ? 24 : 48);
    const fieldMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xC4B5FD,
      transparent: true,
      opacity: 0.2,
      emissive: 0xC4B5FD,
      emissiveIntensity: 0.3,
      side: THREE.BackSide,
      wireframe: false,
      flatShading: false
    });
    const energyField = new THREE.Mesh(fieldGeometry, fieldMaterial);
    avatarGroup.add(energyField);
    
    // Create orbital rings (Saturn-like) - modern tech aesthetic
    const createOrbitalRing = (radius, thickness, segments, color, opacity) => {
      const ringGeo = new THREE.TorusGeometry(
        radius, 
        thickness, 
        isLowPerfDevice ? 6 : 12, 
        segments
      );
      const ringMat = new THREE.MeshPhongMaterial({ 
        color: color,
        transparent: true,
        opacity: opacity,
        emissive: color,
        emissiveIntensity: 0.5,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      return ring;
    };
    
    // Create multiple orbital rings
    const orbitRings = [];
    
    // Primary ring
    const ring1 = createOrbitalRing(1.3, 0.02, isLowPerfDevice ? 64 : 100, 0x8B5CF6, 0.8);
    ring1.rotation.x = Math.PI / 2;
    avatarGroup.add(ring1);
    orbitRings.push(ring1);
    
    // Secondary ring (angled)
    if (!isLowPerfDevice) {
      const ring2 = createOrbitalRing(1.2, 0.01, 80, 0x818CF8, 0.6);
      ring2.rotation.x = Math.PI / 3;
      ring2.rotation.y = Math.PI / 6;
      avatarGroup.add(ring2);
      orbitRings.push(ring2);
    }
    
    // Outer ring for desktop only
    if (!isLowPerfDevice) {
      const ring3 = createOrbitalRing(1.4, 0.005, 120, 0xA5B4FC, 0.5);
      ring3.rotation.x = Math.PI / 4;
      ring3.rotation.z = Math.PI / 4;
      avatarGroup.add(ring3);
      orbitRings.push(ring3);
    }
    
    // Create particle system for galaxy-like effect (more particles on desktop)
    const particleCount = isLowPerfDevice ? 800 : 2000;
    
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);
    const particleColors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      // Create particles in a spherical distribution with some clustering
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.random() * Math.PI;
      const radius = 1.0 + Math.random() * 1.2; // Between 1.0 and 2.2
      
      // Position in spherical coordinates
      particlePositions[i * 3] = Math.sin(theta) * Math.cos(phi) * radius;
      particlePositions[i * 3 + 1] = Math.sin(theta) * Math.sin(phi) * radius;
      particlePositions[i * 3 + 2] = Math.cos(theta) * radius;
      
      // Vary sizes for 3D effect
      particleSizes[i] = Math.random() * (isLowPerfDevice ? 2 : 4);
      
      // Create color gradient from purple to blue
      const colorFactor = Math.random();
      particleColors[i * 3] = 0.4 + colorFactor * 0.2; // R: 0.4-0.6 (purple-blue range)
      particleColors[i * 3 + 1] = 0.3 + colorFactor * 0.2; // G: 0.3-0.5
      particleColors[i * 3 + 2] = 0.8 + colorFactor * 0.2; // B: 0.8-1.0
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    
    // Enhanced shader material for the particles with color support
    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        uniform float time;
        varying vec3 vColor;
        void main() {
          vColor = color;
          
          // Advanced animation for particles
          vec3 pos = position;
          
          // Different animation for different particles
          float angle = time * (0.3 + length(position) * 0.1);
          float particleId = position.x + position.y + position.z;
          float movement = sin(angle + particleId);
          
          ${isLowPerfDevice ? `
            // Simplified animation for mobile
            pos.x += sin(angle) * 0.08;
            pos.y += cos(angle) * 0.08;
          ` : `
            // Full animation for desktop
            pos.x += sin(angle) * 0.15 * movement;
            pos.y += cos(angle) * 0.15 * movement;
            pos.z += sin(angle * 0.7) * 0.12;
          `}
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          // Create circular particles with soft edges
          float r = distance(gl_PointCoord, vec2(0.5, 0.5));
          if (r > 0.5) discard;
          
          // Soft edge glow effect
          float alpha = 1.0 - smoothstep(0.3, 0.5, r);
          
          // Apply the varying color
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthTest: false
    });
    
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    avatarGroup.add(particleSystem);
    
    // Create visualizer rings for listening mode - Siri-like waves
    const visualizerRings = [];
    const numVisRings = isLowPerfDevice ? 3 : 5;
    
    for (let i = 0; i < numVisRings; i++) {
      const ringGeo = new THREE.TorusGeometry(
        1.2 + i * 0.15, 
        0.01, 
        isLowPerfDevice ? 8 : 16, 
        isLowPerfDevice ? 36 : 100
      );
      
      // Purple to blue-ish gradient
      const hue = 0.75 - i * 0.05; // Purple to blue hue range in HSL
      const ringMat = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(hue, 0.8, 0.6),
        transparent: true,
        opacity: 0.6,
        emissive: new THREE.Color().setHSL(hue, 0.8, 0.6),
        emissiveIntensity: 0.6,
        side: THREE.DoubleSide
      });
      
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.visible = false; // Hidden by default
      avatarGroup.add(ring);
      visualizerRings.push(ring);
    }
    
    // Animation variables
    let time = 0;
    let frameId = null;
    let lastFrameTime = 0;
    const targetFPS = isLowPerfDevice ? 30 : 60;
    const frameInterval = 1000 / targetFPS;
    
    // Responsive handling
    const handleResize = () => {
      const newSize = Math.min(240, window.innerWidth * 0.6);
      renderer.setSize(newSize, newSize);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation loop with frame rate limiting for performance
    const animate = (currentTime) => {
      frameId = requestAnimationFrame(animate);
      
      // Limit framerate for performance
      if (currentTime - lastFrameTime < frameInterval) return;
      lastFrameTime = currentTime;
      
      time += 0.01;
      
      // Update particle animation time
      if (particleMaterial.uniforms) {
        particleMaterial.uniforms.time.value = time;
      }
      
      // Rotate orbital rings at different speeds
      orbitRings.forEach((ring, i) => {
        const speed = (i === 0) ? 0.2 : 0.15 + (i * 0.05);
        const direction = i % 2 === 0 ? 1 : -1;
        ring.rotation.z = time * speed * direction;
      });
      
      // Avatar animation based on current mode
      if (avatarMode === 'speaking') {
        // Speaking mode: Dynamic pulsating with bright purple colors
        const pulsateScale = 1 + 0.1 * Math.sin(time * (isLowPerfDevice ? 3 : 5));
        coreOrb.scale.set(pulsateScale, pulsateScale, pulsateScale);
        
        // Brighter core when speaking
        coreMaterial.emissiveIntensity = 0.6 + Math.sin(time * 4) * 0.2;
        energyMaterial.emissiveIntensity = 0.7 + Math.sin(time * 5) * 0.3;
        
        // Intense purple for speaking - Claude/Bard like
        coreMaterial.color.setHex(0x8B5CF6);
        coreMaterial.emissive.setHex(0x8B5CF6);
        energyMaterial.color.setHex(0x9F7AEA);
        energyMaterial.emissive.setHex(0x9F7AEA);
        
        // Faster rotation for speaking mode
        avatarGroup.rotation.y = time * (isLowPerfDevice ? 0.8 : 1.5);
        if (!isLowPerfDevice) {
          avatarGroup.rotation.x = Math.sin(time * 2) * 0.1;
        }
        
        // Hide visualizer rings
        visualizerRings.forEach(ring => {
          ring.visible = false;
        });
        
      } else if (avatarMode === 'listening') {
        // Listening mode: Siri-like wave effect
        const baseScale = 1 + 0.05 * Math.sin(time * 3);
        coreOrb.scale.set(baseScale, baseScale, baseScale);
        
        // Greenish color for listening (like Siri)
        coreMaterial.color.setHex(0x10B981);
        coreMaterial.emissive.setHex(0x10B981);
        energyMaterial.color.setHex(0x34D399);
        energyMaterial.emissive.setHex(0x34D399);
        
        // Lower intensity for listening mode
        coreMaterial.emissiveIntensity = 0.4;
        energyMaterial.emissiveIntensity = 0.5;
        
        // Show and animate visualizer rings - Siri-like waves
        visualizerRings.forEach((ring, i) => {
          ring.visible = true;
          // Pulsating animation for rings that looks like a sound visualizer
          const scale = 1 + 0.4 * Math.sin(time * (isLowPerfDevice ? 5 : 8) + i * 0.8);
          ring.scale.set(scale, scale, scale);
          // Rotate each ring differently
          ring.rotation.z = time * (0.1 + i * 0.05);
        });
        
        // Gentle rotation for listening mode
        avatarGroup.rotation.y = time * (isLowPerfDevice ? 0.5 : 0.8);
        
      } else {
        // Idle mode: Subtle pulsating with calm purple colors (Claude-like)
        const idleScale = 1 + 0.03 * Math.sin(time * 1.5);
        coreOrb.scale.set(idleScale, idleScale, idleScale);
        
        // Softer purple when idle - similar to Claude
        coreMaterial.color.setHex(0x8B5CF6);
        coreMaterial.emissive.setHex(0x8B5CF6);
        energyMaterial.color.setHex(0xA78BFA);
        energyMaterial.emissive.setHex(0xA78BFA);
        
        // Lower emission in idle mode
        coreMaterial.emissiveIntensity = 0.2 + Math.sin(time) * 0.1;
        energyMaterial.emissiveIntensity = 0.3 + Math.sin(time) * 0.1;
        
        // Slow rotation speed when idle
        avatarGroup.rotation.y = time * (isLowPerfDevice ? 0.2 : 0.3);
        
        // Hide visualizer rings
        visualizerRings.forEach(ring => {
          ring.visible = false;
        });
      }
      
      // Add subtle floating motion to the entire avatar
      avatarGroup.position.y = Math.sin(time * 0.8) * (isLowPerfDevice ? 0.05 : 0.08);
      
      renderer.render(scene, camera);
    };
    
    animate(0);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
      
      // Clean up resources
      if (renderer) {
        renderer.dispose();
        
        // Dispose geometries
        if (coreGeometry) coreGeometry.dispose();
        if (energyGeometry) energyGeometry.dispose();
        if (fieldGeometry) fieldGeometry.dispose();
        if (particleGeometry) particleGeometry.dispose();
        
        // Dispose materials
        if (coreMaterial) coreMaterial.dispose();
        if (energyMaterial) energyMaterial.dispose();
        if (fieldMaterial) fieldMaterial.dispose();
        if (particleMaterial) particleMaterial.dispose();
        
        // Dispose orbital rings
        orbitRings.forEach(ring => {
          if (ring.geometry) ring.geometry.dispose();
          if (ring.material) ring.material.dispose();
        });
        
        // Dispose visualizer rings
        visualizerRings.forEach(ring => {
          if (ring.geometry) ring.geometry.dispose();
          if (ring.material) ring.material.dispose();
        });
      }
    };
  }, [avatarMode]);

  // Fetch topics
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const topicsData = await topicService.getAllTopics();
        console.log('Topics loaded:', topicsData);
        setTopics(topicsData || []);
      } catch (error) {
        console.error('Error fetching topics:', error);
      }
    };
    
    fetchTopics();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Stop speech synthesis when unmounting
  useEffect(() => {
    return () => {
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage = {
      role: 'user',
      content: input
    };
    
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    resetTranscript();
    setAiPersona(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Handle demo topics or no topic selection with a local response
      if (!selectedTopic || (selectedTopic && selectedTopic.startsWith && selectedTopic.startsWith('demo'))) {
        // Find the selected demo topic or use a random one
        let topicName = 'General Conversation';
        
        if (selectedTopic && selectedTopic.startsWith && selectedTopic.startsWith('demo')) {
          const selectedDemoTopic = topics.find(t => t.topic_id === selectedTopic);
          topicName = selectedDemoTopic ? selectedDemoTopic.topic_name : topicName;
        } else {
          // Get random topic context if no topic is selected
          const randomTopics = [
            'Daily Conversation', 'Travel and Tourism', 'Food and Dining',
            'Hobbies and Interests', 'Movies and Entertainment', 'Technology',
            'Sports and Exercise', 'Education and Learning', 'Work and Career',
            'Shopping and Lifestyle'
          ];
          topicName = randomTopics[Math.floor(Math.random() * randomTopics.length)];
        }
        
        // Generate a simple response based on the topic and persona
        setTimeout(() => {
          const aiResponse = generateDemoResponse(input, topicName, aiPersona.response);
          
          const aiMessage = {
            role: 'assistant',
            content: aiResponse
          };
          
          setMessages(prev => [...prev, aiMessage]);
          speak(aiResponse);
          setAiPersona(prev => ({ ...prev, loading: false, response: aiResponse }));
        }, 1000); // Simulate network delay
        
        return;
      }
      
      // Real API call for non-demo topics
      const response = await axiosInstance.post('/api/conversational-ai/chat', {
        message: input,
        topic: selectedTopic,
        persona: aiPersona.response
      });
      
      const aiMessage = {
        role: 'assistant',
        content: response.data.message
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Speak the AI response
      speak(response.data.message);
      
      setAiPersona(prev => ({ ...prev, loading: false, response: response.data.message }));
    } catch (error) {
      console.error('Error getting AI response:', error);
      // Fallback response in case of error
      const errorMessage = {
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Could we try again in a moment?"
      };
      setMessages(prev => [...prev, errorMessage]);
      speak(errorMessage.content);
      setAiPersona(prev => ({ ...prev, loading: false, error: error.message }));
    }
  };
  
  // Generate a simple demo response without API call
  const generateDemoResponse = (userInput, topicName, persona) => {
    const lowerInput = userInput.toLowerCase();
    const lowerTopicName = topicName.toLowerCase();
    
    // Simple greetings logic
    if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
      if (persona === 'teacher') {
        return `Hello there! Welcome to our English conversation practice. We'll be focusing on "${topicName}" today. How can I help you improve your English skills in this area?`;
      } else if (persona === 'tourist_guide') {
        return `Hi there! Welcome to our virtual tour. I'll be your guide for discussing "${topicName}". Is this your first time practicing conversation on this topic?`;
      } else if (persona === 'interviewer') {
        return `Good day. I'll be conducting this practice interview about "${topicName}". Tell me a bit about your experience with this subject.`;
      } else {
        return `Hey! Great to meet you. Let's chat about "${topicName}". What aspects of this topic are you most interested in?`;
      }
    }
    
    // Questions about the user
    if (lowerInput.includes('how are you') || lowerInput.includes('how do you do')) {
      return `I'm doing well, thank you for asking! I'm excited to help you practice your English conversation skills about "${topicName}". How about you?`;
    }
    
    // Topic change request
    if (lowerInput.includes('change topic') || lowerInput.includes('different topic') || lowerInput.includes('another topic')) {
      const newTopics = [
        'Daily Conversation', 'Travel and Tourism', 'Food and Dining',
        'Hobbies and Interests', 'Movies and Entertainment', 'Technology'
      ];
      const suggestedTopic = newTopics[Math.floor(Math.random() * newTopics.length)];
      return `Sure, we can change the topic. How about we talk about "${suggestedTopic}" instead? Or is there a specific topic you'd prefer?`;
    }
    
    // Topic-related responses with clearer Vietnamese translations
    if (lowerTopicName.includes('travel')) {
      return `That's interesting! When traveling, it's helpful to know phrases like "Could you recommend good places to visit?" (Nghĩa: Bạn có thể gợi ý địa điểm nào để tham quan không?) or "How do I get to...?" (Nghĩa: Làm sao để đến...?). Have you traveled much before?`;
    } else if (lowerTopicName.includes('interview') || lowerTopicName.includes('career') || lowerTopicName.includes('work')) {
      return `Good point! In job interviews, you might want to use phrases like "I'm particularly skilled at..." (Nghĩa: Tôi đặc biệt giỏi về...) or "My experience includes..." (Nghĩa: Kinh nghiệm của tôi bao gồm...). Would you like to practice answering a common interview question?`;
    } else if (lowerTopicName.includes('talk') || lowerTopicName.includes('daily') || lowerTopicName.includes('conversation')) {
      return `That's a great conversation starter! For daily small talk, you could also try "What do you do for fun?" (Nghĩa: Bạn làm gì để giải trí?) or "Have you seen any good movies lately?" (Nghĩa: Gần đây bạn có xem bộ phim hay nào không?). What other topics do you usually discuss in casual conversations?`;
    } else if (lowerTopicName.includes('food') || lowerTopicName.includes('dining') || lowerTopicName.includes('restaurant')) {
      return `When ordering food, you might say "I'd like to order..." (Nghĩa: Tôi muốn gọi...) or "What would you recommend?" (Nghĩa: Bạn gợi ý món gì?). Do you have any favorite cuisines or dishes?`;
    } else if (lowerTopicName.includes('shopping') || lowerTopicName.includes('lifestyle')) {
      return `While shopping, useful phrases include "Do you have this in another size?" (Nghĩa: Bạn có cái này với kích cỡ khác không?) or "Is this on sale?" (Nghĩa: Cái này có đang giảm giá không?). What kinds of things do you enjoy shopping for?`;
    } else if (lowerTopicName.includes('movie') || lowerTopicName.includes('entertainment')) {
      return `When discussing movies, you can use phrases like "I really enjoyed..." (Nghĩa: Tôi thực sự thích...) or "The plot was..." (Nghĩa: Cốt truyện là...). What kinds of movies or shows do you enjoy watching?`;
    } else if (lowerTopicName.includes('technology')) {
      return `When talking about technology, useful expressions include "This device features..." (Nghĩa: Thiết bị này có tính năng...) or "Have you tried the new...?" (Nghĩa: Bạn đã thử cái mới...?). What technology do you use most in your daily life?`;
    } else if (lowerTopicName.includes('sport') || lowerTopicName.includes('exercise')) {
      return `For sports conversations, you might say "I'm a fan of..." (Nghĩa: Tôi là fan của...) or "Do you play any sports?" (Nghĩa: Bạn có chơi môn thể thao nào không?). What kinds of physical activities do you enjoy?`;
    } else if (lowerTopicName.includes('education') || lowerTopicName.includes('learning')) {
      return `When discussing education, you can use phrases like "I'm studying..." (Nghĩa: Tôi đang học...) or "The most interesting course I've taken is..." (Nghĩa: Khóa học thú vị nhất mà tôi từng học là...). What subjects are you interested in learning about?`;
    } else if (lowerTopicName.includes('hobbies') || lowerTopicName.includes('interests')) {
      return `When talking about hobbies, try phrases like "In my free time, I enjoy..." (Nghĩa: Trong thời gian rảnh, tôi thích...) or "I've recently taken up..." (Nghĩa: Gần đây tôi đã bắt đầu...). What do you like to do in your spare time?`;
    } else {
      // Generic response for any other topic
      return `That's an interesting point about ${topicName}! Could you tell me more about your experience with this topic? I'm here to help you practice your English conversation skills.`;
    }
  };

  const speak = (text) => {
    if (window.speechSynthesis) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // Extract only the English text by removing Vietnamese translations in parentheses
      let englishText = text.replace(/\([^)]*\)/g, '');
      
      const utterance = new SpeechSynthesisUtterance(englishText);
      utterance.lang = 'en-US';
      
      utterance.onstart = () => {
        setIsSpeaking(true);
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      speechSynthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const handleMicToggle = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  const personas = [
    { id: 'teacher', name: 'English Teacher' },
    { id: 'tourist_guide', name: 'Tourist Guide' },
    { id: 'interviewer', name: 'Job Interviewer' },
    { id: 'friend', name: 'Casual Friend' },
    { id: 'business', name: 'Business Partner' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Conversational AI</h1>
      
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Topic
          </label>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">No specific topic (AI will choose randomly)</option>
            
            {/* Demo topics */}
{topics && topics.some(t => String(t.topic_id).startsWith('demo')) && (
  <optgroup label="Demo Topics">
    {topics
      .filter(topic => String(topic.topic_id).startsWith('demo'))
      .map((topic) => (
        <option key={topic.topic_id} value={topic.topic_id}>
          {topic.topic_name}
        </option>
      ))}
  </optgroup>
)}

{/* Real topics */}
{topics && topics.some(t => !String(t.topic_id).startsWith('demo')) && (
  <optgroup label="Your Topics">
    {topics
      .filter(topic => !String(topic.topic_id).startsWith('demo'))
      .map((topic) => (
        <option key={topic.topic_id} value={topic.topic_id}>
          {topic.topic_name}
        </option>
      ))}
  </optgroup>
)}
          </select>
          
          {!selectedTopic && (
            <p className="mt-2 text-sm text-blue-500">
              You can start chatting without selecting a topic. The AI will choose random topics.
            </p>
          )}
          
          {selectedTopic && selectedTopic.startsWith('demo') && (
            <p className="mt-2 text-sm text-blue-500">
              Demo mode: Using local responses (no API calls)
            </p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            AI Persona
          </label>
          <select
            value={aiPersona.response}
            onChange={(e) => setAiPersona(prev => ({ ...prev, response: e.target.value }))}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {personas.map((persona) => (
              <option key={persona.id} value={persona.id}>
                {persona.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md h-96 mb-4 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <ChatBubbleLeftIcon className="h-12 w-12 mx-auto mb-2" />
                <p>Start a conversation with the AI assistant</p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`px-4 py-3 rounded-lg max-w-[80%] ${
                      message.role === 'user' 
                        ? 'bg-blue-500 text-white rounded-br-none' 
                        : 'bg-gray-200 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    {message.role === 'assistant' ? (
                      <div>
                        {/* Format the message to highlight Vietnamese translations */}
                        {message.content.split(/(\([^)]*\))/).map((part, i) => {
                          // Check if the part is a Vietnamese translation (in parentheses)
                          if (part.startsWith('(Nghĩa:') && part.endsWith(')')) {
                            return (
                              <span key={i} className="text-green-700 text-sm italic block mt-1">
                                {part}
                              </span>
                            );
                          }
                          // Otherwise it's English text
                          return part;
                        })}
                      </div>
                    ) : (
                      message.content
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
        
        <div className="p-4 border-t">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={aiPersona.loading}
              />
              {listening && (
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-red-500 animate-pulse">
                  Listening...
                </span>
              )}
            </div>
            
            <button
              type="button"
              onClick={handleMicToggle}
              className={`p-2 rounded-full focus:outline-none ${
                listening ? 'bg-red-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
              }`}
              disabled={!browserSupportsSpeechRecognition || aiPersona.loading}
            >
              <MicrophoneIcon className="h-5 w-5" />
            </button>
            
            {isSpeaking ? (
              <button
                type="button"
                onClick={stopSpeaking}
                className="p-2 bg-red-500 text-white rounded-full focus:outline-none"
              >
                <StopIcon className="h-5 w-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  const lastAiMessage = [...messages].reverse().find(msg => msg.role === 'assistant');
                  if (lastAiMessage) speak(lastAiMessage.content);
                }}
                className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full focus:outline-none"
                disabled={!messages.some(msg => msg.role === 'assistant') || aiPersona.loading}
              >
                <SpeakerWaveIcon className="h-5 w-5" />
              </button>
            )}
            
            <button
              type="submit"
              className="p-2 bg-blue-500 text-white rounded-full focus:outline-none hover:bg-blue-600"
              disabled={!input.trim() || aiPersona.loading}
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
      
      <div className="flex flex-col items-center w-full mb-4">
        <div className="text-center mb-2 font-semibold text-indigo-600">AI Conversation Assistant</div>
        <div className="relative w-full max-w-xs mx-auto">
          {/* Multi-layered glow effects - optimized for performance */}
          <div className="absolute inset-0 bg-gradient-radial from-indigo-400 to-transparent opacity-20 blur-xl rounded-full transform-gpu"></div>
          <div className="absolute inset-0 bg-ai-gradient rounded-full animate-glow"></div>
          
          {/* Avatar container with responsive class */}
          <div className="relative max-w-avatar mx-auto aspect-square">
            <div 
              ref={canvasContainerRef} 
              className="w-full h-full rounded-full overflow-hidden shadow-lg bg-black"
            ></div>
            
            {/* Status indicator with improved styling */}
            <div className="absolute bottom-2 w-full flex justify-center">
              <div className="text-xs font-medium px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center gap-1.5 shadow-lg border border-purple-400/20">
                {isSpeaking ? (
                  <>
                    <span>Speaking</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse-faster"></div>
                  </>
                ) : isListening ? (
                  <>
                    <span>Listening</span>
                    <div className="flex items-center h-3 gap-0.5">
                      {[...Array(3)].map((_, i) => (
                        <div 
                          key={i} 
                          className="w-0.5 mx-px bg-green-400 rounded-full animate-sound-wave" 
                          style={{ animationDelay: `${i * 0.2}s` }}
                        ></div>
                      ))}
                    </div>
                  </>
                ) : aiPersona.loading ? (
                  <>
                    <span>Processing</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse-slow"></div>
                  </>
                ) : (
                  <>
                    <span>Idle</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationalAIPage; 