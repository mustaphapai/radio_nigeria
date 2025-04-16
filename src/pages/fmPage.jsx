 "use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Radio, Pause, Play, Waves, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const FMPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioContext, setAudioContext] = useState(null);
  const [windowWidth, setWindowWidth] = useState(0);
  const [hueRotation, setHueRotation] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isLoading, setIsLoading] = useState(false);
  const [streamError, setStreamError] = useState(false);

  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const animationRef = useRef(null);
  const visualizerSetupRef = useRef(false);
  const colorAnimationRef = useRef(null);

  const [stationInfo] = useState({
    name: "Kapital FM Abuja",
    frequency: "92.9 FM",
    location: "Abuja, Nigeria",
    schedule: "24/7 Service",
    language: "English, Multiple",
    website: "https://www.radio.gov.ng/kapital-fm/",
    description: "The Heartbeat of Nigeria's Capital",
  });

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    animateColors();
    return () => {
      window.removeEventListener("resize", handleResize);
      if (colorAnimationRef.current) cancelAnimationFrame(colorAnimationRef.current);
    };
  }, []);

  const animateColors = () => {
    const animate = () => {
      setHueRotation((prev) => (prev + 0.5) % 360);
      colorAnimationRef.current = requestAnimationFrame(animate);
    };
    colorAnimationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const context = new AudioContextClass();
    setAudioContext(context);

    const audio = new Audio("https://stream.radio.gov.ng/kapitalfm");
    audio.crossOrigin = "anonymous";
    audio.preload = "auto";
    audio.volume = volume;

    audio.addEventListener("waiting", () => setIsLoading(true));
    audio.addEventListener("playing", () => setIsLoading(false));
    audio.addEventListener("error", () => {
      setStreamError(true);
      setIsLoading(false);
      setIsPlaying(false);
    });

    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (colorAnimationRef.current) cancelAnimationFrame(colorAnimationRef.current);
      if (sourceRef.current) sourceRef.current.disconnect();
      if (analyserRef.current) analyserRef.current.disconnect();
      if (context) context.close();
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const setupVisualizer = () => {
    if (!audioContext || !audioRef.current || !canvasRef.current || visualizerSetupRef.current) return;

    visualizerSetupRef.current = true;

    const analyser = audioContext.createAnalyser();
    analyserRef.current = analyser;

    const source = audioContext.createMediaElementSource(audioRef.current);
    sourceRef.current = source;

    source.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.fftSize = 512;
  };

  const getAnimatedColor = (value) => {
    const hue = (hueRotation + value * 0.7) % 360;
    const saturation = 80;
    const lightness = 30 + value * 25;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  const drawVisualizer = () => {
    if (!canvasRef.current || !analyserRef.current) return;

    const analyser = analyserRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const width = canvas.width;
    const height = canvas.height;

    const draw = () => {
      if (!ctx || !analyser) return;

      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(0, 0, width, height);

      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, height);

      const sliceWidth = width / bufferLength;

      for (let i = 0; i < bufferLength; i++) {
        const value = dataArray[i] / 255.0;
        const x = i * sliceWidth;
        const time = Date.now() / 1000;
        const waveHeight = value * height * 0.8;
        const y = height - waveHeight - Math.sin(x / 50 + time * 2) * 5;

        ctx.strokeStyle = getAnimatedColor(value);
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          const prevX = (i - 1) * sliceWidth;
          const cpX = (prevX + x) / 2;
          ctx.quadraticCurveTo(cpX, y, x, y);
        }
      }

      ctx.lineTo(width, height);
      ctx.lineTo(0, height);

      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, `hsla(${hueRotation}, 80%, 50%, 0.8)`);
      gradient.addColorStop(1, `hsla(${hueRotation}, 80%, 50%, 0.1)`);
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(0, height / 2);

      for (let i = 0; i < bufferLength; i++) {
        const value = dataArray[i] / 255.0;
        const x = i * sliceWidth;
        const time = Date.now() / 1000;
        const waveHeight = value * height * 0.4;
        const y = height / 2 + waveHeight + Math.sin(x / 30 + time * 3) * 3;

        ctx.strokeStyle = getAnimatedColor(1 - value);

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          const prevX = (i - 1) * sliceWidth;
          const cpX = (prevX + x) / 2;
          ctx.quadraticCurveTo(cpX, y, x, y);
        }
      }

      ctx.stroke();
    };

    draw();
  };

  const togglePlay = async () => {
    try {
      if (!audioContext || !audioRef.current) return;

      setStreamError(false);

      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }

      if (isPlaying) {
        audioRef.current.pause();
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        setIsPlaying(false);
      } else {
        setIsLoading(true);
        setupVisualizer();
        try {
          await audioRef.current.play();
          drawVisualizer();
          setIsPlaying(true);
        } catch (error) {
          console.error("Playback error:", error);
          setStreamError(true);
        } finally {
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error("Audio error:", error);
      setStreamError(true);
      setIsLoading(false);
    }
  };

  const handleVolumeChange = (value) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) audioRef.current.volume = newVolume;
  };

  return (
    <Card className="w-full max-w-[280px] mx-auto my-8 bg-white shadow-lg">
      <CardHeader className="space-y-1 pb-2">
        <CardTitle className="flex items-center gap-1 text-indigo-600">
          <div className="bg-red-500 text-white text-[8px] font-bold px-1 py-0.5 rounded">LIVE</div>
          <Radio className="w-4 h-4" />
          <div>
            <h2 className="text-sm font-bold truncate">{stationInfo.name}</h2>
            <p className="text-[0.6rem] font-normal text-gray-500 truncate">
              {stationInfo.frequency} • {stationInfo.location}
            </p>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2 pt-0">
        <div className="text-[0.7rem] text-center text-gray-500 mb-1">{stationInfo.description}</div>
        <canvas ref={canvasRef} width="225" height="50" className="bg-slate-50 p-1 rounded-md" />

        <div className="grid grid-cols-2 gap-1 text-[0.7rem]">
          <div className="flex items-center gap-0.5 p-1 bg-slate-50 rounded">
            <Waves className="w-2 h-2 text-indigo-500 flex-shrink-0" />
            <span className="font-medium">Language:</span>
            <span className="truncate">{stationInfo.language}</span>
          </div>
          <div className="flex items-center gap-0.5 p-1 bg-slate-50 rounded">
            <Radio className="w-2 h-2 text-indigo-500 flex-shrink-0" />
            <span className="font-medium">Schedule:</span>
            <span className="truncate">{stationInfo.schedule}</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Volume2 className="h-3 w-3 text-gray-500" />
          <Slider
            defaultValue={[0.8]}
            max={1}
            step={0.01}
            value={[volume]}
            onValueChange={handleVolumeChange}
            className="flex-1"
          />
        </div>

        {streamError && (
          <div className="text-[0.7rem] text-red-500 text-center">
            Stream error. Please try again or check your connection.
          </div>
        )}

        <Button
          onClick={togglePlay}
          variant={isPlaying ? "default" : "outline"}
          className="w-full gap-1 py-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="text-xs">Loading...</span>
          ) : isPlaying ? (
            <>
              <Pause className="w-3 h-3" />
              <span className="text-xs">Pause</span>
            </>
          ) : (
            <>
              <Play className="w-3 h-3" />
              <span className="text-xs">Listen</span>
            </>
          )}
        </Button>

        <div className="text-center">
          <a
            href={stationInfo.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[0.7rem] text-indigo-600 hover:underline"
          >
            Visit Website →
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default FMPlayer;
