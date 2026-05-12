import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink, MessageSquareText } from 'lucide-react';
import { fetchIssue, fetchIssueComments } from '@/app/_lib/github';

function formatDateTime(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default async function IncidentDetailPage({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const { number } = await params;
  const issueNumber = Number(number);
  if (!Number.isInteger(issueNumber) || issueNumber <= 0) notFound();

  const issue = await fetchIssue(issueNumber, { revalidateSeconds: 60 });
  if (!issue) notFound();

  const comments = await fetchIssueComments(issueNumber, { revalidateSeconds: 60 });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-sky-50/30">
      <nav className="sticky top-0 z-50 glass border-b border-gray-200/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-cyan-500">
                <Image
                  src="https://www.stafflyt.com/stafflyt.svg"
                  alt="Stafflyt"
                  width={20}
                  height={20}
                  className="h-5 w-5"
                />
              </div>
              <span className="text-lg font-bold text-dark">Stafflyt Status</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 mb-8">
          <Link
            href="/incidents"
            className="flex items-center gap-2 text-primary hover:text-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Incidents
          </Link>

          <Link
            href={issue.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-white/60 px-3 py-2 text-sm font-medium text-gray-700 ring-1 ring-gray-200/50 hover:text-primary hover:ring-primary/20 transition-colors"
          >
            View on GitHub
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>

        <div className="rounded-2xl bg-white/50 backdrop-blur-sm ring-1 ring-gray-200/50 p-8 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                    issue.state === 'open'
                      ? 'bg-warning/10 text-warning ring-warning/20'
                      : 'bg-success/10 text-success ring-success/20'
                  }`}
                >
                  {issue.state === 'open' ? 'Open' : 'Resolved'}
                </span>
                <span className="text-sm text-gray-500">#{issue.number}</span>
                {issue.comments > 0 ? (
                  <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                    <MessageSquareText className="h-4 w-4" />
                    {issue.comments}
                  </span>
                ) : null}
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-dark break-words">
                {issue.title}
              </h1>

              <p className="mt-3 text-sm text-gray-600">
                Opened {formatDateTime(issue.created_at)}
                {issue.user?.login ? ` by ${issue.user.login}` : ''} • Updated{' '}
                {formatDateTime(issue.updated_at)}
              </p>

              {issue.labels?.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {issue.labels.map((label) => (
                    <span
                      key={`${issue.number}:${label.name}`}
                      className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-200"
                    >
                      {label.name}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          {issue.body ? (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-dark mb-3">Details</h2>
              <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                {issue.body}
              </pre>
            </div>
          ) : null}
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-dark mb-4">Updates</h2>

          {comments.length === 0 ? (
            <div className="rounded-2xl bg-white/50 backdrop-blur-sm ring-1 ring-gray-200/50 p-8 text-gray-600">
              No updates yet.
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="rounded-2xl bg-white/50 backdrop-blur-sm ring-1 ring-gray-200/50 p-6"
                >
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <div className="text-sm text-gray-600">
                      {c.user?.login ? c.user.login : 'Unknown'} •{' '}
                      {formatDateTime(c.created_at)}
                    </div>
                    <Link
                      href={c.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors"
                    >
                      Permalink
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </div>

                  {c.body ? (
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                      {c.body}
                    </pre>
                  ) : (
                    <div className="text-sm text-gray-500">(No content)</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-gray-200/50 bg-white/50 mt-16">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-cyan-500">
                <Image
                  src="https://www.stafflyt.com/stafflyt.svg"
                  alt="Stafflyt"
                  width={14}
                  height={14}
                  className="h-3.5 w-3.5"
                />
              </div>
              <span className="font-semibold text-gray-900">Stafflyt Status</span>
            </div>
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Ahmad Mahrous. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
