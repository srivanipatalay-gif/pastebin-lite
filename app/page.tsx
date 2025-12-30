'use client';
import { useEffect, useState } from 'react';

interface User {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface Paste {
  _id: string;
  title: string;
  content: string;
  language: string;
  createdAt: string;
  updatedAt: string;
}

interface NewPasteForm {
  title: string;
  content: string;
  language: string;
  ttl_seconds: string;
  max_views: string;
}

export default function HomePage() {
  const [apiData, setApiData] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [pastes, setPastes] = useState<Paste[]>([]);
  const [newUserName, setNewUserName] = useState('');
  const [createdPasteUrl, setCreatedPasteUrl] = useState<string | null>(null);
  const [newPaste, setNewPaste] = useState<NewPasteForm>({ title: '', content: '', language: 'javascript', ttl_seconds: '', max_views: '' });

  useEffect(() => {
    fetch('/api/healthz')
      .then(res => res.json())
      .then(data => setApiData(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchPastes();
  }, []);

  const fetchUsers = () => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err));
  };

  const fetchPastes = () => {
    fetch('/api/pastes')
      .then(res => res.json())
      .then(data => setPastes(data))
      .catch(err => console.error(err));
  };

  const addUser = (e: React.FormEvent) => {
    e.preventDefault();
    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newUserName }),
    })
      .then(res => res.json())
      .then(() => {
        setNewUserName('');
        fetchUsers();
      })
      .catch(err => console.error(err));
  };

  const addPaste = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: newPaste.title,
      content: newPaste.content,
      language: newPaste.language,
      ...(newPaste.ttl_seconds && { ttl_seconds: Number(newPaste.ttl_seconds) }),
      ...(newPaste.max_views && { max_views: Number(newPaste.max_views) }),
    };
    fetch('/api/pastes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(res => res.json())
      .then(data => {
        setNewPaste({ title: '', content: '', language: 'javascript', ttl_seconds: '', max_views: '' });
        setCreatedPasteUrl(data.url);
        fetchPastes();
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Pastebin Lite</h1>

        {/* Health Check */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">API Health Check</h2>
          <pre className="bg-gray-50 p-4 rounded">
            {apiData ? JSON.stringify(apiData, null, 2) : 'Loading...'}
          </pre>
        </div>

        {/* Users Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Users</h2>
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">ID</th>
                <th className="border border-gray-300 px-4 py-2">Name</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td className="border border-gray-300 px-4 py-2">{user._id}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <form onSubmit={addUser} className="mt-4 flex gap-2">
            <input
              type="text"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              placeholder="Enter user name"
              className="flex-1 px-3 py-2 border border-gray-300 rounded"
              required
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Add User
            </button>
          </form>
        </div>

        {/* Pastes Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Pastes</h2>
          <div className="space-y-4 mb-6">
            {pastes.map(paste => (
              <div key={paste._id} className="border border-gray-300 p-4 rounded">
                <h3 className="font-semibold">{paste.title}</h3>
                <p className="text-sm text-gray-600">Language: {paste.language} | Created: {new Date(paste.createdAt).toLocaleString()}</p>
                <pre className="bg-gray-50 p-2 mt-2 rounded text-sm overflow-x-auto">{paste.content}</pre>
              </div>
            ))}
          </div>
          <form onSubmit={addPaste} className="space-y-4">
            <input
              type="text"
              value={newPaste.title}
              onChange={(e) => setNewPaste({ ...newPaste, title: e.target.value })}
              placeholder="Paste title"
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            <select
              value={newPaste.language}
              onChange={(e) => setNewPaste({ ...newPaste, language: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="text">Plain Text</option>
            </select>
            <input
              type="number"
              value={newPaste.ttl_seconds}
              onChange={(e) => setNewPaste({ ...newPaste, ttl_seconds: e.target.value })}
              placeholder="TTL in seconds (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            <input
              type="number"
              value={newPaste.max_views}
              onChange={(e) => setNewPaste({ ...newPaste, max_views: e.target.value })}
              placeholder="Max views (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            <textarea
              value={newPaste.content}
              onChange={(e) => setNewPaste({ ...newPaste, content: e.target.value })}
              placeholder="Paste your code here..."
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            />
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Create Paste
            </button>
          </form>
          {createdPasteUrl && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
              <p className="text-blue-800">Paste created! Share this URL:</p>
              <a href={createdPasteUrl} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{createdPasteUrl}</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
