import { Typography } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Login.css";
import { auth } from "../../api/auth";
import { setLoading } from "../../redux/authSlice";

const { Title } = Typography;

const Login = () => {
  const [formData, setFormData] = React.useState({
    email: "",
    current_password: "",
  });

  const dispatch = useDispatch();

  const { loading, isAuthenticated } = useSelector((state) => state.auth);
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState(null);

  console.log(isAuthenticated);

  const validateForm = () => {
    const newErrors = {};

    // Validación de email
    if (!formData.email) {
      newErrors.email = "Email is required!";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Validación de password
    if (!formData.current_password) {
      newErrors.current_password = "Password is required!";
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
      console.log(response);
    } catch (error) {
      setLoginError("Invalid email or password"); // Manejo de error de inicio de sesión
    }
  };

  return (
    <div className="login-container">
      <Title level={2} style={{ textAlign: "center" }}>
        LogIn
      </Title>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="current_password">Password</label>
          <input
            type="password"
            id="current_password"
            name="current_password"
            value={formData.current_password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
          {errors.current_password && (
            <span className="field-error">{errors.current_password}</span>
          )}
        </div>
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
