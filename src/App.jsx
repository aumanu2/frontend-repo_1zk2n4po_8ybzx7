import { useState } from 'react'

function App() {
  const [current, setCurrent] = useState('0')
  const [previous, setPrevious] = useState(null)
  const [operator, setOperator] = useState(null)
  const [justEvaluated, setJustEvaluated] = useState(false)

  const inputDigit = (d) => {
    setCurrent((cur) => {
      if (justEvaluated) {
        setJustEvaluated(false)
        return d
      }
      if (cur === '0') return d
      return cur + d
    })
  }

  const inputDot = () => {
    setCurrent((cur) => {
      if (justEvaluated) {
        setJustEvaluated(false)
        return '0.'
      }
      if (cur.includes('.')) return cur
      return cur + '.'
    })
  }

  const clearAll = () => {
    setCurrent('0')
    setPrevious(null)
    setOperator(null)
    setJustEvaluated(false)
  }

  const backspace = () => {
    setCurrent((cur) => {
      if (justEvaluated) {
        setJustEvaluated(false)
        return '0'
      }
      if (cur.length <= 1) return '0'
      return cur.slice(0, -1)
    })
  }

  const toggleSign = () => {
    setCurrent((cur) => (cur.startsWith('-') ? cur.slice(1) : cur === '0' ? '0' : '-' + cur))
  }

  const percent = () => {
    setCurrent((cur) => {
      const num = parseFloat(cur)
      if (Number.isNaN(num)) return '0'
      return (num / 100).toString()
    })
  }

  const chooseOperator = (op) => {
    if (operator && previous !== null && !justEvaluated) {
      // Chain operations
      const result = compute(previous, current, operator)
      setPrevious(result)
      setCurrent('0')
      setOperator(op)
    } else {
      setPrevious(current)
      setCurrent('0')
      setOperator(op)
      setJustEvaluated(false)
    }
  }

  const equals = () => {
    if (previous === null || operator === null) return
    const result = compute(previous, current, operator)
    setCurrent(result)
    setPrevious(null)
    setOperator(null)
    setJustEvaluated(true)
  }

  const compute = (aStr, bStr, op) => {
    const a = parseFloat(aStr)
    const b = parseFloat(bStr)
    if (Number.isNaN(a) || Number.isNaN(b)) return '0'
    let res = 0
    switch (op) {
      case '+':
        res = a + b
        break
      case '-':
        res = a - b
        break
      case '×':
        res = a * b
        break
      case '÷':
        res = b === 0 ? NaN : a / b
        break
      default:
        res = b
    }
    // Avoid long floating errors
    const fixed = Number.isFinite(res) ? parseFloat(res.toFixed(10)) : res
    return Number.isFinite(fixed) ? fixed.toString() : 'Error'
  }

  const display = () => {
    // Show current input; if just evaluated, show it as-is
    return current
  }

  const Button = ({ children, onClick, className = '' }) => (
    <button
      onClick={onClick}
      className={`select-none rounded-xl text-lg sm:text-xl font-semibold py-3 sm:py-4 transition-colors active:scale-[0.98] ${className}`}
    >
      {children}
    </button>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm sm:max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/60">
        <div className="p-5 sm:p-6 border-b border-gray-100">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Calculator</h1>
          <p className="text-gray-500 text-sm">Basic operations with a clean interface</p>
        </div>

        <div className="p-5 sm:p-6">
          <div className="mb-4 sm:mb-6 bg-gray-900 text-white rounded-xl p-4 sm:p-5 text-right overflow-hidden">
            <div className="text-xs text-gray-400 h-5">
              {previous !== null && operator ? `${previous} ${operator}` : '\u00A0'}
            </div>
            <div className="text-3xl sm:text-5xl font-bold tracking-tight break-words min-h-[2.5rem]">
              {display()}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            <Button className="bg-gray-100 hover:bg-gray-200 text-gray-800" onClick={clearAll}>AC</Button>
            <Button className="bg-gray-100 hover:bg-gray-200 text-gray-800" onClick={toggleSign}>±</Button>
            <Button className="bg-gray-100 hover:bg-gray-200 text-gray-800" onClick={percent}>%</Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => chooseOperator('÷')}>÷</Button>

            <Button className="bg-gray-50 hover:bg-gray-100" onClick={() => inputDigit('7')}>7</Button>
            <Button className="bg-gray-50 hover:bg-gray-100" onClick={() => inputDigit('8')}>8</Button>
            <Button className="bg-gray-50 hover:bg-gray-100" onClick={() => inputDigit('9')}>9</Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => chooseOperator('×')}>×</Button>

            <Button className="bg-gray-50 hover:bg-gray-100" onClick={() => inputDigit('4')}>4</Button>
            <Button className="bg-gray-50 hover:bg-gray-100" onClick={() => inputDigit('5')}>5</Button>
            <Button className="bg-gray-50 hover:bg-gray-100" onClick={() => inputDigit('6')}>6</Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => chooseOperator('-')}>-</Button>

            <Button className="bg-gray-50 hover:bg-gray-100" onClick={() => inputDigit('1')}>1</Button>
            <Button className="bg-gray-50 hover:bg-gray-100" onClick={() => inputDigit('2')}>2</Button>
            <Button className="bg-gray-50 hover:bg-gray-100" onClick={() => inputDigit('3')}>3</Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => chooseOperator('+')}>+</Button>

            <Button className="col-span-2 bg-gray-50 hover:bg-gray-100" onClick={() => inputDigit('0')}>0</Button>
            <Button className="bg-gray-50 hover:bg-gray-100" onClick={inputDot}>.</Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={equals}>=</Button>

            <Button className="col-span-4 bg-gray-100 hover:bg-gray-200 text-gray-800" onClick={backspace}>⌫</Button>
          </div>

          <div className="mt-4 text-center">
            <a href="/test" className="text-sm text-blue-600 hover:underline">Backend/DB test page</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
