import { ENV } from "../utils";
const {BASE_PATH, BASE_API, API_ROUTES} = ENV

export class Upload {
  async uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file); // Agregar el archivo al FormData

    const response = await fetch(`${BASE_API}${API_ROUTES.UPLOAD}`, {
      method: "POST",
      body: formData, // Enviar el FormData
    });

    console.log("response", response);
    return response;
  }
}

export const upload = new Upload()