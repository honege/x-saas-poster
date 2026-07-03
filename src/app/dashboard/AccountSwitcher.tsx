'use client';

import { useRouter } from 'next/navigation';

export default function AccountSwitcher({ 
  accounts, 
  selectedAccountId 
}: { 
  accounts: { id: string, handle: string }[], 
  selectedAccountId: string 
}) {
  const router = useRouter();

  return (
    <select 
      className="bg-transparent text-white border-none outline-none"
      style={{ fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}
      defaultValue={selectedAccountId}
      onChange={(e) => {
        router.push(`/dashboard?accountId=${e.target.value}`);
      }}
    >
      {accounts.map(acc => (
        <option key={acc.id} value={acc.id} style={{ color: 'black' }}>{acc.handle}</option>
      ))}
    </select>
  );
}
