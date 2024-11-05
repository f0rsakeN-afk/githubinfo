import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import UserInfo from "./pages/UserInfo"
import PageNotFound from "./pages/PageNotFound"

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/user/:user" element={<UserInfo />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App