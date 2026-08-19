import { AcSubmission, QuestionData } from '../types';

const LEETCODE_GRAPHQL_URL = 'https://leetcode.com/graphql';

async function graphqlRequest<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const res = await fetch(LEETCODE_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Referer: 'https://leetcode.com',
      'User-Agent': 'Mozilla/5.0',
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`LeetCode GraphQL request failed: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as { data?: T; errors?: unknown };
  if (json.errors) {
    throw new Error(`LeetCode GraphQL errors: ${JSON.stringify(json.errors)}`);
  }
  if (!json.data) {
    throw new Error('LeetCode GraphQL response missing data');
  }
  return json.data;
}

// Note: recentAcSubmissionList is capped at ~20 results regardless of `limit`,
// so this only ever captures the most recent submissions, not full history.
export async function fetchAcSubmissions(username: string, limit = 20): Promise<AcSubmission[]> {
  const query = `
    query recentAcSubmissions($username: String!, $limit: Int!) {
      recentAcSubmissionList(username: $username, limit: $limit) {
        title
        titleSlug
        timestamp
      }
    }
  `;
  const data = await graphqlRequest<{ recentAcSubmissionList: AcSubmission[] }>(query, {
    username,
    limit,
  });
  return data.recentAcSubmissionList;
}

export async function fetchQuestionData(titleSlug: string): Promise<QuestionData> {
  const query = `
    query questionData($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        difficulty
        topicTags { name slug }
        content
        isPaidOnly
      }
    }
  `;
  const data = await graphqlRequest<{ question: QuestionData }>(query, { titleSlug });
  return data.question;
}
