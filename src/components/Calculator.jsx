import { useState, useEffect } from 'react';
import {
  CalculatorIcon,
  BackspaceIcon,
  EqualIcon,
  PlusIcon,
  MinusIcon,
  XIcon,
  DivideIcon,
  PercentIcon,
  MemoryIcon,
  HistoryIcon,
} from './Icons';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [memory, setMemory] = useState(0);
  const [history, setHistory] = useState([]);
  const [isCalculated, setIsCalculated] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Button configurations for wider layout
  const mainButtons = [
    // Row 1
    [
      { label: 'AC', action: 'clear', type: 'function' },
      { label: '±', action: 'plusMinus', type: 'function' },
      { label: '%', action: 'percentage', type: 'function' },
      { label: <DivideIcon />, action: '/', type: 'operator' },
    ],
    // Row 2
    [
      { label: '7', action: '7', type: 'number' },
      { label: '8', action: '8', type: 'number' },
      { label: '9', action: '9', type: 'number' },
      { label: <XIcon />, action: '*', type: 'operator' },
    ],
    // Row 3
    [
      { label: '4', action: '4', type: 'number' },
      { label: '5', action: '5', type: 'number' },
      { label: '6', action: '6', type: 'number' },
      { label: <MinusIcon />, action: '-', type: 'operator' },
    ],
    // Row 4
    [
      { label: '1', action: '1', type: 'number' },
      { label: '2', action: '2', type: 'number' },
      { label: '3', action: '3', type: 'number' },
      { label: <PlusIcon />, action: '+', type: 'operator' },
    ],
    // Row 5
    [
      { label: '0', action: '0', type: 'number', colSpan: 2 },
      { label: '.', action: '.', type: 'decimal' },
      { label: '=', action: 'calculate', type: 'equals' },
    ],
  ];

  // Side panel buttons - Fixed order and labels
  const sideButtons = [
    {
      label: 'MC',
      action: 'memoryClear',
      type: 'memory',
      icon: <MemoryIcon />,
    },
    {
      label: 'MR',
      action: 'memoryRecall',
      type: 'memory',
      icon: <MemoryIcon />,
    },
    { label: 'M+', action: 'memoryAdd', type: 'memory', icon: <MemoryIcon /> },
    {
      label: 'M-',
      action: 'memorySubtract',
      type: 'memory',
      icon: <MemoryIcon />,
    },
    { label: '⌫', action: 'delete', type: 'function', icon: <BackspaceIcon /> },
  ];

  // Memory functions
  const handleMemoryClear = () => {
    setMemory(0);
  };

  const handleMemoryRecall = () => {
    if (memory !== 0) {
      setDisplay(memory.toString());
      setIsCalculated(false);
    }
  };

  const handleMemoryAdd = () => {
    try {
      const currentValue = parseFloat(display) || 0;
      setMemory((prev) => {
        const newMemory = prev + currentValue;
        return Math.round(newMemory * 1000000) / 1000000; // Round to avoid floating point errors
      });
    } catch (error) {
      setDisplay('Error');
    }
  };

  const handleMemorySubtract = () => {
    try {
      const currentValue = parseFloat(display) || 0;
      setMemory((prev) => {
        const newMemory = prev - currentValue;
        return Math.round(newMemory * 1000000) / 1000000; // Round to avoid floating point errors
      });
    } catch (error) {
      setDisplay('Error');
    }
  };

  const handleNumberClick = (num) => {
    if (display === 'Error') {
      setDisplay(num);
      setIsCalculated(false);
      return;
    }

    if (isCalculated || display === '0') {
      setDisplay(num);
      setIsCalculated(false);
    } else if (display.length < 16) {
      setDisplay(display + num);
    }
  };

  const handleOperatorClick = (op) => {
    if (display === 'Error') return;

    if (isCalculated) {
      // If we just calculated a result, use it as the starting point
      setExpression(display + op);
      setIsCalculated(false);
    } else {
      const lastChar = expression.slice(-1);
      const operators = ['+', '-', '*', '/'];

      if (operators.includes(lastChar)) {
        // Replace the last operator
        setExpression(expression.slice(0, -1) + op);
      } else {
        // Add new expression
        setExpression(display + op);
      }
    }
    setDisplay('0');
  };

  const handleDecimalClick = () => {
    if (display === 'Error') {
      setDisplay('0.');
      return;
    }

    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setExpression('');
    setIsCalculated(false);
  };

  const handleDelete = () => {
    if (display === 'Error') {
      setDisplay('0');
      return;
    }

    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const calculateResult = () => {
    if (expression === '' || display === 'Error') return;

    try {
      const fullExpression = expression + display;
      const result = eval(fullExpression);

      if (!isFinite(result)) {
        throw new Error('Invalid calculation');
      }

      const formattedResult = parseFloat(result.toPrecision(12));
      const calculation = `${expression}${display} = ${formattedResult}`;

      setHistory((prev) => [calculation, ...prev.slice(0, 7)]);
      setDisplay(formattedResult.toString());
      setExpression('');
      setIsCalculated(true);
    } catch (error) {
      setDisplay('Error');
      setExpression('');
    }
  };

  const handlePercentage = () => {
    if (display === 'Error') {
      setDisplay('0');
      return;
    }

    try {
      const value = parseFloat(display);
      const result = value / 100;
      setDisplay(result.toString());
    } catch (error) {
      setDisplay('Error');
    }
  };

  const handlePlusMinus = () => {
    if (display === 'Error') {
      setDisplay('0');
      return;
    }

    if (display !== '0') {
      if (display.startsWith('-')) {
        setDisplay(display.slice(1));
      } else {
        setDisplay('-' + display);
      }
    }
  };

  const handleButtonClick = (action) => {
    switch (action) {
      case 'clear':
        handleClear();
        break;
      case 'delete':
        handleDelete();
        break;
      case 'calculate':
        calculateResult();
        break;
      case '.':
        handleDecimalClick();
        break;
      case 'plusMinus':
        handlePlusMinus();
        break;
      case 'percentage':
        handlePercentage();
        break;
      case 'memoryClear':
        handleMemoryClear();
        break;
      case 'memoryRecall':
        handleMemoryRecall();
        break;
      case 'memoryAdd':
        handleMemoryAdd();
        break;
      case 'memorySubtract':
        handleMemorySubtract();
        break;
      case '+':
      case '-':
      case '*':
      case '/':
        handleOperatorClick(action);
        break;
      default:
        if (/[0-9]/.test(action)) {
          handleNumberClick(action);
        }
    }
  };

  // Format display with commas
  const formatDisplay = (value) => {
    if (value === 'Error') return value;

    try {
      // Handle negative numbers
      const isNegative = value.startsWith('-');
      const numStr = isNegative ? value.slice(1) : value;

      const parts = numStr.split('.');

      // Format integer part with commas
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

      // Re-add negative sign if needed
      const formatted = isNegative ? '-' + parts.join('.') : parts.join('.');
      return formatted;
    } catch (error) {
      return value;
    }
  };

  // Format memory value
  const formatMemory = (value) => {
    if (value === 0) return 'Empty';

    try {
      const strValue = value.toString();
      const parts = strValue.split('.');

      if (parts[0].length > 8) {
        return value.toExponential(4);
      }

      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return parts.join('.');
    } catch (error) {
      return value;
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;

      // Prevent default for calculator keys
      if (
        /[0-9+\-*/.=%]/.test(key) ||
        key === 'Enter' ||
        key === 'Escape' ||
        key === 'Backspace' ||
        key === 'Delete' ||
        key === 'h' ||
        key === 'H'
      ) {
        e.preventDefault();
      }

      if (/[0-9]/.test(key)) {
        handleNumberClick(key);
      } else if (['+', '-', '*', '/'].includes(key)) {
        handleOperatorClick(key);
      } else if (key === '.' || key === ',') {
        handleDecimalClick();
      } else if (key === 'Enter' || key === '=') {
        calculateResult();
      } else if (key === 'Escape' || key === 'Delete') {
        handleClear();
      } else if (key === 'Backspace') {
        handleDelete();
      } else if (key === '%') {
        handlePercentage();
      } else if (key === 'h' || key === 'H') {
        setShowHistory(!showHistory);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display, expression, isCalculated, showHistory]);

  // Get button color class
  const getButtonClass = (type) => {
    const baseClass =
      'h-16 rounded-xl btn-press btn-hover font-medium transition-all duration-300 flex items-center justify-center text-xl ';

    switch (type) {
      case 'number':
        return (
          baseClass +
          'bg-gray-900/80 hover:bg-gray-800 text-white border border-gray-700'
        );
      case 'operator':
        return (
          baseClass +
          'bg-blue-600/80 hover:bg-blue-500 text-white border border-blue-500'
        );
      case 'function':
        return (
          baseClass +
          'bg-gray-800/80 hover:bg-gray-700 text-white border border-gray-600'
        );
      case 'equals':
        return (
          baseClass +
          'bg-green-600/80 hover:bg-green-500 text-white border border-green-500'
        );
      case 'memory':
        return (
          baseClass +
          'bg-purple-600/80 hover:bg-purple-500 text-white border border-purple-500'
        );
      case 'decimal':
        return (
          baseClass +
          'bg-gray-900/80 hover:bg-gray-800 text-white border border-gray-700'
        );
      default:
        return (
          baseClass +
          'bg-gray-900/80 hover:bg-gray-800 text-white border border-gray-700'
        );
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center p-4 relative z-10'>
      <div className='w-full max-w-5xl'>
        {/* Floating particles effect */}
        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className='absolute rounded-full bg-blue-500/10'
              style={{
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 20 + 10}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        {/* Header */}
        <div className='flex flex-col sm:flex-row items-center justify-between mb-6 gap-4'>
          <div className='flex items-center space-x-3'>
            <div className='p-3 rounded-xl glass-morphism'>
              <CalculatorIcon className='w-7 h-7 text-blue-400' />
            </div>
            <div>
              <h1 className='text-2xl sm:text-3xl font-bold text-white'>
                Modern Calculator
              </h1>
              <p className='text-gray-400 text-xs sm:text-sm'>
                Professional Grade Calculator App
              </p>
            </div>
          </div>

          <div className='flex items-center space-x-3'>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`p-3 rounded-xl glass-morphism btn-press transition-all duration-300 flex items-center gap-2 ${
                showHistory
                  ? 'bg-blue-500/20 border border-blue-500/30'
                  : 'hover:bg-white/5'
              }`}
            >
              <HistoryIcon className='w-5 h-5 text-gray-300' />
              <span className='text-gray-300 text-sm hidden sm:block'>
                {showHistory ? 'Hide History' : 'Show History'}
              </span>
            </button>
            <div className='px-3 sm:px-4 py-2 rounded-xl glass-morphism flex items-center gap-2'>
              <MemoryIcon className='w-4 h-4 text-purple-400' />
              <div className='flex flex-col'>
                <span className='text-gray-300 text-xs'>Memory</span>
                <span className='text-purple-300 font-semibold text-sm sm:text-base'>
                  {formatMemory(memory)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Calculator Container */}
        <div className='flex flex-col lg:flex-row gap-6'>
          {/* Main Calculator Area */}
          <div className='flex-1 glass-morphism rounded-2xl p-4 sm:p-6'>
            {/* Display */}
            <div className='mb-6'>
              <div className='text-gray-400 text-sm h-6 overflow-hidden truncate mb-2 px-2 font-mono'>
                {expression || ' '}
              </div>
              <div className='text-white text-3xl sm:text-4xl lg:text-5xl font-mono font-bold text-right overflow-x-auto py-4 px-4 bg-black/30 rounded-xl border border-gray-700 whitespace-nowrap min-h-[4rem] flex items-center justify-end'>
                {formatDisplay(display)}
              </div>

              {/* Display Info */}
              <div className='flex justify-between mt-3 text-xs sm:text-sm px-2'>
                <div className='text-blue-300'>
                  Memory:{' '}
                  <span className='font-mono'>{formatMemory(memory)}</span>
                </div>
                <div className='text-gray-400'>
                  Digits:{' '}
                  <span className='font-mono'>
                    {display.replace(/[^0-9.-]/g, '').length}
                  </span>
                  /16
                </div>
              </div>
            </div>

            {/* Main Keypad */}
            <div className='space-y-3'>
              {mainButtons.map((row, rowIndex) => (
                <div key={rowIndex} className='grid grid-cols-4 gap-2 sm:gap-3'>
                  {row.map((button, btnIndex) => (
                    <button
                      key={btnIndex}
                      onClick={() => handleButtonClick(button.action)}
                      className={`
                        ${button.colSpan === 2 ? 'col-span-2' : ''}
                        ${getButtonClass(button.type)}
                        ${button.type === 'equals' ? 'neon-glow-green' : ''}
                        ${button.type === 'operator' ? 'neon-glow' : ''}
                      `}
                    >
                      {button.label}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Side Panel */}
          <div className='w-full lg:w-80 flex flex-col gap-6'>
            {/* Memory Functions - FIXED STYLE */}
            <div className='glass-morphism rounded-2xl p-4'>
              <h3 className='text-gray-300 font-semibold mb-4 flex items-center gap-2 text-lg'>
                <MemoryIcon className='w-5 h-5 text-purple-400' />
                Memory Functions
              </h3>
              <div className='grid grid-cols-2 lg:grid-cols-1 gap-3'>
                {sideButtons.map((button, index) => (
                  <button
                    key={index}
                    onClick={() => handleButtonClick(button.action)}
                    className={`
                      w-full h-14 sm:h-16 rounded-xl btn-press btn-hover 
                      font-medium transition-all duration-300
                      flex items-center justify-center gap-3
                      ${
                        button.type === 'memory'
                          ? 'bg-purple-600/80 hover:bg-purple-500 text-white border border-purple-500'
                          : 'bg-gray-800/80 hover:bg-gray-700 text-white border border-gray-600'
                      }
                      text-lg
                    `}
                  >
                    <span className='opacity-90'>{button.icon}</span>
                    <span className='font-semibold'>{button.label}</span>
                  </button>
                ))}
              </div>

              {/* Memory Status */}
              <div className='mt-4 p-3 bg-black/30 rounded-lg border border-gray-700'>
                <div className='flex justify-between items-center mb-1'>
                  <span className='text-gray-400 text-sm'>Current Memory:</span>
                  <span className='text-purple-300 font-mono font-semibold'>
                    {formatMemory(memory)}
                  </span>
                </div>
                <div className='text-gray-500 text-xs'>
                  {memory === 0
                    ? 'No value stored in memory'
                    : 'Value is stored and can be recalled'}
                </div>
              </div>
            </div>

            {/* History Panel */}
            {showHistory && (
              <div className='glass-morphism rounded-2xl p-4 flex-1 flex flex-col'>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='text-gray-300 font-semibold flex items-center gap-2 text-lg'>
                    <HistoryIcon className='w-5 h-5 text-blue-400' />
                    Calculation History
                  </h3>
                  <button
                    onClick={() => setHistory([])}
                    className='text-xs px-3 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-lg transition-colors'
                    disabled={history.length === 0}
                  >
                    Clear
                  </button>
                </div>

                <div className='flex-1 overflow-y-auto pr-2'>
                  {history.length > 0 ? (
                    <div className='space-y-2'>
                      {history.map((item, index) => (
                        <div
                          key={index}
                          className='text-gray-300 text-sm bg-black/30 p-3 rounded-lg hover:bg-black/40 transition-colors font-mono'
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className='h-full flex items-center justify-center'>
                      <div className='text-gray-500 text-sm text-center p-4'>
                        <div className='mb-2'>No calculations yet</div>
                        <div className='text-xs'>
                          Perform calculations to see history here
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className='mt-4 pt-3 border-t border-gray-700 text-xs text-gray-500'>
                  <div className='flex items-center justify-between'>
                    <span>Total: {history.length} calculations</span>
                    <span>Press H to toggle</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className='mt-6 flex flex-col items-center'>
          <div className='flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-gray-400 text-xs sm:text-sm mb-2'>
            <div className='flex items-center gap-2 bg-black/30 px-3 py-1 rounded-lg'>
              <div className='w-2 h-2 rounded-full bg-green-500'></div>
              <span>= Calculate (Enter)</span>
            </div>
            <div className='flex items-center gap-2 bg-black/30 px-3 py-1 rounded-lg'>
              <div className='w-2 h-2 rounded-full bg-blue-500'></div>
              <span>Operators (+, -, *, /)</span>
            </div>
            <div className='flex items-center gap-2 bg-black/30 px-3 py-1 rounded-lg'>
              <div className='w-2 h-2 rounded-full bg-purple-500'></div>
              <span>Memory (M+, M-, MR, MC)</span>
            </div>
          </div>
          <p className='text-gray-500 text-xs text-center mt-2 px-4'>
            Use keyboard shortcuts or click buttons • Press H to toggle history
            • Esc to clear
          </p>
        </div>
      </div>

      {/* Add CSS for floating animation */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-1000px) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Calculator;
