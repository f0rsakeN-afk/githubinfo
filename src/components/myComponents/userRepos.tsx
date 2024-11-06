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
import { Repository } from "@/types";

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

const UserRepos = () => {
    const repos = useAppSelector(selectRepos);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [activeTab, setActiveTab] = useState("all");

    const filteredRepos = repos.filter((repo) => {
        if (activeTab === "all") return true;
        if (activeTab === "forked") return repo.fork;
        if (activeTab === "archived") return repo.archived;
        return !repo.fork;
    });

    const sortedRepos = [...filteredRepos].sort(
        (a, b) => b.stargazers_count - a.stargazers_count
    );

    const totalItems = sortedRepos.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentRepos = sortedRepos.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        pageNumbers.push(1);

        let start = Math.max(2, currentPage - 1);
        let end = Math.min(totalPages - 1, currentPage + 1);

        if (currentPage <= 2) {
            end = Math.min(totalPages - 1, 4);
        }
        if (currentPage >= totalPages - 1) {
            start = Math.max(2, totalPages - 3);
        }

        if (start > 2) pageNumbers.push("...");
        for (let i = start; i <= end; i++) {
            pageNumbers.push(i);
        }
        if (end < totalPages - 1) pageNumbers.push("...");

        if (totalPages > 1) pageNumbers.push(totalPages);

        return pageNumbers;
    };

    return (
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
            <Card>
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                    <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
                        <BookMarked className="h-5 w-5 sm:h-6 sm:w-6" />
                        Repositories ({totalItems})
                    </CardTitle>
                    <Select
                        value={itemsPerPage.toString()}
                        onValueChange={(value) => {
                            setItemsPerPage(Number(value));
                            setCurrentPage(1);
                        }}
                    >
                        <SelectTrigger className="w-full sm:w-[180px]">
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
                        <TabsList className="mb-12 sm:mb-8 grid grid-cols-2 gap-2 sm:grid-cols-4">
                            <TabsTrigger value="all" className="text-sm sm:text-base">
                                All ({repos.length})
                            </TabsTrigger>
                            <TabsTrigger value="forked" className="text-sm sm:text-base">
                                Forked ({repos.filter((repo) => repo.fork).length})
                            </TabsTrigger>
                            <TabsTrigger value="sources" className="text-sm sm:text-base">
                                Sources ({repos.filter((repo) => !repo.fork).length})
                            </TabsTrigger>
                            <TabsTrigger value="archived" className="text-sm sm:text-base">
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
                                <div className="mt-6 overflow-x-auto">
                                    <Pagination>
                                        <PaginationContent>
                                            <PaginationItem>
                                                <PaginationPrevious
                                                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                                                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
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
                                                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                                                    onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
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
                <CardContent className="p-4 sm:p-6">
                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                            <div className="flex flex-wrap items-center gap-2">
                                {repo.private ? (
                                    <Lock className="h-4 w-4 text-yellow-500" />
                                ) : (
                                    <Globe2 className="h-4 w-4 text-green-500" />
                                )}
                                <a
                                    href={repo.html_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-base sm:text-lg font-semibold hover:underline text-blue-500 flex items-center gap-2"
                                >
                                    {repo.name}
                                    <ExternalLink className="h-4 w-4" />
                                </a>
                                <div className="flex flex-wrap gap-2">
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
                            </div>

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

                        {repo.description && (
                            <p className="text-sm text-muted-foreground break-words">
                                {repo.description}
                            </p>
                        )}

                        <div className="grid grid-cols-1 gap-4 text-sm">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        </div>

                        {repo.topics && repo.topics.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {repo.topics.map((topic) => (
                                    <Badge
                                        key={topic}
                                        variant="secondary"
                                        className="bg-blue-500/10 text-blue-500 text-xs"
                                    >
                                        {topic}
                                    </Badge>
                                ))}
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                            {repo.has_wiki && <span>Wiki</span>}
                            {repo.has_pages && <span>GitHub Pages</span>}
                            {repo.has_projects && <span>Projects</span>}
                            {repo.has_downloads && <span>Downloads</span>}
                            <span>Size: {formatSize(repo.size)}</span>
                        </div>

                        {repo.homepage && (
                            <a
                                href={repo.homepage}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-500 hover:underline flex items-center gap-2 break-all"
                            >
                                <GithubIcon className="h-4 w-4 flex-shrink-0" />
                                <span className="break-all">Visit Homepage</span>
                            </a>
                        )}
                    </div>
                </CardContent>
            </Card>
        </TooltipProvider>
    );
};

export default UserRepos;