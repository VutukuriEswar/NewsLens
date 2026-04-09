import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const fetchPipelineData = async (url) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/pipeline`, { url });
    return response.data;
  } catch (error) {
    console.error("Error fetching pipeline data:", error);
    throw error;
  }
};

export const fetchSavedArticles = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/articles`);
    return response.data;
  } catch (error) {
    console.error("Error fetching saved articles:", error);
    throw error;
  }
};
export const deleteArticle = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/articles/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting article:", error);
    throw error;
  }
};
