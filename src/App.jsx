import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import DashboardLayout from "./components/DashboardLayout";
import Home from "./pages/Home";

// Lazy-loaded components
const CaseConverter = lazy(() => import("./pages/CaseConverter"));
const PasswordGenerator = lazy(() => import("./pages/PasswordGenerator"));
const TextFormatter = lazy(() => import("./pages/TextFormatter"));
const LetterProfileGenerator = lazy(() =>
  import("./pages/LetterProfileGenerator")
);
const QRCodeGenerator = lazy(() => import("./pages/QRCodeGenerator"));
const RandomNumberGenerator = lazy(() =>
  import("./pages/RandomNumberGenerator")
);
const CSSGradientGenerator = lazy(() => import("./pages/CSSGradientGenerator"));
const TextToSpeech = lazy(() => import("./pages/TextToSpeech"));
const ImageCropper = lazy(() => import("./pages/ImageCropper"));
const OnlineStopwatchTimer = lazy(() => import("./pages/OnlineStopwatchTimer"));
const TodoListManager = lazy(() => import("./pages/TodoListManager"));
const JokeGenerator = lazy(() => import("./pages/JokeGenerator"));
const JsonToCsvConverter = lazy(() => import("./pages/JsonToCsvConverter"));
const NumberFormatter = lazy(() => import("./pages/NumberFormatter"));
const ColorConverter = lazy(() => import("./pages/ColorConverter"));
const ImageResizer = lazy(() => import("./pages/ImageResizer"));
const JsonFormatter = lazy(() => import("./pages/JsonFormatter"));
const LoremGenerator = lazy(() => import("./pages/LoremGenerator"));
const UuidGenerator = lazy(() => import("./pages/UuidGenerator"));
const GrammarFixer = lazy(() => import("./pages/GrammarFixer"));
const BetterComment = lazy(() => import("./pages/BetterComment"));

function App() {
  return (
    <Router>
      <DashboardLayout>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/case-converter" element={<CaseConverter />} />
            <Route path="/password-generator" element={<PasswordGenerator />} />
            <Route path="/text-formatter" element={<TextFormatter />} />
            <Route path="/grammar-fixer" element={<GrammarFixer />} />
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
            <Route
              path="/online-stopwatch"
              element={<OnlineStopwatchTimer />}
            />
            <Route path="/todo-list-manager" element={<TodoListManager />} />
            <Route path="/joke-generator" element={<JokeGenerator />} />
            <Route path="/json-to-csv" element={<JsonToCsvConverter />} />
            <Route path="/number-formatter" element={<NumberFormatter />} />
            <Route path="/color-converter" element={<ColorConverter />} />
            <Route path="/image-resizer" element={<ImageResizer />} />
            <Route path="/json-formatter" element={<JsonFormatter />} />
            <Route path="/lorem-generator" element={<LoremGenerator />} />
            <Route path="/uuid-generator" element={<UuidGenerator />} />
            <Route path="/better-comment" element={<BetterComment />} />
          </Routes>
        </Suspense>
      </DashboardLayout>
    </Router>
  );
}

export default App;
