import { Check } from "lucide-react";

type Step = {
  id: number;
  title: string;
  description: string;
};

type StepProgressProps = {
  steps: Step[];
  currentStep: number;
};

export const StepProgress = ({ steps, currentStep }: StepProgressProps) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-colors
                    ${isCompleted 
                      ? 'bg-step-complete border-step-complete text-white' 
                      : isActive 
                        ? 'bg-step-active border-step-active text-white' 
                        : 'bg-background border-step-inactive text-step-inactive'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step.id
                  )}
                </div>
                <div className="mt-2 text-center">
                  <div className={`text-sm font-medium ${isActive ? 'text-step-active' : isCompleted ? 'text-step-complete' : 'text-step-inactive'}`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 max-w-24">
                    {step.description}
                  </div>
                </div>
              </div>
              
              {!isLast && (
                <div 
                  className={`
                    flex-1 h-0.5 mx-4 transition-colors
                    ${step.id < currentStep ? 'bg-step-complete' : 'bg-border'}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};