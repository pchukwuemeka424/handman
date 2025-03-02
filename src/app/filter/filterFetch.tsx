import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import supabaseDb from '@/utils/supabase-db';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import Spinner from '@/components/spinner';
import { MdErrorOutline } from 'react-icons/md';

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

  const searchParams = useSearchParams();
  const search = searchParams.get('q');
  const state = searchParams.get('state');

  const fetchDetails = useCallback(async (page: number, search?: string, state?: string) => {
    if (!hasMore) return;
    setLoading(true);

    try {
      let query = supabaseDb
        .from('user_profile')
        .select('id, fname, lname, state, city, avatar, kyc_status, busName, Banner, user_id, skills')
        .order('created_at', { ascending: false })
        .range((page - 1) * 10, page * 10 - 1);

      if (search) query = query.ilike('skills', `%${search}%`);
      if (state) query = query.ilike('state', `%${state}%`);

      const { data, error } = await query;
      if (error) throw error;

      if (data.length === 0) {
        setHasMore(false);
        return;
      }

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

      if (userRatings.length < 10) setHasMore(false);
    } catch (error) {
      console.error('Error fetching users:', error.message);
    } finally {
      setLoading(false);
    }
  }, [hasMore]);

  useEffect(() => {
    setUserDetail([]);
    setPage(1);
    setHasMore(true);
    fetchDetails(1, search, state);
  }, [search, state]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 200 && !loading) {
        setPage(prev => prev + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  useEffect(() => {
    fetchDetails(page, search, state);
  }, [page]);

  return (
    <div className="col-span-12 sm:col-span-12">
      {userDetail.map((user, index) => (
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
                <p className="text-sm text-gray-500">{user.state || 'State'}, {user.city || 'City'}</p>
                <div className="text-md text-blue-400">
                  {renderStars(user.averageRating)} {user.averageRating?.toFixed(1)}/5 ({user.reviewCount} Reviews)
                </div>
              </div>
            </div>
            <CardDescription className="mt-2 text-gray-600 capitalize font-semibold">Services & Skills</CardDescription>
            <div className="text-xs text-gray-600">{user.skills || 'Handyman, Plumber, Carpenter, Electrician, Painter'}</div>
          </Card>
        </Link>
      ))}
      {loading && <div className="text-center mt-4">Loading more users...</div>}
      {!hasMore && <div className="text-center mt-4 text-gray-500">No more users to load.</div>}
    </div>
  );
}
