"use client";

import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import { useEffect } from "react";

export default function VoiceInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
    resetTranscript,
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript && transcript !== value) {
      onChange(transcript);
    }
  }, [transcript, onChange, value]);

  if (!browserSupportsSpeechRecognition) {
    return (
      <Button
        size="sm"
        variant="flat"
        startContent={<Icon icon="solar:soundwave-linear" width={18} />}
        onPress={() => toast.error("Your browser doesn’t support voice input.")}
      >
        Type with Voice
      </Button>
    );
  }

  const handleToggle = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      toast.success("Voice input stopped.");
    } else {
      resetTranscript();
      SpeechRecognition.startListening({
        continuous: false,
        language: "en-US",
      });
      toast.success("Listening... Speak now!");
    }
  };

  return (
    <Button
      size="sm"
      startContent={
        <Icon
          icon="solar:soundwave-linear"
          width={18}
          className={listening ? "text-primary" : "text-default-500"}
        />
      }
      variant={listening ? "solid" : "flat"}
      onPress={handleToggle}
    >
      {listening ? "Listening..." : "Type with Voice"}
    </Button>
  );
}
