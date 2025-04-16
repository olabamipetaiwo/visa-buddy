
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Video, Square, PlayCircle, PauseCircle } from 'lucide-react';
import { toast } from 'sonner';

interface VideoRecorderProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

const VideoRecorder = ({ isRecording, onStartRecording, onStopRecording }: VideoRecorderProps) => {
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoChunksRef = useRef<Blob[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoPlayerRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      // Clean up any active streams when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        } 
      });
      
      streamRef.current = stream;
      
      // Display preview
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      videoChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          videoChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const videoBlob = new Blob(videoChunksRef.current, { type: 'video/mp4' });
        setVideoBlob(videoBlob);
        
        // Stop displaying the preview
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
        
        // Stop all tracks from the stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };
      
      mediaRecorderRef.current.start();
      onStartRecording();
    } catch (error) {
      console.error('Error accessing camera/microphone:', error);
      toast.error('Could not access camera or microphone. Please check permissions.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      onStopRecording();
    }
  };

  const handlePlayRecording = () => {
    if (videoBlob && videoPlayerRef.current) {
      const videoUrl = URL.createObjectURL(videoBlob);
      videoPlayerRef.current.src = videoUrl;
      videoPlayerRef.current.play();
      
      setIsPlaying(true);
      
      videoPlayerRef.current.onended = () => {
        setIsPlaying(false);
      };
    }
  };

  const handlePausePlayback = () => {
    if (videoPlayerRef.current) {
      videoPlayerRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="video-recorder flex flex-col items-center gap-4">
      {isRecording ? (
        <>
          <div className="relative w-full max-w-md rounded-lg overflow-hidden bg-black">
            <video ref={videoRef} className="w-full" muted />
            <div className="absolute top-2 right-2 flex items-center gap-2 bg-black/70 text-white text-xs py-1 px-2 rounded-full">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
              <span>REC</span>
            </div>
          </div>
        </>
      ) : videoBlob ? (
        <div className="w-full max-w-md">
          <video 
            ref={videoPlayerRef} 
            className="w-full rounded-lg" 
            controls={!isPlaying}
          />
          <div className="flex justify-center mt-2">
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
        </div>
      ) : (
        <div className="bg-secondary/50 w-full max-w-md h-64 rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground">Start recording to see camera preview</p>
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
            <Video size={16} />
            {videoBlob ? "Record Again" : "Start Recording"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default VideoRecorder;
