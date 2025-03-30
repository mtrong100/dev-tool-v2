import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DashboardLayout from "./components/DashboardLayout";
import CaseConverter from "./pages/CaseConverter";
import PasswordGenerator from "./pages/PasswordGenerator";
import TextFormatter from "./pages/TextFormatter";
import LetterProfileGenerator from "./pages/LetterProfileGenerator";
import QRCodeGenerator from "./pages/QRCodeGenerator";
import RandomNumberGenerator from "./pages/RandomNumberGenerator";
import CSSGradientGenerator from "./pages/CSSGradientGenerator";
import TextToSpeech from "./pages/TextToSpeech";
import ImageCropper from "./pages/ImageCropper";
import OnlineStopwatchTimer from "./pages/OnlineStopwatchTimer";
import TodoListManager from "./pages/TodoListManager";
import JokeGenerator from "./pages/JokeGenerator";
import JsonToCsvConverter from "./pages/JsonToCsvConverter";
import NumberFormatter from "./pages/NumberFormatter";
import ColorConverter from "./pages/ColorConverter";
import ImageResizer from "./pages/ImageResizer";
import JsonFormatter from "./pages/JsonFormatter";
import LoremGenerator from "./pages/LoremGenerator";
import UuidGenerator from "./pages/UuidGenerator";

function App() {
  return (
    <Router>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/case-converter" element={<CaseConverter />} />
          <Route path="/password-generator" element={<PasswordGenerator />} />
          <Route path="/text-formatter" element={<TextFormatter />} />
          <Route
            path="/letter-profile-generator"
            element={<LetterProfileGenerator />}
          />
          <Route path="/qr-code-generator" element={<QRCodeGenerator />} />
          <Route
            path="/random-number-generator"
            element={<RandomNumberGenerator />}
          />
          <Route
            path="/css-gradient-generator"
            element={<CSSGradientGenerator />}
          />
          <Route path="/text-to-speech" element={<TextToSpeech />} />
          <Route path="/image-cropper" element={<ImageCropper />} />
          <Route path="/online-stopwatch" element={<OnlineStopwatchTimer />} />
          <Route path="/todo-list-manager" element={<TodoListManager />} />
          <Route path="/joke-generator" element={<JokeGenerator />} />
          <Route path="/json-to-csv" element={<JsonToCsvConverter />} />
          <Route path="/number-formatter" element={<NumberFormatter />} />
          <Route path="/color-converter" element={<ColorConverter />} />
          <Route path="/image-resizer" element={<ImageResizer />} />
          <Route path="/json-formatter" element={<JsonFormatter />} />
          <Route path="/lorem-generator" element={<LoremGenerator />} />
          <Route path="/uuid-generator" element={<UuidGenerator />} />
        </Routes>
      </DashboardLayout>
    </Router>
  );
}

export default App;
