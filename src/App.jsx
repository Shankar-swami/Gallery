import React from "react";
import PhotoGallery from "./PhotoGallery";

function App() {
  return (
    <div>
      <h1>Admin Panel</h1>
      <PhotoGallery isAdmin={true} />

      <hr />

      <h1>User Gallery</h1>
      <PhotoGallery isAdmin={false} />
    </div>
  );
}

export default App;
