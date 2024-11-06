import { useState } from "react";
import { useAppSelector } from "@/store/hooks/useRedux";
import { selectRepos } from "@/store/userSlice";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import {
    BookMarked,
    GitFork,
    Star,
    Eye,
    Clock,
    Lock,
    Globe2,
    Calendar,
    GithubIcon,
    ExternalLink,
    AlertCircle,
    Scale,
    FileCode,
    Bookmark,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface Repository {
    id: number;
    name: string;
    full_name: string;
    private: boolean;
    html_url: string;
    description: string | null;
    fork: boolean;
    created_at: string;
    updated_at: string;
    pushed_at: string;
    homepage: string | null;
    size: number;
    stargazers_count: number;
    watchers_count: number;
    language: string | null;
    forks_count: number;
    archived: boolean;
    disabled: boolean;
    open_issues_count: number;
    license: {
        name: string;
    } | null;
    allow_forking: boolean;
    is_template: boolean;
    topics: string[];
    visibility: string;
    default_branch: string;
    has_issues: boolean;
    has_projects: boolean;
    has_wiki: boolean;
    has_pages: boolean;
    has_downloads: boolean;
}

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

const UserRepos = () => {
    const repos = useAppSelector(selectRepos);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [activeTab, setActiveTab] = useState("all");

    // Filter repos based on active tab
    const filteredRepos = repos.filter((repo) => {
        if (activeTab === "all") return true;
        if (activeTab === "forked") return repo.fork;
        if (activeTab === "archived") return repo.archived;
        return !repo.fork;
    });

    // Sort repos by stars
    const sortedRepos = [...filteredRepos].sort(
        (a, b) => b.stargazers_count - a.stargazers_count
    );

    // Calculate pagination
    const totalItems = sortedRepos.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentRepos = sortedRepos.slice(startIndex, endIndex);

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Generate page numbers array
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        // Always show first page
        pageNumbers.push(1);

        // Calculate start and end of visible pages
        let start = Math.max(2, currentPage - 1);
        let end = Math.min(totalPages - 1, currentPage + 1);

        // Adjust if at edges
        if (currentPage <= 2) {
            end = Math.min(totalPages - 1, 4);
        }
        if (currentPage >= totalPages - 1) {
            start = Math.max(2, totalPages - 3);
        }

        // Add ellipsis and numbers
        if (start > 2) pageNumbers.push("...");
        for (let i = start; i <= end; i++) {
            pageNumbers.push(i);
        }
        if (end < totalPages - 1) pageNumbers.push("...");

        // Always show last page
        if (totalPages > 1) pageNumbers.push(totalPages);

        return pageNumbers;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-2xl flex items-center gap-2">
                        <BookMarked className="h-6 w-6" />
                        Repositories ({totalItems})
                    </CardTitle>
                    <Select
                        value={itemsPerPage.toString()}
                        onValueChange={(value) => {
                            setItemsPerPage(Number(value));
                            setCurrentPage(1);
                        }}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select rows per page" />
                        </SelectTrigger>
                        <SelectContent>
                            {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                                <SelectItem key={option} value={option.toString()}>
                                    {option} per page
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardHeader>
                <CardContent>
                    <Tabs
                        defaultValue="all"
                        className="w-full"
                        onValueChange={(value) => {
                            setActiveTab(value);
                            setCurrentPage(1);
                        }}
                    >
                        <TabsList className="mb-4">
                            <TabsTrigger value="all">All ({repos.length})</TabsTrigger>
                            <TabsTrigger value="forked">
                                Forked ({repos.filter((repo) => repo.fork).length})
                            </TabsTrigger>
                            <TabsTrigger value="sources">
                                Sources ({repos.filter((repo) => !repo.fork).length})
                            </TabsTrigger>
                            <TabsTrigger value="archived">
                                Archived ({repos.filter((repo) => repo.archived).length})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value={activeTab}>
                            <div className="grid gap-4">
                                {currentRepos.map((repo) => (
                                    <RepoCard key={repo.id} repo={repo} />
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="mt-6">
                                    <Pagination>
                                        <PaginationContent>
                                            <PaginationItem>
                                                <PaginationPrevious
                                                    onClick={() => handlePageChange(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                />
                                            </PaginationItem>

                                            {getPageNumbers().map((page, index) => (
                                                <PaginationItem key={index}>
                                                    {page === "..." ? (
                                                        <PaginationEllipsis />
                                                    ) : (
                                                        <PaginationLink
                                                            isActive={currentPage === page}
                                                            onClick={() => handlePageChange(Number(page))}
                                                        >
                                                            {page}
                                                        </PaginationLink>
                                                    )}
                                                </PaginationItem>
                                            ))}

                                            <PaginationItem>
                                                <PaginationNext
                                                    onClick={() => handlePageChange(currentPage + 1)}
                                                    disabled={currentPage === totalPages}
                                                />
                                            </PaginationItem>
                                        </PaginationContent>
                                    </Pagination>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};

const RepoCard = ({ repo }: { repo: Repository }) => {
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatSize = (size: number) => {
        if (size < 1024) return `${size} KB`;
        return `${(size / 1024).toFixed(2)} MB`;
    };

    return (
        <TooltipProvider>
            <Card className="hover:bg-muted/50 transition-colors">
                <CardContent className="p-6">
                    <div className="space-y-4">
                        {/* Repository Header */}
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                                {repo.private ? (
                                    <Lock className="h-4 w-4 text-yellow-500" />
                                ) : (
                                    <Globe2 className="h-4 w-4 text-green-500" />
                                )}
                                <a
                                    href={repo.html_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-lg font-semibold hover:underline text-blue-500 flex items-center gap-2"
                                >
                                    {repo.name}
                                    <ExternalLink className="h-4 w-4" />
                                </a>
                                {repo.archived && (
                                    <Badge
                                        variant="secondary"
                                        className="bg-yellow-500/10 text-yellow-500"
                                    >
                                        Archived
                                    </Badge>
                                )}
                                {repo.fork && <Badge variant="secondary">Fork</Badge>}
                            </div>

                            {/* Repository Stats */}
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <Tooltip>
                                    <TooltipTrigger>
                                        <div className="flex items-center gap-1">
                                            <Star className="h-4 w-4" />
                                            {repo.stargazers_count}
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>Stars</TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger>
                                        <div className="flex items-center gap-1">
                                            <GitFork className="h-4 w-4" />
                                            {repo.forks_count}
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>Forks</TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger>
                                        <div className="flex items-center gap-1">
                                            <Eye className="h-4 w-4" />
                                            {repo.watchers_count}
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>Watchers</TooltipContent>
                                </Tooltip>
                            </div>
                        </div>

                        {/* Repository Description */}
                        {repo.description && (
                            <p className="text-sm text-muted-foreground">{repo.description}</p>
                        )}

                        {/* Repository Meta Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="space-y-2">
                                {repo.language && (
                                    <div className="flex items-center gap-2">
                                        <FileCode className="h-4 w-4" />
                                        <span>{repo.language}</span>
                                    </div>
                                )}
                                {repo.license && (
                                    <div className="flex items-center gap-2">
                                        <Scale className="h-4 w-4" />
                                        <span>{repo.license.name}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <Bookmark className="h-4 w-4" />
                                    <span>{repo.default_branch}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>Created: {formatDate(repo.created_at)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span>Updated: {formatDate(repo.updated_at)}</span>
                                </div>
                                {repo.open_issues_count > 0 && (
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4" />
                                        <span>Issues: {repo.open_issues_count}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Repository Topics */}
                        {repo.topics && repo.topics.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {repo.topics.map((topic) => (
                                    <Badge
                                        key={topic}
                                        variant="secondary"
                                        className="bg-blue-500/10 text-blue-500"
                                    >
                                        {topic}
                                    </Badge>
                                ))}
                            </div>
                        )}

                        {/* Additional Features */}
                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                            {repo.has_wiki && <span>Wiki</span>}
                            {repo.has_pages && <span>GitHub Pages</span>}
                            {repo.has_projects && <span>Projects</span>}
                            {repo.has_downloads && <span>Downloads</span>}
                            <span>Size: {formatSize(repo.size)}</span>
                        </div>

                        {/* Homepage Link */}
                        {repo.homepage && (
                            <a
                                href={repo.homepage}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-500 hover:underline flex items-center gap-2"
                            >
                                <GithubIcon className="h-4 w-4" />
                                Visit Homepage
                            </a>
                        )}
                    </div>
                </CardContent>
            </Card>
        </TooltipProvider>
    );
};

export default UserRepos;