import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import "./FileUpload.css";
import { upload } from "../../api/upload";

const FileUpload = () => {
  const token = localStorage.getItem("token");
  let role = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded?.role || null;
    } catch (e) {
      console.error("Token inválido:", e);
    }
  }

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const isSuperAdmin = role === "SUPERADMIN";

  useEffect(() => {
    if (isSuperAdmin) fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/files/data");
      const data = await response.json();
      setTableData(data);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("key", "file");
    formData.append("file", file);

    try {
      const response = await upload.uploadFile(formData);
        
      if (response.ok) {
        await fetchData();
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

  const paginatedData = tableData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(tableData.length / rowsPerPage);

  if (!isSuperAdmin) {
    return (
      <p className="unauthorized">
        No tienes permiso para acceder a esta sección.
      </p>
    );
  }

  return (
    <div className="file-upload-container">
      <h2>Gestión de Municipios y Departamentos</h2>
      <div className="upload-section">
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={uploading || !file}>
          {uploading ? "Subiendo..." : "Subir CSV"}
        </button>
      </div>

      <div className="table-section">
        <h3>Datos Cargados</h3>
        {paginatedData.length === 0 ? (
          <p>No hay datos disponibles.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Municipio</th>
                <th>Departamento</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={index}>
                  <td>{item.municipio}</td>
                  <td>{item.departamento}</td>
                </tr>
              ))}
            </tbody>
          </table>
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

export default FileUpload;
