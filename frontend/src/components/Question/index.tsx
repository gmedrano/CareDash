import React, { useState } from 'react';
import './question.css';

// Define question types
type QuestionType = 
  | 'MULTI_SELECT'
  | 'SINGLE_SELECT'
  | 'YES_NO'
  | 'TEXT_INPUT'
  | 'NUMERIC_INPUT'
  | 'DATE_INPUT'
  | 'LIKERT_SCALE'
  | 'MATRIX'
  | 'RANKING'
  | 'SLIDER';

// Define base question interface
interface BaseQuestion {
  id: string;
  text: string;
  type: QuestionType;
}

// Define specific question interfaces
interface MultiSelectQuestion extends BaseQuestion {
  type: 'MULTI_SELECT';
  options: string[];
}

interface SingleSelectQuestion extends BaseQuestion {
  type: 'SINGLE_SELECT';
  options: string[];
}

interface YesNoQuestion extends BaseQuestion {
  type: 'YES_NO';
}

interface TextInputQuestion extends BaseQuestion {
  type: 'TEXT_INPUT';
}

interface NumericInputQuestion extends BaseQuestion {
  type: 'NUMERIC_INPUT';
  range?: { min: number; max: number };
  unit?: string;
}

interface DateInputQuestion extends BaseQuestion {
  type: 'DATE_INPUT';
}

interface LikertScaleQuestion extends BaseQuestion {
  type: 'LIKERT_SCALE';
  options: string[];
}

interface MatrixQuestion extends BaseQuestion {
  type: 'MATRIX';
  matrix: {
    rows: string[];
    columns: string[];
  };
}

interface RankingQuestion extends BaseQuestion {
  type: 'RANKING';
  options: string[];
}

interface SliderQuestion extends BaseQuestion {
  type: 'SLIDER';
  range: { min: number; max: number; step: number };
  labels?: { min: string; max: string };
}

type Question =
  | MultiSelectQuestion
  | SingleSelectQuestion
  | YesNoQuestion
  | TextInputQuestion
  | NumericInputQuestion
  | DateInputQuestion
  | LikertScaleQuestion
  | MatrixQuestion
  | RankingQuestion
  | SliderQuestion;

// Define answer types
type Answer = string | string[] | number | { [key: string]: string | number };

// Helper component for submit button
const SubmitButton: React.FC<{ onSubmit: () => void, style?: React.CSSProperties }> = ({ onSubmit, style }) => (
  <button className="submit-btn" onClick={onSubmit} style={style}>
    Submit
  </button>
);

// Question components
const MultiSelect: React.FC<{ question: MultiSelectQuestion; onAnswer: (id: string, answer: string[]) => void }> = ({ question, onAnswer }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [displaySubmit, setDisplaySubmit] = useState(true);
  const handleSelect = (option: string) => {
    setSelectedOptions(prev => 
      prev.includes(option) ? prev.filter(item => item !== option) : [...prev, option]
    );
  };

  const handleSubmit = () => {
    onAnswer(question.id, selectedOptions);
    setDisplaySubmit(false);
  };
  const options = [...question.options, "None of the above"]
  return (
    <div className="question multi-select">
      <div className="options">
        {options.map((option, index) => (
          <button
            key={index}
            className={`option-btn ${selectedOptions.includes(option) ? 'selected' : ''}`}
            onClick={() => handleSelect(option)}
            disabled={displaySubmit==false}
          >
            {option}
          </button>
        ))}
      </div>
      <SubmitButton onSubmit={handleSubmit} style={{display: displaySubmit ? 'block' : 'none'}} />
    </div>
  );
};

const SingleSelect: React.FC<{ question: SingleSelectQuestion; onAnswer: (id: string, answer: string) => void }> = ({ question, onAnswer }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [displaySubmit, setDisplaySubmit] = useState(true);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (selectedOption) {
      onAnswer(question.id, selectedOption);
      setDisplaySubmit(false);
    }
  };

  return (
    <div className="question single-select">
      <div className="options">
        {question.options.map((option, index) => (
          <button
            key={index}
            className={`option-btn ${selectedOption === option ? 'selected' : ''}`}
            onClick={() => handleSelect(option)}
            disabled={displaySubmit==false}
          >
            {option}
          </button>
        ))}
      </div>
      <SubmitButton onSubmit={handleSubmit} style={{display: displaySubmit ? 'block' : 'none'}} />
    </div>
  );
};

const YesNo: React.FC<{ question: YesNoQuestion; onAnswer: (id: string, answer: string) => void }> = ({ question, onAnswer }) => {
  const handleSelect = (answer: 'Yes' | 'No') => {
    onAnswer(question.id, answer);
  };

  return (
    <div className="question yes-no">
      <div className="options">
        <button className="option-btn" onClick={() => handleSelect('Yes')}>Yes</button>
        <button className="option-btn" onClick={() => handleSelect('No')}>No</button>
      </div>
    </div>
  );
};

const TextInput: React.FC<{ question: TextInputQuestion; onAnswer: (id: string, answer: string) => void }> = ({ question, onAnswer }) => {
  console.log(question, onAnswer)
  return (
    <>
    {''}
    </>
  );
};

const NumericInput: React.FC<{ question: NumericInputQuestion; onAnswer: (id: string, answer: number) => void }> = ({ question, onAnswer }) => {
  console.log(question, onAnswer)
  return (
    <>
    {''}
    </>
  );
};

const DateInput: React.FC<{ question: DateInputQuestion; onAnswer: (id: string, answer: string) => void }> = ({ question, onAnswer }) => {
  const [answer, setAnswer] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value);
  };

  const handleSubmit = () => {
    onAnswer(question.id, answer);
  };

  return (
    <div className="question date-input">
      <input
        type="date"
        value={answer}
        onChange={handleChange}
      />
      <SubmitButton onSubmit={handleSubmit} />
    </div>
  );
};

const LikertScale: React.FC<{ question: LikertScaleQuestion; onAnswer: (id: string, answer: string) => void }> = ({ question, onAnswer }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (selectedOption) {
      onAnswer(question.id, selectedOption);
    }
  };

  return (
    <div className="question likert-scale">
      <p>{question.text}</p>
      <div className="options">
        {question.options.map((option, index) => (
          <button
            key={index}
            className={`option-btn ${selectedOption === option ? 'selected' : ''}`}
            onClick={() => handleSelect(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <SubmitButton onSubmit={handleSubmit} />
    </div>
  );
};

const Matrix: React.FC<{ question: MatrixQuestion; onAnswer: (id: string, answer: { [key: string]: string }) => void }> = ({ question, onAnswer }) => {
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});

  const handleSelect = (row: string, col: string) => {
    setAnswers(prev => ({ ...prev, [row]: col }));
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length === question.matrix.rows.length) {
      onAnswer(question.id, answers);
    }
  };

  return (
    <div className="question matrix">
      <p>{question.text}</p>
      <table>
        <thead>
          <tr>
            <th></th>
            {question.matrix.columns.map((col, index) => (
              <th key={index}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {question.matrix.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td>{row}</td>
              {question.matrix.columns.map((col, colIndex) => (
                <td key={colIndex}>
                  <button
                    className={`option-btn ${answers[row] === col ? 'selected' : ''}`}
                    onClick={() => handleSelect(row, col)}
                  >
                    {col}
                  </button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <SubmitButton onSubmit={handleSubmit} />
    </div>
  );
};

const Ranking: React.FC<{ question: RankingQuestion; onAnswer: (id: string, answer: { [key: string]: number }) => void }> = ({ question, onAnswer }) => {
  const [rankings, setRankings] = useState<{ [key: string]: number }>({});

  const handleRankingChange = (option: string, rank: string) => {
    const numericRank = parseInt(rank, 10);
    if (!isNaN(numericRank)) {
      setRankings(prev => ({ ...prev, [option]: numericRank }));
    }
  };

  const handleSubmit = () => {
    if (Object.keys(rankings).length === question.options.length) {
      onAnswer(question.id, rankings);
    }
  };

  return (
    <div className="question ranking">
      <p>{question.text}</p>
      <div className="rank-items">
        {question.options.map((option, index) => (
          <div key={index} className="rank-item">
            <span>{option}</span>
            <input
              type="number"
              min={1}
              max={question.options.length}
              value={rankings[option] || ''}
              onChange={(e) => handleRankingChange(option, e.target.value)}
            />
          </div>
        ))}
      </div>
      <SubmitButton onSubmit={handleSubmit} />
    </div>
  );
};

const Slider: React.FC<{ question: SliderQuestion; onAnswer: (id: string, answer: number) => void }> = ({ question, onAnswer }) => {
  const [answer, setAnswer] = useState(question.range.min);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(parseFloat(e.target.value));
  };

  const handleSubmit = () => {
    onAnswer(question.id, answer);
  };

  return (
    <div className="question slider">
      <p>{question.text}</p>
      <input
        type="range"
        min={question.range.min}
        max={question.range.max}
        step={question.range.step}
        value={answer}
        onChange={handleChange}
      />
      <span className="slider-value">{answer}</span>
      {question.labels && (
        <div className="slider-labels">
          <span>{question.labels.min}</span>
          <span>{question.labels.max}</span>
        </div>
      )}
      <SubmitButton onSubmit={handleSubmit} />
    </div>
  );
};

// Main Question component
const Question: React.FC<{ question: Question; onAnswer: (id: string, answer: Answer) => void }> = ({ question, onAnswer }) => {
  const componentMap: { [K in QuestionType]: React.FC<any> } = {
    MULTI_SELECT: MultiSelect,
    SINGLE_SELECT: SingleSelect,
    YES_NO: YesNo,
    TEXT_INPUT: TextInput,
    NUMERIC_INPUT: NumericInput,
    DATE_INPUT: DateInput,
    LIKERT_SCALE: LikertScale,
    MATRIX: Matrix,
    RANKING: Ranking,
    SLIDER: Slider
  };

  const QuestionComponent = componentMap[question.type];

  if (!QuestionComponent) {
    console.warn(`Unsupported question type: ${question.type}`);
    return <div className="question-error">Unsupported question type.</div>;
  }

  return <QuestionComponent question={question} onAnswer={onAnswer} />;
};

export default Question;