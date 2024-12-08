import { Button } from "../ui/button"
import { Github } from "lucide-react"
import { Separator } from "../ui/separator"
import { Link } from "react-router-dom"
import { Switch } from "../ui/switch"
import { useTheme } from "@/context/themeProvider"

const Header = () => {
    const { setTheme, theme } = useTheme()
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 container mx-auto px-4 lg:px-0">
            <div className="container flex h-14 items-center">
                <div >
                    <Link to='/' className="flex items-center gap-2 mr-6">
                        <Github className="h-6 w-6" />
                        <span className="font-bold text-lg hidden md:block">
                            GitHubInfo
                        </span>
                    </Link>
                </div>

                <Separator orientation="vertical" className="h-6" />



                <div className="ml-auto flex items-center gap-4">
                    <Switch checked={theme === 'dark'} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
                    <a
                        href="https://github.com/f0rsakeN-afk/githubinfo"
                        target="_blank"
                        rel="noopener noreferrer"
                        className=""
                    >
                        <Button variant="outline" size="sm">
                            <Github className="mr-2 h-4 w-4" />
                            View Source
                        </Button>
                    </a>
                </div>
            </div>
        </header>
    )
}

export default Header