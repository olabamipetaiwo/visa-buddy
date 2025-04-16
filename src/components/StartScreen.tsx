import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { School, Globe, Flag, BookOpen, Video, Mic } from "lucide-react";

interface StartScreenProps {
  totalQuestions: number;
  onStart: (recordingMode: "audio" | "video" | "none") => void;
}

const StartScreen = ({ totalQuestions, onStart }: StartScreenProps) => {
  const [selectedMode, setSelectedMode] = useState<"audio" | "video" | "none">(
    "none"
  );

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl">F1 Visa Interview Prep</CardTitle>
        <CardDescription>
          Practice answering common interview questions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
            <School className="w-14 h-14 text-primary" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
            <BookOpen className="text-primary" size={20} />
            <div>
              <h3 className="font-medium">Question Bank</h3>
              <p className="text-sm text-muted-foreground">
                {totalQuestions} practice questions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
            <Globe className="text-primary" size={20} />
            <div>
              <h3 className="font-medium">Academic Focus</h3>
              <p className="text-sm text-muted-foreground">
                PhD & Research topics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
            <Flag className="text-primary" size={20} />
            <div>
              <h3 className="font-medium">Timed Practice</h3>
              <p className="text-sm text-muted-foreground">
                Simulate real interview
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
            <School className="text-primary" size={20} />
            <div>
              <h3 className="font-medium">UCF Specific</h3>
              <p className="text-sm text-muted-foreground">
                Targeted university prep
              </p>
            </div>
          </div>
        </div>

        <div className="bg-primary/10 p-4 rounded-lg mt-4">
          <h3 className="font-medium text-primary">How to use this app:</h3>
          <ul className="mt-2 space-y-1 text-sm">
            <li>
              • Answer each question as if you were in the actual interview
            </li>
            <li>• Time yourself to keep responses concise and focused</li>
            <li>• Practice regularly to build confidence and fluency</li>
            <li>
              • Use the "Skip" button if you need to come back to a question
            </li>
          </ul>
        </div>

        <div className="bg-primary/10 p-4 rounded-lg mt-4">
          <h3 className="font-medium text-primary mb-2">
            Choose your practice mode:
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={selectedMode === "audio" ? "default" : "outline"}
              className="flex items-center gap-2 justify-center"
              onClick={() => setSelectedMode("audio")}
            >
              <Mic size={18} />
              <span>Audio Recording</span>
            </Button>
            <Button
              variant={selectedMode === "video" ? "default" : "outline"}
              className="flex items-center gap-2 justify-center"
              onClick={() => setSelectedMode("video")}
            >
              <Video size={18} />
              <span>Video Recording</span>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            {selectedMode === "audio" &&
              "Record audio responses to practice your verbal communication skills."}
            {selectedMode === "video" &&
              "Record video responses to practice both verbal and non-verbal communication."}
            {selectedMode === "none" && "Select a recording mode to continue."}
          </p>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          onClick={() => onStart(selectedMode)}
          size="lg"
          className="w-full"
          disabled={selectedMode === "none"}
        >
          Start Practice Session
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StartScreen;
