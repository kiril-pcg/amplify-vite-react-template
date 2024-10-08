import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Industries from "./pages/Industries/Industries";
import Header from "./components/Header/Header";
import { Toaster } from "./components/ui/toaster";
import "./App.css";

function App() {
  return (
    <div className="bg-gray-100">
      <Authenticator hideSignUp>
        {({ signOut }) => (
          <Router>
            <Header signOut={signOut} />
            <Toaster />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/industries" element={<Industries />} />
            </Routes>
          </Router>
        )}
      </Authenticator>
      </div>
  );
}

export default App;
