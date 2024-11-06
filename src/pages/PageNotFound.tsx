import { Button } from "@/components/ui/button"
import { GoBack } from "@/utils/goBack"
import { ChevronLeft } from 'lucide-react'

const PageNotFound = () => {
  return (
    <div className="min-h-screen flex flex-col gap-6 items-center justify-center text-center">
      <h2 className="text-primary font-medium  text-xl">The route you're trying to access could not be found.</h2>
      <Button onClick={GoBack()}>Go Back <ChevronLeft /></Button>
    </div>

  )
}

export default PageNotFound;