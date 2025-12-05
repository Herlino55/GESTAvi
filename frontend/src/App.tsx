// import { Home } from "lucide-react"
import { createBrowserRouter } from "react-router"
// import Entre from "./Entre"
import Main from "./pages/Main"
// import Accueil from "./Accueil"
// import Success from "./Success"
// import UseHook from "./UseHook"
import { RouterProvider } from "react-router"


function App() {

  const router = createBrowserRouter([
    {
      path : '/',
      element: <Main></Main>,
      // children: [
      //   {
      //     path: 'entre',
      //     element: <Entre></Entre>
      //   },
      //   {
      //     path: 'use',
      //     element: <UseHook></UseHook>
      //   },
      //   {
      //     path: 'resistance',
      //     element: <Accueil></Accueil>
      //   },
      //   {
      //     path: 'dessert',
      //     element: <Accueil></Accueil>
      //   },
      //   {
      //     path: 'boisson',
      //     element: <Accueil></Accueil>
      //   },
      //   {
      //     path: '',
      //     element: <Accueil></Accueil>
      //   },
      //   {
      //     path: 'success',
      //     element: <Success></Success>
      //   }
      // ]
      
    }
        
  ])

  return (
    <>

      <RouterProvider router={router}></RouterProvider>
      
    </>
  )
}

export default App
