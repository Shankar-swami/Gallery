import React, { useEffect, useState } from "react";
import axios from "axios";


const API_BASE = "http://localhost:9090/api/photos";

const PhotoUploader = ({ isAdmin }) => {
  const [photos, setPhotos] = useState([]);
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [enlargedImage, setEnlargedImage] = useState(null);

  const fetchPhotos = async () => {
    try {
      const res = await axios.get(`${API_BASE}/retrive`);
      setPhotos(res.data);
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${API_BASE}/upload`, formData);
      setUploadMessage(response.data);
      setFile(null);
      fetchPhotos();
    } catch (error) {
      setUploadMessage("Upload failed.");
      console.error("Upload failed:", error);
    }

    setTimeout(() => setUploadMessage(""), 3000);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/delete/${id}`);
      fetchPhotos();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  useEffect(() => {
  const handleKeyDown = (e) => {
    if (!enlargedImage || photos.length === 0) return;

    const currentIndex = photos.findIndex((p) => p.id === enlargedImage.id);

    if (e.key === "ArrowLeft") {
      const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
      setEnlargedImage(photos[prevIndex]);
    }

    if (e.key === "ArrowRight") {
      const nextIndex = (currentIndex + 1) % photos.length;
      setEnlargedImage(photos[nextIndex]);
    }

    if (e.key === "Escape") {
      setEnlargedImage(null);
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [enlargedImage, photos]);


  return (
    <div style={{ padding: "20px" }}>
      <h2>{isAdmin ? "Admin Panel" : "User Gallery"}</h2>

      {isAdmin && (
        <div style={{ marginBottom: "20px" }}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button onClick={handleUpload}>Upload</button>
          {uploadMessage && (
            <p style={{ marginTop: "10px", color: "green" }}>{uploadMessage}</p>
          )}
        </div>
      )}

      {isAdmin ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {photos.map((photo) => (
            <div
              key={photo.id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                width: "220px",
                height: "250px",
                textAlign: "center",
              }}
            >
              <img
                src={`data:${photo.fileType};base64,${photo.data}`}
                alt={photo.fileName}
                style={{ width: "200px", height: "150px", objectFit: "cover", cursor: "pointer" }}
                onClick={() => setEnlargedImage(photo)}
              />
              <p>{photo.fileName}</p>
              <button
                style={{ marginTop: "10px" }}
                onClick={() => handleDelete(photo.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>
          {photos.length > 0 && (
            <>
              <div
                style={{
                  display: "inline-block",
                  border: "1px solid #ccc",
                  padding: "10px",
                  width: "300px",
                  height: "250px",
                }}
              >
                <img
                  src={`data:${photos[currentIndex].fileType};base64,${photos[currentIndex].data}`}
                  alt={photos[currentIndex].fileName}
                  style={{ width: "100%", height: "180px", objectFit: "cover", cursor: "pointer" }}
                  onClick={() => setEnlargedImage(photos[currentIndex])}
                />
                <p>{photos[currentIndex].fileName}</p>
              </div>
              <div style={{ marginTop: "10px" }}>
                <button onClick={handlePrev}>&larr; Prev</button>
                <button onClick={handleNext} style={{ marginLeft: "10px" }}>
                  Next &rarr;
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {enlargedImage && (
        <div
          onClick={() => setEnlargedImage(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <img
            src={`data:${enlargedImage.fileType};base64,${enlargedImage.data}`}
            alt={enlargedImage.fileName}
            style={{ maxWidth: "90%", maxHeight: "90%", objectFit: "contain" }}
          />
        </div>
      )}
    </div>
  );
};

export default PhotoUploader;
