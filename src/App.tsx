import Header from "./Components/Header/Header";
import { useRoutes } from "react-router-dom";
import routes from "./Routes/Routes";
import Footer from "./Components/Footer/Footer";
import { useDispatch } from 'react-redux';
import { getLinks } from "./Redux/Pagination";
import { useEffect, useState } from "react";
import Load from "./Pages/Load";
import Provider from './Contexts/context';

function App() {
  const router = useRoutes(routes)
  const dispatch = useDispatch<any>()
  const [loading, setLoading] = useState(true)

  if (localStorage.getItem('dark') == "true") {
    document.body.classList.add('dark')
  }

  useEffect(() => {
    dispatch(getLinks())
    setLoading(false)
  }, [])

  return (
    <div className=" relative overflow-x-hidden font-[vazir] bg">
      {loading && <Load />}
      <Provider>
        <div className={`${loading && "hidden"}`}>
          <Header />
          {router}
          <Footer />
        </div>
      </Provider>
    </div>


  );
}

export default App;
