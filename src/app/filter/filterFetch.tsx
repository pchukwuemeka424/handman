import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import supabaseDb from '@/utils/supabase-db';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { MdSearch } from 'react-icons/md';
import { FaCheckCircle, FaMapMarkerAlt, FaSpinner } from 'react-icons/fa';

interface UserProfile {
  id: string;
  fname: string;
  lname: string;
  state: string;
  city: string;
  avatar: string;
  kyc_status: string;
  busName: string;
  Banner: string;
  skills?: string;
  user_id: string;
  averageRating?: number;
  reviewCount?: number;
}

const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;
  return '⭐'.repeat(fullStars) + (halfStar ? '⭐' : '') + '☆'.repeat(emptyStars);
};

export default function SearchProduct() {
  const [userDetail, setUserDetail] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [fetched, setFetched] = useState(false);

  const searchParams = useSearchParams();
  const search = searchParams.get('q');
  const state = searchParams.get('state');

  const fetchDetails = useCallback(async (page: number, search?: string, state?: string) => {
    if (!hasMore || loading) return;

    setLoading(true);

    try {
      let query = supabaseDb
        .from('user_profile')
        .select('id, fname, lname, state, city, avatar, kyc_status, busName, Banner, user_id, skills')
        .order('created_at', { ascending: false })
        .range((page - 1) * 10, page * 10 - 1); // ✅ Correct pagination

      if (search) query = query.ilike('skills', `%${search}%`);
      if (state) query = query.ilike('state', `%${state}%`);

      const { data, error } = await query;
      if (error) throw error;

      if (!data.length) {
        setHasMore(false);
      } else {
        const userIds = data.map(user => user.user_id);
        const { data: ratingsData, error: ratingsError } = await supabaseDb
          .from('rating')
          .select('user_id, stars')
          .in('user_id', userIds);

        if (ratingsError) throw ratingsError;

        const userRatings = data.map(user => {
          const userRatingsData = ratingsData.filter(rating => rating.user_id === user.user_id);
          const totalStars = userRatingsData.reduce((acc, rating) => acc + (parseFloat(rating.stars) || 0), 0);
          const reviewCount = userRatingsData.length;
          const averageRating = reviewCount > 0 ? Math.round((totalStars / reviewCount) * 10) / 10 : 0;
          return { ...user, averageRating, reviewCount };
        });

        setUserDetail(prev => [...prev, ...userRatings.filter(p => !prev.some(prev => prev.id === p.id))]);
        setHasMore(userRatings.length === 10); // ✅ Dynamically set hasMore
      }
    } catch (error) {
      console.error('Error fetching users:', error.message);
    } finally {
      setFetched(true);
      setLoading(false);
    }
  }, [hasMore, loading]);

  useEffect(() => {
    setUserDetail([]);
    setPage(1);
    setHasMore(true);
    setFetched(false);
    fetchDetails(1, search, state);
  }, [search, state]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 200 &&
      !loading &&
      hasMore
    ) {
      setPage(prev => prev + 1);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (page > 1 && hasMore) {
      fetchDetails(page, search, state);
    }
  }, [page, search, state, hasMore]);

  return (
    <div className="col-span-12 sm:col-span-12">
      {userDetail.length > 0 ? (
        userDetail.map((user, index) => (
          <Link href={`/trades/${user.user_id}`} key={`${user.id}-${index}`} passHref>
            <Card className="hover:shadow-xl transition-all transform hover:scale-105 p-4 my-2 rounded-lg border border-gray-300">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <Image
                    src={user?.avatar}
                    alt={user.busName || `User ${index + 1}`}
                    className="w-24 h-24 rounded-lg shadow-md"
                    width={96}
                    height={96}
                  />
                </div>
                <div className="text-gray-700">
                  <CardTitle className="text-xl font-semibold capitalize">{user.busName}</CardTitle>
                  <div className="text-md text-sm text-blue-400">{renderStars(user.averageRating)}</div>
                  <div className='text-xs text-gray-600'>
                    {user.averageRating?.toFixed(1)}/5 ({user.reviewCount} Reviews)
                  </div>
                  <p className="text-sm text-gray-500">
                    <FaMapMarkerAlt className="inline-block text-green-700" /> {user.state || 'State'}, {user.city || 'City'}
                  </p>
                </div>
              </div>
              <CardDescription className="mt-2 text-gray-600 capitalize text-lg font-semibold">Services & Skills</CardDescription>
              <div className="text-md text-gray-600 flex flex-wrap gap-2">
                {user.skills
                  ? user.skills.split(',').map((skill, index) => (
                    <span key={index} className="flex items-center gap-1">
                      <FaCheckCircle className="text-blue-500" /> {skill.trim()}
                    </span>
                  ))
                  : ['Handyman', 'Plumber', 'Carpenter', 'Electrician', 'Painter'].map((defaultSkill, index) => (
                    <span key={index} className="flex items-center gap-1">
                      <FaCheckCircle className="text-green-500" /> {defaultSkill}
                    </span>
                  ))}
              </div>
            </Card>
          </Link>
        ))
      ) : (
        fetched && (
          <div className="flex flex-col items-center justify-center py-10 text-gray-500">
            <MdSearch className="text-6xl text-gray-400" />
            <p className="mt-2 text-lg font-semibold">No results found</p>
            <p className="text-sm text-gray-500">Try adjusting your search or use different keywords.</p>
          </div>
        )
      )}

      {loading && (
        <div className="flex justify-center items-center py-4">
          <FaSpinner className="animate-spin text-blue-500 text-3xl" />
        </div>
      )}

      {!hasMore && userDetail.length > 0 && (
        <div className="text-center mt-4 text-gray-500">No more users to load.</div>
      )}
    </div>
  );
}
