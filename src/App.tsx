import { Authenticator } from "@aws-amplify/ui-react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Industries from "./pages/Industries/Industries";
import Header from "./components/Header/Header";

function App() {
  return (
    <Authenticator hideSignUp>
      {({ signOut }) => (
        <Router>
          <Header signOut={signOut}/>
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/industries" element={<Industries />}/>
          </Routes>
        </Router>
      )}
    </Authenticator>
  );
}

export default App;
