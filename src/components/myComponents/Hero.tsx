import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import { useForm } from 'react-hook-form'
import { Github, Search } from "lucide-react"
import { fetchUserData } from "@/store/userSlice"
import { useAppDispatch } from "@/store/hooks/useRedux"
import { useNavigate } from "react-router-dom"

interface formDataType {
    username: string
}

const Hero = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<formDataType>()
    const dispatch = useAppDispatch();
    const navigate = useNavigate()
    const onSubmit = async (data: formDataType) => {
        try {
            await dispatch(fetchUserData(data.username)).unwrap();
            navigate(`/user/${data.username}`)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <section className="min-h-[calc(100vh-3.6rem)] flex items-center justify-center bg-background">
            <div className="container max-w-6xl px-4 md:px-6 py-10 md:py-16">
                <div className="grid lg:grid-cols-2 gap-6 items-center">
                    <div className="flex flex-col space-y-8">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                                GitHub Profile Explorer
                            </h1>
                            <p className="max-w-[600px] text-muted-foreground md:text-xl">
                                Enter any GitHub username to discover detailed insights, repositories, and statistics.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-base">
                                    GitHub Username
                                </Label>
                                <div className="relative">
                                    <Github className="absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        {...register('username', { required: true })}
                                        id="username"
                                        placeholder="Enter username..."
                                        className="pl-10"
                                    />
                                </div>
                                {errors.username && (
                                    <p className="text-sm text-destructive">Username is required</p>
                                )}
                            </div>
                            <Button type="submit" className="w-full">
                                <Search className="mr-2 h-4 w-4" /> Search Profile
                            </Button>
                        </form>

                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <Github className="h-5 w-5" />
                            <span>Powered by GitHub API</span>
                        </div>
                    </div>


                    <div className="hidden lg:block relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-background/10 to-background/80 pointer-events-none" />
                        <img
                            src="https://github.githubassets.com/images/modules/site/home-campaign/illu-actions.png"
                            alt="GitHub Illustration"
                            className="w-full h-auto rounded-lg shadow-2xl"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero