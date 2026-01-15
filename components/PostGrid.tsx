
import React, { useState } from 'react';
import { MOCK_POSTS } from '../constants';
import { getClimbAdvice } from '../services/geminiService';

interface PostGridProps {
  onNavigate?: (view: any) => void;
  onAuthRequired?: () => void;
  isLoggedIn: boolean;
}

const PostGrid: React.FC<PostGridProps> = ({ onNavigate, onAuthRequired, isLoggedIn }) => {
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePostClick = async (title: string, id: string) => {
    if (!isLoggedIn) {
      onAuthRequired?.();
      return;
    }
    setSelectedPost(id);
    setLoading(true);
    const aiAdvice = await getClimbAdvice(title);
    setAdvice(aiAdvice);
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-12">
      {MOCK_POSTS.map((post) => (
        <div 
          key={post.id}
          onClick={() => handlePostClick(post.title, post.id)}
          className="group relative cursor-pointer overflow-hidden rounded-none bg-white shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2"
        >
          <div 
            className="aspect-[4/5] bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
            style={{ backgroundImage: `url(${post.imageUrl})` }}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
            <h3 className="text-white font-bold text-xl font-display">{post.title}</h3>
            <p className="text-white/70 text-sm mt-1">{post.location} | {post.date}</p>
            
            {selectedPost === post.id && (
              <div className="mt-4 bg-white/10 backdrop-blur-md p-3 rounded-none border border-white/20">
                <p className="text-white text-xs leading-relaxed italic">
                  {loading ? "正在分析山岳数据..." : `专业建议：${advice}`}
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostGrid;
