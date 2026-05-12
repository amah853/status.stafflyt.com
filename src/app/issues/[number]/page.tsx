import { redirect } from 'next/navigation';

export default async function IssueAliasDetailPage({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const { number } = await params;
  redirect(`/incidents/${number}`);
}
