"use client";

import Image from "next/image";
import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { isQuestionVisible, questions } from "@/data/questions";
import type { AnswerValue, Answers, Question } from "@/types/questionnaire";

const STORAGE_KEY = "promoters-erickson-questionnaire-v1";

type SavedState = {
  answers: Answers;
  currentQuestionId?: string;
};

function hasValue(value: AnswerValue | undefined) {
  if (Array.isArray(value)) return value.length > 0;
  return Boolean(value?.trim());
}

function QuestionInput({
  question,
  value,
  onChange,
  onEnter
}: {
  question: Question;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
  onEnter: () => void;
}) {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => inputRef.current?.focus(), 120);
    return () => window.clearTimeout(timeout);
  }, [question.id]);

  if (question.type === "single") {
    return (
      <div className="option-list" role="radiogroup" aria-label={question.title}>
        {question.options?.map((option, index) => {
          const selected = value === option;
          return (
            <button
              className={`option-card ${selected ? "selected" : ""}`}
              type="button"
              role="radio"
              aria-checked={selected}
              key={option}
              onClick={() => onChange(option)}
            >
              <span className="option-key">{String.fromCharCode(65 + index)}</span>
              <span>{option}</span>
              <span className="selection-dot" aria-hidden="true" />
            </button>
          );
        })}
      </div>
    );
  }

  if (question.type === "multi") {
    const selectedValues = Array.isArray(value) ? value : [];
    return (
      <div className="option-list" aria-label={question.title}>
        {question.options?.map((option, index) => {
          const selected = selectedValues.includes(option);
          const atLimit = Boolean(
            question.maxSelections && selectedValues.length >= question.maxSelections && !selected
          );

          return (
            <button
              className={`option-card ${selected ? "selected" : ""}`}
              type="button"
              aria-pressed={selected}
              disabled={atLimit}
              key={option}
              onClick={() => {
                const next = selected
                  ? selectedValues.filter((item) => item !== option)
                  : [...selectedValues, option];
                onChange(next);
              }}
            >
              <span className="option-key">{String.fromCharCode(65 + index)}</span>
              <span>{option}</span>
              <span className="checkmark" aria-hidden="true">✓</span>
            </button>
          );
        })}
      </div>
    );
  }

  const commonProps = {
    value: typeof value === "string" ? value : "",
    placeholder: question.placeholder,
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(event.target.value)
  };

  if (question.type === "textarea") {
    return (
      <textarea
        ref={(node) => {
          inputRef.current = node;
        }}
        className="text-input textarea-input"
        rows={6}
        {...commonProps}
      />
    );
  }

  return (
    <input
      ref={(node) => {
        inputRef.current = node;
      }}
      className="text-input"
      type={question.type === "number" ? "number" : question.type === "date" ? "date" : question.type === "url" ? "url" : "text"}
      min={question.type === "number" ? 0 : undefined}
      onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
          event.preventDefault();
          onEnter();
        }
      }}
      {...commonProps}
    />
  );
}

export default function Questionnaire() {
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Answers>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  const visibleQuestions = useMemo(
    () => questions.filter((question) => isQuestionVisible(question, answers)),
    [answers]
  );

  const safeIndex = Math.min(currentIndex, Math.max(visibleQuestions.length - 1, 0));
  const currentQuestion = visibleQuestions[safeIndex];

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as SavedState;
        setAnswers(parsed.answers ?? {});
        if (parsed.currentQuestionId) {
          const visible = questions.filter((question) => isQuestionVisible(question, parsed.answers ?? {}));
          const savedIndex = visible.findIndex((question) => question.id === parsed.currentQuestionId);
          if (savedIndex >= 0) {
            setCurrentIndex(savedIndex);
            setStarted(true);
          }
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated || submitted || !started) return;
    const state: SavedState = {
      answers,
      currentQuestionId: currentQuestion?.id
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [answers, currentQuestion?.id, hydrated, submitted, started]);

  useEffect(() => {
    if (currentIndex > visibleQuestions.length - 1) {
      setCurrentIndex(Math.max(visibleQuestions.length - 1, 0));
    }
  }, [currentIndex, visibleQuestions.length]);

  function updateAnswer(value: AnswerValue) {
    if (!currentQuestion) return;
    setAnswers((previous) => ({ ...previous, [currentQuestion.id]: value }));
    setError("");
  }

  function validateCurrent() {
    if (!currentQuestion) return false;
    const value = answers[currentQuestion.id];
    if (currentQuestion.required && !hasValue(value)) {
      setError("Χρειαζόμαστε αυτή την απάντηση για να συνεχίσουμε.");
      return false;
    }
    return true;
  }

  function goNext() {
    if (!validateCurrent()) return;
    if (safeIndex < visibleQuestions.length - 1) {
      setCurrentIndex(safeIndex + 1);
      setError("");
    }
  }

  function goBack() {
    setCurrentIndex(Math.max(safeIndex - 1, 0));
    setError("");
  }

  async function submitForm(event?: FormEvent) {
    event?.preventDefault();
    if (!validateCurrent()) return;

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, website: honeypot })
      });

      const result = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Δεν ήταν δυνατή η αποστολή.");
      }

      localStorage.removeItem(STORAGE_KEY);
      setSubmitted(true);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Παρουσιάστηκε ένα πρόβλημα κατά την αποστολή. Δοκιμάστε ξανά."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!hydrated) {
    return <main className="shell" aria-busy="true" />;
  }

  if (submitted) {
    return (
      <main className="shell">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />
        <section className="card success-card">
          <Image
            className="logo"
            src="/promoters-logo.svg"
            alt="Promoters Digital Marketing 360°"
            width={260}
            height={87}
            priority
          />
          <div className="success-icon" aria-hidden="true">✓</div>
          <p className="eyebrow">Ολοκληρώθηκε</p>
          <h1>Ευχαριστούμε, Μαρία.</h1>
          <p className="lead-copy">
            Έχουμε πλέον τις πληροφορίες που χρειαζόμαστε για να μελετήσουμε το πρόγραμμα και να
            σχεδιάσουμε την πρότασή μας.
          </p>
          <p className="muted-copy">
            Θα εξετάσουμε τις απαντήσεις μαζί με την υπάρχουσα ψηφιακή παρουσία του Erickson Coaching
            Greece και θα επανέλθουμε με συγκεκριμένη κατεύθυνση.
          </p>
        </section>
      </main>
    );
  }

  if (!started) {
    return (
      <main className="shell">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />
        <section className="card intro-card">
          <Image
            className="logo"
            src="/promoters-logo.svg"
            alt="Promoters Digital Marketing 360°"
            width={280}
            height={93}
            priority
          />
          <div className="intro-content">
            <p className="eyebrow">Campaign brief · Erickson Coaching Greece</p>
            <h1>Ας γνωρίσουμε καλύτερα το πρόγραμμα.</h1>
            <p className="lead-copy">
              Οι παρακάτω ερωτήσεις θα μας βοηθήσουν να καταλάβουμε τον στόχο, το κοινό και τη σημερινή
              διαδρομή των leads, ώστε η πρότασή μας να βασιστεί στα πραγματικά δεδομένα του προγράμματος.
            </p>
            <div className="intro-meta">
              <span>Περίπου 8–10 λεπτά</span>
              <span>Οι απαντήσεις αποθηκεύονται προσωρινά στη συσκευή σας</span>
            </div>
            <button className="primary-button large" type="button" onClick={() => setStarted(true)}>
              Ξεκινάμε
              <span aria-hidden="true">→</span>
            </button>
          </div>
          <p className="privacy-note">
            Οι απαντήσεις αποστέλλονται απευθείας στην Promoters όταν ολοκληρώσετε τη φόρμα.
          </p>
        </section>
      </main>
    );
  }

  if (!currentQuestion) return null;

  const isLast = safeIndex === visibleQuestions.length - 1;
  const progress = ((safeIndex + 1) / visibleQuestions.length) * 100;

  return (
    <main className="shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <section className="card questionnaire-card">
        <header className="topbar">
          <Image
            className="logo compact"
            src="/promoters-logo.svg"
            alt="Promoters Digital Marketing 360°"
            width={205}
            height={68}
            priority
          />
          <span className="step-counter">{safeIndex + 1} / {visibleQuestions.length}</span>
        </header>

        <div className="progress-track" aria-hidden="true">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <form className="question-area" onSubmit={isLast ? submitForm : (event) => { event.preventDefault(); goNext(); }}>
          <div key={currentQuestion.id} className="question-enter">
            <p className="section-label">{currentQuestion.section}</p>
            <h2>{currentQuestion.title}</h2>
            {currentQuestion.description && <p className="question-description">{currentQuestion.description}</p>}

            <div className="answer-area">
              <QuestionInput
                question={currentQuestion}
                value={answers[currentQuestion.id]}
                onChange={updateAnswer}
                onEnter={() => {
                  if (isLast) void submitForm();
                  else goNext();
                }}
              />
            </div>

            <input
              className="honeypot"
              type="text"
              name="website"
              value={honeypot}
              onChange={(event) => setHoneypot(event.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            <div className="feedback-row" aria-live="polite">
              {error ? <p className="error-message">{error}</p> : <span />}
              {currentQuestion.maxSelections && (
                <span className="selection-count">
                  {Array.isArray(answers[currentQuestion.id]) ? answers[currentQuestion.id].length : 0} / {currentQuestion.maxSelections}
                </span>
              )}
            </div>

            <div className="navigation-row">
              <button className="secondary-button" type="button" onClick={goBack} disabled={safeIndex === 0}>
                <span aria-hidden="true">←</span>
                Πίσω
              </button>

              <button className="primary-button" type="submit" disabled={submitting}>
                {submitting ? "Αποστολή…" : isLast ? "Αποστολή απαντήσεων" : "Συνέχεια"}
                {!submitting && <span aria-hidden="true">→</span>}
              </button>
            </div>
          </div>
        </form>

        <footer className="form-footer">
          <span>Erickson Coaching Greece</span>
          <span>Promoters · Digital Marketing 360°</span>
        </footer>
      </section>
    </main>
  );
}
