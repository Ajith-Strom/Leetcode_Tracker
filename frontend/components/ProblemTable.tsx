import Link from 'next/link';
import { Problem } from '@/lib/types';

export default function ProblemTable({ problems }: { problems: Problem[] }) {
  if (problems.length === 0) {
    return <p>No problems synced yet. Click Sync to pull from LeetCode.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Difficulty</th>
          <th>Tags</th>
          <th>First Solved</th>
        </tr>
      </thead>
      <tbody>
        {problems.map((p) => (
          <tr key={p.id}>
            <td>
              <Link href={`/problems/${p.id}`}>{p.title}</Link>
            </td>
            <td>{p.difficulty}</td>
            <td>{p.tags.join(', ')}</td>
            <td>{p.first_solved_date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
