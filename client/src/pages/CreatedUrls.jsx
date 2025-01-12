import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserUrls, deleteUserUrl} from '../redux/urlSlice'; // Import the thunk
import {
  Search,
  ChevronLeft,
  ChevronRight,
  BarChart2,
  Trash2,
} from 'lucide-react';
import HomeNavbar from '../components/HomeNavbar';
import Footer from '../components/Footer';

export default function Analytics() {
  const dispatch = useDispatch();
  const { userUrls, loading, error } = useSelector((state) => state.url);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  useEffect(() => {
    dispatch(fetchUserUrls()); // Fetch user URLs on component mount
  }, [dispatch]);

  const itemsPerPage = 10;
  const filteredData = userUrls.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = (id) => {
    console.log('Deleting URL with ID:', id);
    dispatch(deleteUserUrl(id)); // Dispatch delete action with item._id
    setShowDeleteConfirm(null);
  };

  const handleViewAnalytics = (id) => {
    console.log('Viewing analytics for URL with ID:', id);
  };

  return (
    <>
      <HomeNavbar />
      <div className="min-h-screen bg-black">
        <main className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white">Your Short Urls</h1>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search links..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-md text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none w-64"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg border border-green-500/20 overflow-hidden">
              {loading ? (
                <div className="p-6 text-center text-gray-400">Loading...</div>
              ) : error ? (
                <div className="p-6 text-center text-red-500">{error}</div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-black">
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Short URL
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Long URL
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Alias
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Topic
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Created At
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        {paginatedData.map((item) => (
                          <tr key={item._id} className="hover:bg-gray-800/50">
                            <td className="px-6 py-4 text-sm text-green-500">
                              {item.shortUrl}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-300 truncate max-w-xs">
                              {item.longUrl}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-300">
                              {item.alias}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-300">
                              {item.topic}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-300">
                              {new Date(item.createdAt).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => handleViewAnalytics(item._id)}
                                  className="p-1.5 bg-green-500 text-black rounded-md hover:bg-green-600 transition-colors"
                                  title="View Analytics"
                                >
                                  <BarChart2 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => setShowDeleteConfirm(item._id)}
                                  className="p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                                  title="Delete URL"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="bg-black px-6 py-4 border-t border-gray-800 flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      Showing {startIndex + 1} to{' '}
                      {Math.min(startIndex + itemsPerPage, filteredData.length)}{' '}
                      of {filteredData.length} results
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 bg-gray-900 rounded-md text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-1 rounded-md ${
                              currentPage === page
                                ? 'bg-green-500 text-black'
                                : 'bg-gray-900 text-gray-400 hover:text-white'
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 bg-gray-900 rounded-md text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 p-6 rounded-lg max-w-sm w-full">
              <h3 className="text-white font-semibold mb-4">Confirm Delete</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete this URL? This action cannot be
                undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-md"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </>
  );
}
