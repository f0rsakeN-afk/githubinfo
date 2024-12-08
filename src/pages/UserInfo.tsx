import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks/useRedux';
import { selectUser, selectLoading, selectError, fetchUserData } from '@/store/userSlice';
import UserProfile from '@/components/myComponents/userProfile';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import UserRepos from '@/components/myComponents/userRepos';
import { Loader } from '@/components/myComponents/Loader';
//import GitHubContributions from '@/components/myComponents/contributions';

const UserInfo = () => {
  const { user: username } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const user = useAppSelector(selectUser);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);

  useEffect(() => {
    if (username && !user) {
      dispatch(fetchUserData(username));
    }
  }, [username, dispatch, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size='lg' />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-destructive text-lg">{error}</p>
        <Button onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <Button
          variant="ghost"
          className="mt-4"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Search
        </Button>

        <UserProfile />
        <UserRepos />
        {/*  <GitHubContributions /> */}
      </div>
    </div>
  );
};

export default UserInfo;