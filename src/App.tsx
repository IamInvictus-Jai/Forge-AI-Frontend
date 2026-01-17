import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import UploadPage from "./pages/UploadPage";
import CloudUploadPage from "./pages/CloudUploadPage";
import VideoProcessingPage from "./pages/VideoProcessingPage";
import EditorPage from "./pages/EditorPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes with shared layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<UploadPage />} />
          <Route path="upload-cloud" element={<CloudUploadPage />} />
          <Route path="processing" element={<VideoProcessingPage />} />
        </Route>

        {/* Editor route without layout (has its own header) */}
        <Route path="/editor" element={<EditorPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
