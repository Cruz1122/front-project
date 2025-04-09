import { Typography } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Login.css";
import { auth } from "../../api/auth";
import { setLoading, setUser } from "../../redux/authSlice";

const { Title } = Typography;

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = React.useState({
    email: "",
    current_password: "",
  });

  const dispatch = useDispatch();

  const { loading, isAuthenticated } = useSelector((state) => state.auth);
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState(null);

  const validateForm = () => {
    const newErrors = {};

    // Validación de email
    if (!formData.email) {
      newErrors.email = "¡Se requiere un correo electrónico!";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Formato de correo electrónico inválido";
    }

    // Validación de password
    if (!formData.current_password) {
      newErrors.current_password = "¡Se requiere una contraseña!";
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
    setLoginError(null); // Resetear el error de inicio de sesión

    if (!validateForm()) {
      return; // Si hay errores, no enviar el formulario
    }

    dispatch(setLoading(true)); // Cambiar el estado de carga a true
    try {
      const response = await auth.signIn(formData);

      if (response.ok) {
        // Despachar la acción setUser con el correo y token
        dispatch(
          setUser({
            isAuthenticated: true,
            email: formData.email, // Guardar el correo ingresado
          })
        );

        onLoginSuccess();
      } else {
        setLoginError(
          "Error al iniciar sesión. Por favor, verifica tus credenciales."
        );
      }
    } catch (error) {
      setLoginError("Correo electrónico o contraseña inválidos."); // Manejo de error de inicio de sesión
    } finally {
      dispatch(setLoading(false)); // Asegurarse de desactivar el estado de carga
    }
  };

  return (
    <div className="login-container">
      <Title level={2} style={{ textAlign: "center" }}>
        Iniciar sesión
      </Title>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Ingresa tu correo electrónico"
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="current_password">Contraseña</label>
          <input
            type="password"
            id="current_password"
            name="current_password"
            value={formData.current_password}
            onChange={handleChange}
            placeholder="Ingresa tu contraseña"
            autoComplete="current-password"
          />
          {errors.current_password && (
            <span className="field-error">{errors.current_password}</span>
          )}
        </div>
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "Iniciando sesión..." : "Iniciar sesión"}
        </button>
      </form>
    </div>
  );
};

export default Login;
