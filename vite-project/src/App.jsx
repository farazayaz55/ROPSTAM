import { BrowserRouter } from "react-router-dom";
import Paths from "./Routes";
import { Provider } from "react-redux";
import { store } from "../src/Redux/store";
import Layout from "./Layout/Layout";

const App = () => {
  return (
    <>
    <Provider store={store}>
      <BrowserRouter>
        <Layout>
          <Paths />
        </Layout>
      </BrowserRouter>
    </Provider>
    </>
  );
};

export default App;
