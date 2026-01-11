import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
            <h1 className="text-6xl font-bold text-indigo-600">404</h1>
            <p className="mt-4 text-lg text-gray-700">
                Oops! The page you’re looking for doesn’t exist.
            </p>

            <Link
                to="/"
                className="mt-6 inline-flex items-center rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
                Go back home
            </Link>
        </div>
    );
};

export default NotFound;
