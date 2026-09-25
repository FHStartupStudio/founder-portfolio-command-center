import { useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowRight, ArrowUpRight, ChevronDown, CornerDownLeft, FileText, LockKeyhole, MessageSquareText, Search, ShieldCheck, TriangleAlert } from 'lucide-react';
import { Link } from 'wouter';
import { useAskPortfolioAssistant } from '@workspace/api-client-react';
import type { PortfolioAssistantAnswer, PortfolioAssistantProjectResult } from '@workspace/api-client-react';
import { usePortfolioContext } from '@/lib/portfolio-context';
import { StatusPill } from '@/components/portfolio-ui';

const starterGroups = [
  {
    label: 'Portfolio pulse',
    questions: [
      'What needs my attention?',
      'Which projects are waiting on a gate?',
      'Which projects have not had recent activity?',
      'Which projects are blocked by an external dependency?',
    ],
  },
  {
    label: 'Readiness & delivery',
    questions: [
      'Which projects are ready for closed beta?',
      'Which projects need physical-device testing?',
      'Which projects are currently in validation?',
      'Which Directory Factory projects are launch-ready?',
    ],
  },
  {
    label: 'Specifics',
    questions: [
      'Which projects are blocked by Supabase?',
      'What is CATch waiting on?',
      'What is the next action for Nayl?',
      'Show me all ELT projects in active implementation or validation.',
    ],
  },
];

function ProjectResult({ project }: { project: PortfolioAssistantProjectResult }) {
  return (
    <div className="border-b border-border last:border-b-0 px-4 py-4 sm:px-5" data-testid={`card-assistant-project-${project.projectId}`}>
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div className="min-w-0">
          <Link href={`/projects/${encodeURIComponent(project.projectId)}`} className="focus-ring group inline-flex items-center gap-1.5 text-sm font-extrabold tracking-tight hover:text-primary" data-testid={`link-assistant-project-${project.projectId}`}>
            <span>{project.project}</span><ArrowUpRight size={14} className="shrink-0 text-muted-foreground group-hover:text-primary" />
          </Link>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-muted-foreground">
            <span className="font-mono-ui">{project.projectId}</span>
            {project.portfolioFamily && <><span aria-hidden="true">·</span><span>{project.portfolioFamily}</span></>}
            {project.tagsSecondaryFamilies && <><span aria-hidden="true">·</span><span>Tags: {project.tagsSecondaryFamilies}</span></>}
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5"><StatusPill value={project.lifecycleStage} stage /><StatusPill value={project.status} /></div>
      </div>
      <dl className="mt-3 grid gap-x-5 gap-y-2 text-xs sm:grid-cols-2">
        {project.currentGate && <div><dt className="eyebrow text-muted-foreground">Current gate</dt><dd className="mt-1 leading-5 text-foreground/85" data-testid={`text-assistant-gate-${project.projectId}`}>{project.currentGate}</dd></div>}
        {project.blocker && <div><dt className="eyebrow text-muted-foreground">Blocker</dt><dd className="mt-1 leading-5 text-foreground/85" data-testid={`text-assistant-blocker-${project.projectId}`}>{project.blocker}</dd></div>}
        {project.exactNextAction && <div className="sm:col-span-2"><dt className="eyebrow text-muted-foreground">Exact next action</dt><dd className="mt-1 leading-5 text-foreground/85" data-testid={`text-assistant-next-action-${project.projectId}`}>{project.exactNextAction}</dd></div>}
      </dl>
    </div>
  );
}

function AnswerPanel({ answer, question }: { answer: PortfolioAssistantAnswer; question: string }) {
  const basisLabel = answer.basis === 'EXPLICIT SHEET DATA' ? 'Explicit Sheet data' : 'Derived from Sheet data';
  return (
    <section className="space-y-4" aria-label="Assistant answer" data-testid="section-assistant-answer">
      <div className="panel overflow-hidden rounded-xl">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3 sm:px-5">
          <span className="eyebrow text-muted-foreground">Answer</span>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary" data-testid="status-assistant-basis">{basisLabel}</span>
            <span className="rounded-full border border-border bg-secondary/60 px-2.5 py-1 text-[10px] font-semibold text-muted-foreground" data-testid="status-assistant-interpretation">{answer.usedAiInterpretation ? 'AI interpretation used' : 'No AI interpretation'}</span>
          </div>
        </div>
        <div className="px-4 py-5 sm:px-5">
          <p className="eyebrow mb-2 text-muted-foreground">You asked · {question}</p>
          <p className="whitespace-pre-line text-[13px] font-medium leading-6 text-foreground" data-testid="text-assistant-answer">{answer.answer}</p>
        </div>
        <details className="group border-t border-border" data-testid="details-assistant-evidence">
          <summary className="focus-ring flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-xs font-bold text-muted-foreground transition-colors hover:bg-secondary/30 hover:text-foreground [&::-webkit-details-marker]:hidden sm:px-5" data-testid="button-assistant-evidence">
            <span className="inline-flex items-center gap-2"><FileText size={14} />Why this answer?</span>
            <ChevronDown size={14} className="transition-transform group-open:rotate-180" />
          </summary>
          <div className="border-t border-border px-4 py-3 sm:px-5">
            {answer.evidence.length ? (
              <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
                {answer.evidence.map((item, index) => (
                  <div key={`${item.label}-${index}`} data-testid={`row-assistant-evidence-${index}`}>
                    <dt className="eyebrow text-muted-foreground">{item.label}</dt>
                    <dd className="mt-1 break-words text-xs leading-5 text-foreground/85">{item.value || 'Not recorded'}</dd>
                  </div>
                ))}
              </dl>
            ) : <p className="text-xs text-muted-foreground" data-testid="text-assistant-no-evidence">No supporting source fields were returned for this answer.</p>}
          </div>
        </details>
      </div>
      <section aria-label="Matching projects" data-testid="section-assistant-projects">
        <div className="mb-3 flex items-baseline justify-between gap-2">
          <h2 className="text-sm font-extrabold tracking-tight">Matching projects</h2>
          <span className="font-mono-ui text-[11px] text-muted-foreground" data-testid="text-assistant-project-count">{answer.projects.length} {answer.projects.length === 1 ? 'project' : 'projects'}</span>
        </div>
        {answer.projects.length ? (
          <div className="panel overflow-hidden rounded-xl">{answer.projects.map((project) => <ProjectResult key={project.projectId} project={project} />)}</div>
        ) : (
          <div className="rounded-xl border border-border bg-card/60 px-4 py-5 text-xs leading-5 text-muted-foreground" data-testid="text-assistant-no-projects">No project records were identified for this question. The answer above may refer to portfolio-level information or available evidence.</div>
        )}
      </section>
    </section>
  );
}

export default function Assistant() {
  const { snapshot } = usePortfolioContext();
  const assistant = useAskPortfolioAssistant();
  const [question, setQuestion] = useState('');
  const [submittedQuestion, setSubmittedQuestion] = useState('');
  const [answer, setAnswer] = useState<PortfolioAssistantAnswer | null>(null);
  const [inputError, setInputError] = useState('');
  const [requestError, setRequestError] = useState(false);

  async function ask(rawQuestion: string) {
    const nextQuestion = rawQuestion.trim();
    if (!nextQuestion) { setInputError('Enter a question to ask the portfolio.'); return; }
    if (nextQuestion.length > 2000) { setInputError('Keep your question under 2,000 characters.'); return; }
    if (assistant.isPending) return;
    setInputError('');
    setRequestError(false);
    setAnswer(null);
    setSubmittedQuestion(nextQuestion);
    try {
      const result = await assistant.mutateAsync({ data: { question: nextQuestion } });
      setAnswer(result);
    } catch {
      setRequestError(true);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void ask(question);
  }

  function chooseQuestion(value: string) {
    setQuestion(value);
    void ask(value);
  }

  return (
    <div className="stagger-in max-w-[1240px]">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow text-primary">Workspace / Read-only</p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl" data-testid="text-assistant-title">Scout</h1>
          <p className="mt-1 text-sm font-semibold text-foreground/75">Founder Portfolio Assistant</p>
          <p className="mt-2 max-w-2xl text-xs leading-5 text-muted-foreground">Ask about gates, blockers, readiness, and next actions in the current portfolio. Answers are grounded in the Command Center data.</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 font-mono-ui text-[10px] text-muted-foreground" data-testid="status-assistant-source"><ShieldCheck size={14} className="text-primary" />{snapshot?.mode === 'SAMPLE MODE' ? 'SAMPLE MODE' : snapshot?.mode === 'LIVE DATA' ? 'LIVE DATA' : 'PORTFOLIO DATA'} · READ ONLY</div>
      </div>

      {snapshot?.warning && <div className="mb-5 flex gap-2 rounded-lg border border-border bg-secondary/40 px-3 py-2 text-xs leading-5 text-muted-foreground" data-testid="text-assistant-source-warning"><TriangleAlert size={15} className="mt-0.5 shrink-0" />{snapshot.warning}</div>}

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_310px] xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-5">
          <section className="panel overflow-hidden rounded-xl" aria-label="Ask a question">
            <div className="flex items-center gap-3 border-b border-border px-4 py-3 sm:px-5">
              <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary"><MessageSquareText size={16} /></span>
              <div><h2 className="text-xs font-extrabold">Ask Scout</h2><p className="mt-0.5 text-[10px] text-muted-foreground">One question at a time · current Sheet-backed data</p></div>
            </div>
            <form onSubmit={handleSubmit} className="p-4 sm:p-5" data-testid="form-assistant-question">
              <label htmlFor="portfolio-question" className="eyebrow mb-2 block text-muted-foreground">Your question</label>
              <textarea
                id="portfolio-question"
                value={question}
                onChange={(event) => { setQuestion(event.target.value); if (inputError) setInputError(''); }}
                onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); void ask(question); } }}
                placeholder="Which projects need my attention?"
                rows={3}
                maxLength={2000}
                aria-invalid={!!inputError}
                aria-describedby={inputError ? 'assistant-input-error' : 'assistant-input-hint'}
                className="focus-ring block min-h-24 w-full resize-y rounded-lg border border-input bg-background/50 px-3 py-3 text-sm leading-6 text-foreground outline-none placeholder:text-muted-foreground/60"
                data-testid="input-assistant-question"
              />
              {inputError ? <p id="assistant-input-error" className="mt-2 text-xs text-destructive" role="alert" data-testid="text-assistant-input-error">{inputError}</p> : <p id="assistant-input-hint" className="mt-2 text-[10px] text-muted-foreground">Enter to ask · Shift + Enter for a new line</p>}
              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 text-[10px] text-muted-foreground"><LockKeyhole size={12} />No project records are changed</span>
                <button type="submit" disabled={assistant.isPending || !question.trim()} className="focus-ring inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg bg-primary px-4 text-xs font-extrabold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50" data-testid="button-ask-assistant">{assistant.isPending ? 'Finding answer' : 'Ask question'}{assistant.isPending ? <span className="inline-block size-3 animate-pulse rounded-sm bg-primary-foreground/60" /> : <CornerDownLeft size={14} />}</button>
              </div>
            </form>
          </section>

          <div aria-live="polite" aria-busy={assistant.isPending}>
            {assistant.isPending && (
              <div className="panel overflow-hidden rounded-xl p-5" aria-label="Finding an answer" data-testid="loading-assistant-answer">
                <div className="mb-5 flex items-center gap-2"><Search size={15} className="text-primary" /><span className="text-xs font-bold">Checking portfolio records…</span></div>
                <div className="space-y-3"><div className="h-3 w-3/4 animate-pulse rounded bg-secondary" /><div className="h-3 w-full animate-pulse rounded bg-secondary" /><div className="h-3 w-2/3 animate-pulse rounded bg-secondary" /></div>
              </div>
            )}
            {requestError && (
              <div className="panel flex items-start gap-3 rounded-xl p-5" role="alert" data-testid="error-assistant-answer">
                <TriangleAlert size={17} className="mt-0.5 shrink-0 text-primary" />
                <div><h2 className="text-sm font-extrabold">Answer unavailable</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">Scout could not answer right now. Your question was not saved or applied to any project.</p><button type="button" onClick={() => void ask(submittedQuestion)} className="focus-ring mt-3 inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-2 text-xs font-bold hover:border-primary/50" data-testid="button-retry-assistant">Try again <ArrowRight size={13} /></button></div>
              </div>
            )}
            {answer && <AnswerPanel answer={answer} question={submittedQuestion} />}
            {!answer && !assistant.isPending && !requestError && (
              <div className="panel flex items-start gap-3 rounded-xl px-4 py-5 sm:px-5" data-testid="empty-assistant-answer">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-secondary text-muted-foreground"><Search size={16} /></span>
                <div><h2 className="text-sm font-extrabold">Ask Scout a question</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">Choose a prompt or ask Scout in your own words. The answer, matching projects, and source evidence will appear here.</p></div>
              </div>
            )}
          </div>
        </div>

        <aside className="panel rounded-xl p-4 sm:p-5" aria-label="Suggested questions">
          <div className="mb-4"><p className="eyebrow text-primary">Quick queries</p><h2 className="mt-1 text-sm font-extrabold">Questions to try</h2><p className="mt-1 text-[11px] leading-4 text-muted-foreground">Use a starting point, then refine it in the input.</p></div>
          <div className="space-y-4">
            {starterGroups.map((group) => (
              <div key={group.label}>
                <h3 className="eyebrow mb-2 text-muted-foreground">{group.label}</h3>
                <div className="space-y-1.5">
                  {group.questions.map((prompt, index) => (
                    <button type="button" key={prompt} disabled={assistant.isPending} onClick={() => chooseQuestion(prompt)} className="focus-ring group flex w-full items-start justify-between gap-2 rounded-lg border border-border bg-background/30 px-3 py-2 text-left text-[11px] font-semibold leading-4 text-foreground/80 transition-colors hover:border-primary/50 hover:bg-secondary/50 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50" data-testid={`button-assistant-prompt-${group.label.toLowerCase().replaceAll(' ', '-')}-${index}`}>
                      <span>{prompt}</span><ArrowUpRight size={13} className="mt-0.5 shrink-0 text-muted-foreground group-hover:text-primary" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-5 border-t border-border pt-4 text-[10px] leading-4 text-muted-foreground">Answers use the latest available portfolio snapshot. Use Refresh in the header to sync the Command Center.</p>
        </aside>
      </div>
    </div>
  );
}