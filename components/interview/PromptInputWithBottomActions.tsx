"use client";

import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import PromptInput from "./PromptInput";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function PromptInputWithBottomActions({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [prompt, setPrompt] = useState<string>(value);
  const [listening, setListening] = useState<boolean>(false);
  const [micPermissionGranted, setMicPermissionGranted] =
    useState<boolean>(false);
  const recognitionRef = useRef<any>(null);
  const retryCountRef = useRef<number>(0);
  const isManualStopRef = useRef<boolean>(false);

  // Sync with external value changes
  useEffect(() => {
    setPrompt(value);
  }, [value]);

  // Check microphone permissions on mount
  useEffect(() => {
    checkMicrophonePermission();

    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors during cleanup
        }
      }
    };
  }, []);

  const checkMicrophonePermission = async () => {
    try {
      const result = await navigator.permissions.query({
        name: "microphone" as PermissionName,
      });
      setMicPermissionGranted(result.state === "granted");

      // Listen for permission changes
      result.onchange = () => {
        setMicPermissionGranted(result.state === "granted");
        if (result.state === "denied") {
          toast.error(
            "Microphone permission denied. Please enable it in browser settings."
          );
          stopListening();
        }
      };
    } catch (error) {
      // Permission API not supported, will check during mic access
      console.log("Permission API not supported");
    }
  };

  const handlePromptChange = (value: string) => {
    setPrompt(value);
    onChange(value);
  };

  const stopListening = () => {
    isManualStopRef.current = true;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error("Error stopping recognition:", e);
      }
    }
    setListening(false);
    retryCountRef.current = 0;
  };

  const startRecognition = async () => {
    // Check browser support
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error(
        "Your browser doesn't support speech recognition. Try Chrome or Edge."
      );
      return;
    }

    // Check HTTPS requirement
    if (
      window.location.protocol !== "https:" &&
      !window.location.hostname.includes("localhost")
    ) {
      toast.error(
        "Speech recognition requires HTTPS. Please use a secure connection."
      );
      return;
    }

    // Request microphone permission
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicPermissionGranted(true);
    } catch (error: any) {
      if (error.name === "NotAllowedError") {
        toast.error(
          "Microphone access denied. Please allow microphone access and try again."
        );
      } else if (error.name === "NotFoundError") {
        toast.error(
          "No microphone found. Please connect a microphone and try again."
        );
      } else {
        toast.error("Unable to access microphone. Please check your settings.");
      }
      return;
    }

    // Create recognition instance
    const recognition = new SpeechRecognition();
    recognition.continuous = true; // Keep listening
    recognition.interimResults = true; // Show partial results
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
      isManualStopRef.current = false;
      retryCountRef.current = 0;
      toast.success("🎤 Listening... Speak now!");
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      // Update with final transcript if available, otherwise interim
      if (finalTranscript) {
        const newText = prompt + finalTranscript;
        setPrompt(newText);
        onChange(newText);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);

      switch (event.error) {
        case "no-speech":
          toast("No speech detected. Keep speaking...", { icon: "🎤" });
          // Don't stop, just continue listening
          break;

        case "audio-capture":
          toast.error(
            "Microphone not detected. Please check your microphone connection."
          );
          stopListening();
          break;

        case "not-allowed":
          toast.error(
            "Microphone permission denied. Please enable it in browser settings."
          );
          setMicPermissionGranted(false);
          stopListening();
          break;

        case "network":
          if (retryCountRef.current < 3 && !isManualStopRef.current) {
            retryCountRef.current++;
            toast(`Network issue. Retrying... (${retryCountRef.current}/3)`, {
              icon: "🔄",
            });
            // Auto-retry after 1 second
            setTimeout(() => {
              if (!isManualStopRef.current) {
                startRecognition();
              }
            }, 1000);
          } else {
            toast.error(
              "Network connection lost. Please check your internet and try again."
            );
            stopListening();
          }
          break;

        case "aborted":
          if (!isManualStopRef.current) {
            toast.error("Speech recognition stopped unexpectedly.");
          }
          stopListening();
          break;

        default:
          toast.error(`Error: ${event.error}. Please try again.`);
          stopListening();
      }
    };

    recognition.onend = () => {
      // Auto-restart if not manually stopped and was listening
      if (!isManualStopRef.current && listening) {
        setTimeout(() => {
          if (!isManualStopRef.current) {
            try {
              recognition.start();
            } catch (e) {
              console.error("Failed to restart recognition:", e);
              stopListening();
            }
          }
        }, 100);
      } else {
        setListening(false);
      }
    };

    // Store reference and start
    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (error) {
      console.error("Failed to start recognition:", error);
      toast.error("Failed to start voice input. Please try again.");
      setListening(false);
    }
  };

  const handleVoiceInput = async () => {
    if (listening) {
      // Stop listening
      stopListening();
      toast.success("Voice input stopped");
    } else {
      // Start listening
      await startRecognition();
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <form
        className="flex w-full flex-col items-start rounded-medium bg-default-100 transition-colors hover:bg-default-200/70"
        onSubmit={(e) => e.preventDefault()}
      >
        <PromptInput
          classNames={{
            inputWrapper: "!bg-transparent shadow-none",
            innerWrapper: "relative",
            input: "pt-1 pl-2 pb-6 !pr-10 text-medium",
          }}
          minRows={3}
          radius="lg"
          value={prompt}
          onValueChange={handlePromptChange}
          variant="flat"
          placeholder="Type your answer here or use voice input..."
        />
        <div className="flex w-full items-center justify-between gap-2 overflow-auto px-4 pb-4">
          <div className="flex w-full gap-1 md:gap-3">
            <Button
              size="sm"
              color={listening ? "danger" : "default"}
              startContent={
                listening ? (
                  <Icon
                    className="text-danger-500 animate-pulse"
                    icon="solar:microphone-3-bold"
                    width={18}
                  />
                ) : (
                  <Icon
                    className={
                      micPermissionGranted
                        ? "text-success-500"
                        : "text-default-500"
                    }
                    icon="solar:soundwave-linear"
                    width={18}
                  />
                )
              }
              variant={listening ? "solid" : "flat"}
              onPress={handleVoiceInput}
            >
              {listening ? "Stop Recording" : "Type with Voice"}
            </Button>

            {listening && (
              <div className="flex items-center gap-2 text-sm text-danger-500 animate-pulse">
                <Icon icon="solar:record-circle-bold" width={16} />
                <span>Recording...</span>
              </div>
            )}

            {!micPermissionGranted && !listening && (
              <div className="flex items-center gap-1 text-xs text-warning-500">
                <Icon icon="solar:danger-triangle-linear" width={14} />
                <span>Mic permission needed</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <p className="py-1 text-tiny text-default-400">
              {prompt?.length} chars
            </p>
          </div>
        </div>
      </form>

      {/* Instructions */}
      {!micPermissionGranted && (
        <div className="text-xs text-default-400 px-1">
          💡 Tip: Allow microphone access in your browser to use voice input
        </div>
      )}
    </div>
  );
}
