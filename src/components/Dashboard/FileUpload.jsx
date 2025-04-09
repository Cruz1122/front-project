import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
import "./FileUpload.css";

const FileUpload = () => {
  const token = localStorage.getItem("token"); // o sessionStorage.getItem("token")
  let role = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded?.role || null; // Asegúrate de que el token tenga una propiedad 'role'
    } catch (e) {
      console.error("Token inválido:", e);
    }
  }
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const filesPerPage = 5;

  console.log("role", role);
  
  const isSuperAdmin = role === "SUPERADMIN";

  useEffect(() => {
    if (isSuperAdmin) fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fetch("/api/files");
      const data = await response.json();
      setUploadedFiles(data);
    } catch (error) {
      console.error("Error al obtener archivos:", error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/files/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        await fetchFiles();
        setFile(null);
      } else {
        console.error("Error en la subida del archivo.");
      }
    } catch (error) {
      console.error("Error al subir archivo:", error);
    } finally {
      setUploading(false);
    }
  };

  const paginatedFiles = uploadedFiles.slice(
    (currentPage - 1) * filesPerPage,
    currentPage * filesPerPage
  );

  const totalPages = Math.ceil(uploadedFiles.length / filesPerPage);

  if (!isSuperAdmin) {
    return (
      <p className="unauthorized">
        No tienes permiso para acceder a esta sección.
      </p>
    );
  }

  return (
    <div className="file-upload-container">
      <h2>Gestión de Archivos CSV</h2>
      <div className="upload-section">
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={uploading || !file}>
          {uploading ? "Subiendo..." : "Subir CSV"}
        </button>
      </div>

      <div className="files-list">
        <h3>Archivos Cargados</h3>
        {paginatedFiles.length === 0 ? (
          <p>No hay archivos aún.</p>
        ) : (
          <ul>
            {paginatedFiles.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={currentPage === i + 1 ? "active" : ""}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

FileUpload.propTypes = {
  role: PropTypes.string,
};

export default FileUpload;
