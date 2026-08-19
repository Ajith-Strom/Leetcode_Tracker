import { fetchAcSubmissions, fetchQuestionData } from './leetcode.service';
import { getAllSlugs, upsertProblem, upsertTag, linkProblemTag } from './problems.repo';

const TAG_FETCH_DELAY_MS = 400;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toDateString(unixSeconds: string): string {
  return new Date(Number(unixSeconds) * 1000).toISOString().slice(0, 10);
}

export async function runSync(username: string): Promise<{ newProblems: number; totalFetched: number }> {
  const submissions = await fetchAcSubmissions(username);
  const existingSlugs = await getAllSlugs();

  // dedupe submissions (resubmissions of the same problem appear multiple times)
  const seenSlugs = new Set<string>();
  const newSubmissions = submissions.filter((s) => {
    if (existingSlugs.has(s.titleSlug) || seenSlugs.has(s.titleSlug)) return false;
    seenSlugs.add(s.titleSlug);
    return true;
  });

  let newProblems = 0;

  for (const submission of newSubmissions) {
    const questionData = await fetchQuestionData(submission.titleSlug);

    const problemId = await upsertProblem({
      title: submission.title,
      slug: submission.titleSlug,
      difficulty: questionData.difficulty,
      firstSolvedDate: toDateString(submission.timestamp),
      content: questionData.content,
      isPaidOnly: questionData.isPaidOnly,
    });

    for (const tag of questionData.topicTags) {
      const tagId = await upsertTag(tag.name);
      await linkProblemTag(problemId, tagId);
    }

    newProblems++;
    await sleep(TAG_FETCH_DELAY_MS);
  }

  return { newProblems, totalFetched: submissions.length };
}
