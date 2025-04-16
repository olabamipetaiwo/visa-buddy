
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, PlayCircle, PauseCircle } from 'lucide-react';
import { toast } from 'sonner';

interface AudioRecorderProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

const AudioRecorder = ({ isRecording, onStartRecording, onStopRecording }: AudioRecorderProps) => {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioPlayerRef.current = new Audio();
    
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        
        // Stop all tracks from the stream
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start();
      onStartRecording();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Could not access microphone. Please check permissions.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      onStopRecording();
    }
  };

  const handlePlayRecording = () => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      audioPlayerRef.current!.src = audioUrl;
      audioPlayerRef.current!.play();
      
      setIsPlaying(true);
      
      audioPlayerRef.current!.onended = () => {
        setIsPlaying(false);
      };
    }
  };

  const handlePausePlayback = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="audio-recorder flex flex-col items-center gap-4">
      {isRecording ? (
        <div className="recording-indicator flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-sm font-medium">Recording in progress...</span>
        </div>
      ) : audioBlob && (
        <div className="playback-controls flex items-center gap-2">
          {isPlaying ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handlePausePlayback}
              className="flex items-center gap-1"
            >
              <PauseCircle size={16} />
              Pause
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handlePlayRecording}
              className="flex items-center gap-1"
            >
              <PlayCircle size={16} />
              Play Recording
            </Button>
          )}
        </div>
      )}
      
      <div className="recording-controls">
        {isRecording ? (
          <Button
            variant="destructive"
            onClick={handleStopRecording}
            className="flex items-center gap-2"
          >
            <Square size={16} />
            Stop Recording
          </Button>
        ) : (
          <Button
            onClick={handleStartRecording}
            className="flex items-center gap-2"
            disabled={isPlaying}
          >
            <Mic size={16} />
            Start Recording
          </Button>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;
