'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Paste {
  _id: string;
  title: string;
  content: string;
  language: string;
  expires_at: string | null;
  remaining_views: number | null;
  createdAt: string;
}

export default function PastePage() {
  const { id } = useParams();
  const [paste, setPaste] = useState<Paste | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`/api/pastes/${id}`)
        .then(res => {
          if (!res.ok) {
            return res.json().then(err => { throw new Error(err.error); });
          }
          return res.json();
        })
        .then(data => setPaste(data))
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
  if (!paste) return <div className="p-8">Paste not found</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">{paste.title}</h1>
        <p className="text-sm text-gray-600 mb-4">
          Language: {paste.language} | Created: {new Date(paste.createdAt).toLocaleString()}
          {paste.expires_at && ` | Expires: ${new Date(paste.expires_at).toLocaleString()}`}
          {paste.remaining_views !== null && ` | Views left: ${paste.remaining_views}`}
        </p>
        <pre className="bg-gray-50 p-4 rounded text-sm overflow-x-auto whitespace-pre-wrap">{paste.content}</pre>
      </div>
    </div>
  );
}