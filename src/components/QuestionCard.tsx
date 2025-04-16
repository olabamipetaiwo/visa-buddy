
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlayCircle, PauseCircle, SkipForward, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import AudioRecorder from './AudioRecorder';
import VideoRecorder from './VideoRecorder';

interface QuestionCardProps {
  question: string;
  questionNumber: number;
  totalQuestions: number;
  recordingMode: 'audio' | 'video' | 'none';
  onNext: () => void;
  onSkip: () => void;
  onEnd: (answeredQuestions: number) => void;
}

const QuestionCard = ({
  question,
  questionNumber,
  totalQuestions,
  recordingMode,
  onNext,
  onSkip,
  onEnd
}: QuestionCardProps) => {
  const [isAnswering, setIsAnswering] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    
    if (isAnswering) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else if (!isAnswering && seconds !== 0) {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAnswering, seconds]);

  useEffect(() => {
    // Calculate progress percentage
    setProgress((questionNumber / totalQuestions) * 100);
  }, [questionNumber, totalQuestions]);

  const toggleAnswering = () => {
    setIsAnswering(!isAnswering);
  };

  const handleNext = () => {
    setIsAnswering(false);
    setSeconds(0);
    setIsRecording(false);
    onNext();
  };

  const handleSkip = () => {
    setIsAnswering(false);
    setSeconds(0);
    setIsRecording(false);
    onSkip();
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const secs = time % 60;
    return `${minutes}:${secs < 10 ? '0' + secs : secs}`;
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setIsAnswering(true);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsAnswering(false);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <Badge variant="outline" className="text-sm">
            Question {questionNumber} of {totalQuestions}
          </Badge>
          <div className="flex items-center gap-1 text-sm font-medium">
            <Clock size={16} className="text-primary" />
            {formatTime(seconds)}
          </div>
        </div>
        <Progress value={progress} className="h-1 mt-2" />
      </CardHeader>
      <CardContent className="pt-4">
        <CardTitle className="text-lg md:text-xl mb-6 leading-relaxed">
          {question}
        </CardTitle>
        
        {recordingMode === 'audio' ? (
          <div className="mt-6">
            <AudioRecorder 
              isRecording={isRecording}
              onStartRecording={handleStartRecording}
              onStopRecording={handleStopRecording}
            />
          </div>
        ) : recordingMode === 'video' ? (
          <div className="mt-6">
            <VideoRecorder 
              isRecording={isRecording}
              onStartRecording={handleStartRecording}
              onStopRecording={handleStopRecording}
            />
          </div>
        ) : (
          <div className="bg-secondary/50 p-4 rounded-lg mt-4 border border-secondary">
            <p className="text-sm text-muted-foreground">
              {isAnswering ? 
                "Answering... Take your time to provide a complete answer." : 
                "Press 'Start Answering' when you're ready to practice your response."}
            </p>
          </div>
        )}

        {recordingMode === 'none' && (
          <Button
            variant={isAnswering ? "outline" : "default"}
            onClick={toggleAnswering}
            className="flex items-center gap-2 mt-4"
          >
            {isAnswering ? (
              <>
                <PauseCircle size={18} /> Pause
              </>
            ) : (
              <>
                <PlayCircle size={18} /> Start Answering
              </>
            )}
          </Button>
        )}
      </CardContent>
      <CardFooter className="flex justify-between gap-3 flex-wrap">
        <Button 
          variant="secondary" 
          onClick={handleSkip}
          className="flex items-center gap-2"
        >
          <SkipForward size={18} /> Skip
        </Button>
        <Button onClick={handleNext}>Next Question</Button>
      </CardFooter>
    </Card>
  );
};

export default QuestionCard;
