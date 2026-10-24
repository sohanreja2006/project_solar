import { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import './MathCaptcha.css';

/**
 * MathCaptcha – a zero-dependency math-challenge captcha.
 * Usage:
 *   const captchaRef = useRef();
 *   <MathCaptcha ref={captchaRef} onValidChange={setBool} />
 *   // Before submit: if (!captchaRef.current.validate()) return;
 */
const MathCaptcha = forwardRef(function MathCaptcha({ onValidChange, variant = 'default' }, ref) {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [op, setOp] = useState('+');
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState('idle'); // idle | correct | wrong

  const generate = useCallback(() => {
    const ops = ['+', '-', '×'];
    const newOp = ops[Math.floor(Math.random() * ops.length)];
    let newA, newB;
    if (newOp === '+') {
      newA = Math.floor(Math.random() * 15) + 1;
      newB = Math.floor(Math.random() * 15) + 1;
    } else if (newOp === '-') {
      newA = Math.floor(Math.random() * 10) + 5;
      newB = Math.floor(Math.random() * newA) + 1;
    } else {
      newA = Math.floor(Math.random() * 9) + 1;
      newB = Math.floor(Math.random() * 9) + 1;
    }
    setA(newA);
    setB(newB);
    setOp(newOp);
    setAnswer('');
    setStatus('idle');
    onValidChange?.(false);
  }, [onValidChange]);

  useEffect(() => { generate(); }, [generate]);

  const correctAnswer = op === '+' ? a + b : op === '-' ? a - b : a * b;

  const handleChange = (e) => {
    const val = e.target.value.replace(/[^0-9-]/g, '');
    setAnswer(val);
    if (val === '') {
      setStatus('idle');
      onValidChange?.(false);
      return;
    }
    if (parseInt(val, 10) === correctAnswer) {
      setStatus('correct');
      onValidChange?.(true);
    } else {
      setStatus('wrong');
      onValidChange?.(false);
    }
  };

  // Exposed to parent via ref
  useImperativeHandle(ref, () => ({
    validate() {
      if (parseInt(answer, 10) !== correctAnswer) {
        setStatus('wrong');
        onValidChange?.(false);
        return false;
      }
      return true;
    },
    reset() { generate(); },
  }));

  return (
    <div className={`captcha captcha--${variant}`} role="group" aria-label="Math CAPTCHA verification">
      <div className="captcha__label">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        <span>Human Verification</span>
      </div>
      <div className="captcha__row">
        <div className="captcha__challenge" aria-label={`Solve: ${a} ${op} ${b}`}>
          <span className="captcha__num">{a}</span>
          <span className="captcha__op">{op}</span>
          <span className="captcha__num">{b}</span>
          <span className="captcha__eq">=</span>
        </div>
        <input
          className={`captcha__input${status === 'correct' ? ' captcha__input--ok' : status === 'wrong' ? ' captcha__input--err' : ''}`}
          type="text"
          inputMode="numeric"
          value={answer}
          onChange={handleChange}
          placeholder="?"
          maxLength={4}
          autoComplete="off"
          aria-label="Answer to math problem"
        />
        <button
          type="button"
          className="captcha__refresh"
          onClick={generate}
          title="Get a new question"
          aria-label="Refresh captcha"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
          </svg>
        </button>
      </div>
      {status === 'correct' && (
        <p className="captcha__msg captcha__msg--ok">✓ Verified — you're human!</p>
      )}
      {status === 'wrong' && answer !== '' && (
        <p className="captcha__msg captcha__msg--err">✗ Incorrect — try again or refresh</p>
      )}
    </div>
  );
});

export default MathCaptcha;
