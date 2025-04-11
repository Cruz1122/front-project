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
  const [data, setData] = useState([]);
  const [fetched, setFetched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const isSuperAdmin = role === "SUPERADMIN";

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    try {
      const response = await upload.uploadFile(file);
      const result = await response.json();

      if (response.ok) {
        alert("Archivo subido correctamente.");
        setFile(null);
        fetchMunicipios(); // recargar los datos
      } else {
        alert(result.error || "Error al subir el archivo.");
      }
    } catch (err) {
      console.error("Error al subir archivo:", err);
      alert("Ocurrió un error al subir el archivo.");
    } finally {
      setUploading(false);
    }
  };

  const fetchMunicipios = async () => {
    try {
      const response = await upload.getMunicipios();
      const result = await response.json();

      if (response.ok) {
        const parsed = result.municipios.map((m) => ({
          municipio: m.nombre,
          departamento: m.departamento?.nombre || "Desconocido",
        }));
        setData(parsed);
      } else {
        console.error("Error al obtener municipios:", result.error);
      }
    } catch (err) {
      console.error("Error de red al obtener municipios:", err);
    } finally {
      setFetched(true);
    }
  };

  useEffect(() => {
    fetchMunicipios();
  }, []);

  // Paginación
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const paginatedData = data.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  if (!isSuperAdmin) {
    return (
      <p className="unauthorized">
        No tienes permiso para acceder a esta sección.
      </p>
    );
  }

  return (
    <div className="file-upload-container">
      <h2>GESTIÓN DE MUNICIPIOS Y DEPARTAMENTOS</h2>
      <div className="upload-section">
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={uploading || !file}>
          {uploading ? "Subiendo..." : "Subir CSV"}
        </button>
      </div>

      {fetched && (
        <div className="table-section">
          <h3>DATOS CARGADOS</h3>
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
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                Primera
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (page) =>
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                )
                .map((page, index, arr) => {
                  const prevPage = arr[index - 1];
                  const isEllipsis = prevPage && page - prevPage > 1;
                  return (
                    <React.Fragment key={page}>
                      {isEllipsis && <span className="ellipsis">...</span>}
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={currentPage === page ? "active" : ""}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  );
                })}

              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                Última
              </button>
            </div>
          )}
        </div>
      )}
      <button className="refresh-button" onClick={fetchMunicipios} disabled={uploading}>
        Recargar
      </button>
    </div>
  );
};

export default FileUpload;
