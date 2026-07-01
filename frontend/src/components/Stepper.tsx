import { Check } from 'lucide-react'

interface StepperProps {
  currentStep: 1 | 2 | 3
}

const STEPS = [
  { label: 'Parte 1', sub: 'Início' },
  { label: 'Parte 2', sub: 'Diagnóstico' },
  { label: 'Parte 3', sub: 'Protocolo' },
]

export function Stepper({ currentStep }: StepperProps) {
  return (
    <div className="bg-white border-b border-[#DDE6DF]">
      <div className="max-w-6xl mx-auto px-6 py-5">
        <div className="flex items-center justify-center max-w-xl mx-auto">
          {STEPS.map((step, i) => {
            const num    = i + 1
            const done   = num < currentStep
            const active = num === currentStep

            return (
              <div key={i} className="flex items-center">
                <div className="flex items-center gap-2.5">
                  {/* Círculo */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200
                      ${done   ? 'bg-[#2D6A4F]' : ''}
                      ${active ? 'bg-[#1A2E22] ring-4 ring-[#B7D5C4]/50' : ''}
                      ${!done && !active ? 'bg-[#DDE6DF]' : ''}`}
                  >
                    {done
                      ? <Check size={16} className="text-white" strokeWidth={2.5} />
                      : <span className={`text-sm font-bold ${active ? 'text-white' : 'text-[#6B7F72]'}`}>{num}</span>
                    }
                  </div>

                  {/* Labels */}
                  <div className="hidden sm:block">
                    <p className={`text-sm font-semibold ${done || active ? 'text-[#1A2E22]' : 'text-[#B7D5C4]'}`}>
                      {step.label}
                    </p>
                    <p className={`text-xs ${active ? 'text-[#2D6A4F] font-medium' : 'text-[#6B7F72]'}`}>
                      {step.sub}
                    </p>
                  </div>
                </div>

                {/* Linha entre passos */}
                {i < STEPS.length - 1 && (
                  <div className={`h-px mx-4 w-12 sm:w-20 flex-shrink-0 transition-all ${done ? 'bg-[#B7D5C4]' : 'bg-[#DDE6DF]'}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
