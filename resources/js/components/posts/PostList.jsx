import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            setLoading(true);
            const data = await postService.getAll();
            setPosts(data);
        } catch {
            setError('Failed to load posts');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this post?')) return;
        await postService.delete(id);
        setPosts(posts.filter((p) => p.id !== id));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-500">
                Loading posts…
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Posts</h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Welcome back, <span className="font-medium">{user?.name}</span>
                    </p>
                </div>

                <Link
                    to="/posts/create"
                    className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 shadow-sm"
                >
                    + New Post
                </Link>
            </div>

            {/* Error */}
            {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Empty State */}
            {posts.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900">
                        No posts yet
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                        Start sharing your thoughts by creating a post.
                    </p>
                    <Link
                        to="/posts/create"
                        className="inline-block mt-6 text-indigo-600 font-medium hover:underline"
                    >
                        Create your first post →
                    </Link>
                </div>
            ) : (
                /* Grid */
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="group relative rounded-xl bg-white shadow-sm border hover:shadow-md transition"
                        >
                            <div className="p-6 space-y-3">
                                <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">
                                    {post.title}
                                </h2>

                                <p className="text-sm text-gray-600 line-clamp-3">
                                    {post.content}
                                </p>

                                <div className="flex items-center justify-between pt-4 text-xs text-gray-400">
                                    <span>
                                        {new Date(post.created_at).toLocaleDateString()}
                                    </span>

                                    {/* Actions */}
                                    <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition">
                                        <Link
                                            to={`/posts/${post.id}/edit`}
                                            className="text-indigo-600 hover:underline"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            className="text-red-600 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PostList;
