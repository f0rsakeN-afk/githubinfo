import { useAppSelector } from "@/store/hooks/useRedux";
import { selectUser } from "@/store/userSlice";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import {
    MapPin,
    Link2,
    Calendar,
    Users,
    BookOpen,
    GitFork,
    Building2,
    Mail,
    Twitter,
    GithubIcon,
    Sparkles,
    CheckCircle2
} from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

const UserProfile = () => {
    const user = useAppSelector(selectUser);
    if (!user) return null;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="overflow-hidden">
                {/* Header/Banner Section */}
                <div className="h-32 bg-gradient-to-r from-primary/10 to-secondary/10" />

                <CardContent className="relative pt-16">
                    {/* Avatar */}
                    <div className="absolute -top-16 left-6">
                        <div className="relative">
                            <img
                                src={user.avatar_url}
                                alt={user.name || user.login}
                                className="w-32 h-32 rounded-full border-4 border-background shadow-xl"
                            />
                            {user.hireable && (
                                <Badge className="absolute -bottom-2 right-0 bg-green-500">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Hireable
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="mt-8 space-y-6">
                        {/* User Identity */}
                        <div className="space-y-2">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold">{user.name}</h1>
                                    <p className="text-muted-foreground">@{user.login}</p>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => window.open(user.html_url, '_blank')}
                                >
                                    <GithubIcon className="mr-2 h-4 w-4" />
                                    View Profile
                                </Button>
                            </div>
                            {user.bio && (
                                <p className="text-muted-foreground flex items-center gap-2">
                                    <Sparkles className="h-4 w-4" />
                                    {user.bio}
                                </p>
                            )}
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatCard
                                icon={<BookOpen className="h-4 w-4" />}
                                label="Repositories"
                                value={user.public_repos}
                            />
                            <StatCard
                                icon={<GitFork className="h-4 w-4" />}
                                label="Gists"
                                value={user.public_gists}
                            />
                            <StatCard
                                icon={<Users className="h-4 w-4" />}
                                label="Followers"
                                value={user.followers}
                            />
                            <StatCard
                                icon={<Users className="h-4 w-4" />}
                                label="Following"
                                value={user.following}
                            />
                        </div>

                        <Separator />

                        {/* User Details Grid */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                {user.location && (
                                    <DetailItem icon={<MapPin />} label="Location">
                                        {user.location}
                                    </DetailItem>
                                )}
                                {user.blog && (
                                    <DetailItem icon={<Link2 />} label="Website">
                                        <a
                                            href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:underline"
                                        >
                                            {user.blog}
                                        </a>
                                    </DetailItem>
                                )}
                                {user.company && (
                                    <DetailItem icon={<Building2 />} label="Company">
                                        {user.company}
                                    </DetailItem>
                                )}
                            </div>
                            <div className="space-y-4">
                                {user.email && (
                                    <DetailItem icon={<Mail />} label="Email">
                                        <a
                                            href={`mailto:${user.email}`}
                                            className="text-blue-500 hover:underline"
                                        >
                                            {user.email}
                                        </a>
                                    </DetailItem>
                                )}
                                {user.twitter_username && (
                                    <DetailItem icon={<Twitter />} label="Twitter">
                                        <a
                                            href={`https://twitter.com/${user.twitter_username}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:underline"
                                        >
                                            @{user.twitter_username}
                                        </a>
                                    </DetailItem>
                                )}
                                <DetailItem icon={<Calendar />} label="Joined">
                                    {formatDate(user.created_at)}
                                </DetailItem>
                            </div>
                        </div>

                        {/* Additional Meta */}
                        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                            <Badge variant="outline" className="rounded-full">
                                {user.type}
                            </Badge>
                            {user.site_admin && (
                                <Badge variant="destructive" className="rounded-full">
                                    Site Admin
                                </Badge>
                            )}
                            <Badge variant="secondary" className="rounded-full">
                                ID: {user.id}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

// Helper Components
const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) => (
    <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-center gap-2 text-muted-foreground mb-1">
            {icon}
            <span className="text-sm">{label}</span>
        </div>
        <p className="text-2xl font-bold">{value}</p>
    </div>
);

const DetailItem = ({
    icon,
    label,
    children
}: {
    icon: React.ReactNode;
    label: string;
    children: React.ReactNode;
}) => (
    <div className="flex items-center gap-2">
        <div className="text-muted-foreground">{icon}</div>
        <div>
            <span className="text-sm text-muted-foreground mr-2">{label}:</span>
            <span>{children}</span>
        </div>
    </div>
);

export default UserProfile;