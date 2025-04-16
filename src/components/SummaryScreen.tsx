
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, BarChart, Clock, RefreshCw } from 'lucide-react';

interface SummaryScreenProps {
  questionsAnswered: number;
  totalQuestions: number;
  onRestart: () => void;
}

const SummaryScreen = ({
  questionsAnswered,
  totalQuestions,
  onRestart
}: SummaryScreenProps) => {
  const completionPercentage = Math.round((questionsAnswered / totalQuestions) * 100);
  
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-center">Practice Session Complete</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle 
                className="text-secondary stroke-current" 
                strokeWidth="10" 
                fill="transparent" 
                r="40" 
                cx="50" 
                cy="50" 
              />
              <circle 
                className="text-primary stroke-current" 
                strokeWidth="10" 
                strokeLinecap="round" 
                fill="transparent" 
                r="40" 
                cx="50" 
                cy="50" 
                strokeDasharray={`${2.51 * 40 * completionPercentage / 100} ${2.51 * 40}`}
                strokeDashoffset={0} 
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl font-bold">{completionPercentage}%</span>
              <span className="text-sm text-muted-foreground">completed</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-secondary/50 p-4 rounded-lg flex items-center gap-3">
            <BarChart className="text-primary" size={24} />
            <div>
              <h3 className="font-medium">Questions Answered</h3>
              <p className="text-2xl font-bold">{questionsAnswered} of {totalQuestions}</p>
            </div>
          </div>
          
          <div className="bg-secondary/50 p-4 rounded-lg flex items-center gap-3">
            <Award className="text-primary" size={24} />
            <div>
              <h3 className="font-medium">Achievement</h3>
              <p className="text-lg font-semibold">
                {completionPercentage >= 75 ? "Interview Ready" :
                 completionPercentage >= 50 ? "Good Progress" :
                 completionPercentage >= 25 ? "Getting Started" : "Just Began"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
          <h3 className="font-medium flex items-center gap-2">
            <Clock size={18} className="text-accent" />
            Practice Tips
          </h3>
          <ul className="mt-2 space-y-2 text-sm">
            <li>• Continue practicing regularly until your interview date</li>
            <li>• Record your answers and review them</li>
            <li>• Focus on being clear, concise, and confident</li>
            <li>• Prepare specific examples to support your answers</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onRestart} 
          className="w-full flex items-center justify-center gap-2"
        >
          <RefreshCw size={18} />
          Start New Practice Session
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SummaryScreen;
