import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const mockVideos = [
  {
    id: '1',
    title: 'Match vs. Lions',
    date: 'Uploaded 2 days ago',
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '2',
    title: 'Training Session - Passing Drills',
    date: 'Uploaded 1 week ago',
    thumbnail: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '3',
    title: 'Match vs. Tigers',
    date: 'Uploaded 2 weeks ago',
    thumbnail: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '4',
    title: 'Training Session - Shooting Practice',
    date: 'Uploaded 3 weeks ago',
    thumbnail: 'https://images.unsplash.com/photo-1509475826633-fed577a2c71b?auto=format&fit=crop&w=400&q=80',
  },
];

const CoachMatches = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filteredVideos = mockVideos.filter(v =>
    v.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Videos</h1>
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search videos"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>
      <h2 className="text-xl font-semibold mb-4">Recent Videos</h2>
      <div className="grid grid-cols-1 gap-8">
        {filteredVideos.map(video => (
          <div
            key={video.id}
            className="flex items-center gap-6 cursor-pointer hover:bg-gray-50 rounded-lg p-2"
            onClick={() => navigate(`/coach/video/${video.id}`)}
          >
            <div className="flex-1">
              <div className="font-bold text-lg">{video.title}</div>
              <div className="text-blue-700 text-sm mt-1">{video.date}</div>
            </div>
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-48 h-28 object-cover rounded-lg shadow"
            />
          </div>
        ))}
      </div>
      {/* Pagination (mocked) */}
      <div className="flex justify-center mt-10">
        <nav className="flex items-center gap-2">
          <button className="px-2 py-1 rounded text-gray-400" disabled>{'<'}</button>
          <button className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 font-bold">1</button>
          <button className="w-8 h-8 rounded-full text-gray-700">2</button>
          <button className="w-8 h-8 rounded-full text-gray-700">3</button>
          <span className="px-2">...</span>
          <button className="w-8 h-8 rounded-full text-gray-700">10</button>
          <button className="px-2 py-1 rounded text-gray-700">{'>'}</button>
        </nav>
      </div>
    </div>
  );
};

export default CoachMatches; 