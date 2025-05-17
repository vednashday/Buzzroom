import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getoutgoingFriendReqs, sendFriendRequest } from '../lib/api';
import { CheckCircleIcon, UserPlusIcon } from 'lucide-react';

const UserSearch = () => {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sendingRequestIds, setSendingRequestIds] = useState(new Set());
  const [successIds, setSuccessIds] = useState(new Set());
  const [outgoingRequestsIds, setOutgoingRequestIds] = useState(new Set());

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getoutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation } = useMutation({
    mutationFn: sendFriendRequest,
    onMutate: (userId) => {
      setSendingRequestIds((prev) => new Set(prev).add(userId));
      setError(null);
    },
    onSuccess: (_, userId) => {
      setSuccessIds((prev) => new Set(prev).add(userId));
      setSendingRequestIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] });
    },
    onError: (_, userId) => {
      setError("Failed to send friend request");
      setSendingRequestIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    },
  });

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => outgoingIds.add(req.id));
    }
    setOutgoingRequestIds(outgoingIds);
  }, [outgoingFriendReqs]);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`http://localhost:5001/api/users/search?q=${query}`, {
          withCredentials: true,
        });
        setResults(res.data);
      } catch (err) {
        console.error("Search error:", err);
        setError("Failed to fetch users");
        setResults([]);
      }
      setLoading(false);
    };

    const debounceTimeout = setTimeout(fetchUsers, 300);
    return () => clearTimeout(debounceTimeout);
  }, [query]);

  return (
    <div className="user-search flex flex-col items-center justify-center p-8">
      <input
        type="text"
        placeholder="Search users by name or email..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="input input-bordered w-full max-w-md rounded-4xl mb-6"
      />

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {Array.isArray(results) && results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-4xl">
          {results.map((user) => {
            const hasRequestBeenSent =
              outgoingRequestsIds.has(user._id) || successIds.has(user._id);
            const isSending = sendingRequestIds.has(user._id);

            return (
              <div
                key={user._id}
                className="p-4 border rounded-lg hover:scale-[1.05] transition cursor-pointer flex flex-col items-center"
              >
                <img
                  src={user.profilePic}
                  alt={user.fullName}
                  className="w-16 h-16 rounded-full mb-2"
                />
                <div className="text-center mb-2">
                  <p className="font-semibold">{user.fullName}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <button
                  className={`btn w-full mt-2 text-center items-center ${
                    hasRequestBeenSent ? "btn-disabled" : "btn-primary"
                  }`}
                  onClick={() => sendRequestMutation(user._id)}
                  disabled={hasRequestBeenSent || isSending}
                >
                  {hasRequestBeenSent ? (
                    <>
                      <CheckCircleIcon className="size-4 mr-2" />
                      Request Sent
                    </>
                  ) : (
                    <>
                      <UserPlusIcon className="size-4 mr-2 " />
                      {isSending ? "Sending..." : ""}
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        query.trim() !== '' && !loading && <p>No users found</p>
      )}
    </div>
  );
};

export default UserSearch;
