import Link from 'next/link';
import { DueProblem } from '@/lib/types';

export default function RevisionList({ problems }: { problems: DueProblem[] }) {
  if (problems.length === 0) {
    return <p>Nothing overdue. Nice.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Difficulty</th>
          <th>Last Revised</th>
          <th>Days Since</th>
        </tr>
      </thead>
      <tbody>
        {problems.map((p) => (
          <tr key={p.id}>
            <td>
              <Link href={`/problems/${p.id}`}>{p.title}</Link>
            </td>
            <td>{p.difficulty}</td>
            <td>{p.last_revised}</td>
            <td>{p.days_since}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
