import "./VerifyCode.css";
import { Typography } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../../api/auth";
import { setLoading, setToken } from "../../redux/authSlice";

const { Title } = Typography;
const VerifyCode = ({ onCodeVerified }) => {
  const [formData, setFormData] = React.useState({
    email: localStorage.getItem("email") || "",
    code: "",
  });

  const dispatch = useDispatch();

  const { loading, isAuthenticated } = useSelector((state) => state.auth);
  const [errors, setErrors] = useState({});
  const [verificationError, setVerificationError] = useState(null);

  const validateForm = () => {
    const newErrors = {};

    // Validación de código 2FA
    if (!formData.code) {
      newErrors.code = "¡Se requiere un código!";
    } else if (!/^\d{6}$/.test(formData.code)) {
      newErrors.code = "El código debe ser de 6 dígitos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Retorna true si no hay errores
  };

  const handleChange = (e) => {
    // Capturar nombre del input y su valor
    e.preventDefault();
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Si hay errores, no enviar el formulario
    }

    dispatch(setLoading(true)); // Cambiar el estado de carga a true
    try {
      const response = await auth.verifyCode(formData);

      if (response.ok) {
        const data = await response.json(); // Extraer el token de la respuesta
        dispatch(setToken({ token: data.token })); // Guardar el token en Redux y localStorage
        onCodeVerified(); // Notificar que el código fue verificado
      } else {
        setVerificationError("Código inválido. Inténtalo de nuevo.");
      }
    } catch (error) {
      setVerificationError("Código inválido."); // Manejo de error de inicio de sesión
    }
  };

  return (
    <div className="verify-code-container">
      <Title level={2} style={{ textAlign: "center" }}>
        Código 2FA
      </Title>
      <p className="verify-code-description">
        Por favor, ingresa el <strong>código de verificación</strong> que se ha
        enviado a tu correo electrónico.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="code">Código</label>
          <input
            type="text"
            id="code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            placeholder="Ingresa el código que recibiste"
          />
          {errors.code && <span className="field-error">{errors.code}</span>}
        </div>

        <button type="submit" className="verify-code-button" disabled={loading}>
          {loading ? "Verificando..." : "Verificar"}
        </button>
      </form>
    </div>
  );
};

export default VerifyCode;
