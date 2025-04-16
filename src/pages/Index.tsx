
import { useState, useEffect } from 'react';
import { visaQuestions } from '@/data/visaQuestions';
import QuestionCard from '@/components/QuestionCard';
import StartScreen from '@/components/StartScreen';
import SummaryScreen from '@/components/SummaryScreen';
import Layout from '@/components/Layout';

// Screens in the app
type Screen = 'start' | 'practice' | 'summary';
type RecordingMode = 'audio' | 'video' | 'none';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('start');
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const [recordingMode, setRecordingMode] = useState<RecordingMode>('none');

  // Shuffle questions on initial load
  useEffect(() => {
    shuffleQuestions();
  }, []);

  const shuffleQuestions = () => {
    // Create a copy of the questions array and shuffle it
    const shuffled = [...visaQuestions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
  };

  const startPractice = (mode: RecordingMode) => {
    setRecordingMode(mode);
    setCurrentScreen('practice');
    setCurrentQuestionIndex(0);
    setAnsweredQuestions(0);
    shuffleQuestions();
  };

  const handleNextQuestion = () => {
    setAnsweredQuestions(prev => prev + 1);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // End of questions
      endPractice(answeredQuestions + 1);
    }
  };

  const handleSkipQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      // Move the skipped question to the end
      const newQuestions = [...questions];
      const skipped = newQuestions.splice(currentQuestionIndex, 1)[0];
      newQuestions.push(skipped);
      
      setQuestions(newQuestions);
      // Don't increment currentQuestionIndex as we're removing current and replacing it
    } else {
      // If it's the last question and user skips, end the session
      endPractice(answeredQuestions);
    }
  };

  const endPractice = (answered: number) => {
    setAnsweredQuestions(answered);
    setCurrentScreen('summary');
  };

  return (
    <Layout>
      {currentScreen === 'start' && (
        <StartScreen 
          totalQuestions={visaQuestions.length} 
          onStart={startPractice} 
        />
      )}
      
      {currentScreen === 'practice' && questions.length > 0 && (
        <QuestionCard
          question={questions[currentQuestionIndex]}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          recordingMode={recordingMode}
          onNext={handleNextQuestion}
          onSkip={handleSkipQuestion}
          onEnd={endPractice}
        />
      )}
      
      {currentScreen === 'summary' && (
        <SummaryScreen
          questionsAnswered={answeredQuestions}
          totalQuestions={visaQuestions.length}
          onRestart={() => {
            setCurrentScreen('start');
            setRecordingMode('none');
          }}
        />
      )}
    </Layout>
  );
};

export default Index;
