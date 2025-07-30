// --- TYPE DEFINITION ---
// This interface defines the shape of the file data for the frontend.
export interface ManagedFile {
  id: string;
  name: string;
  uploadDate: string;
}

// The base URL of your FastAPI backend.
const API_BASE_URL = "http://localhost:8000";

// --- LIVE API FUNCTIONS ---

/**
 * Fetches the list of uploaded files for a user from the backend.
 */
export const fetchFiles = async (userEmail: string): Promise<ManagedFile[]> => {
  console.log(`Fetching files for ${userEmail}...`);
  const response = await fetch(`${API_BASE_URL}/api/files/list/${userEmail}`);

  if (!response.ok) {
    throw new Error("Failed to fetch files from the server.");
  }

  const data = await response.json();
  
  // Map the backend data (file_name, upload_date) to the frontend ManagedFile type.
  return data.map((file: any) => ({
    id: file.id, // Assumes the backend sends an 'id' field
    name: file.file_name,
    uploadDate: new Date(file.upload_date).toLocaleDateString(),
  }));
};

/**
 * Uploads a new file to the backend.
 */
export const uploadFile = async (userEmail: string, file: File): Promise<any> => {
  console.log(`Uploading file "${file.name}" for ${userEmail}...`);
  
  const formData = new FormData();
  formData.append("user_email", userEmail);
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/api/files/vectorupload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    // Throw an error with the specific detail message from the backend.
    throw new Error(errorData.detail || "Upload failed due to a server error.");
  }

  return response.json();
};

/**
 * Sends a request to delete a file from the backend.
 */
export const deleteFile = async (userEmail: string, fileId: string): Promise<void> => {
  console.log(`Requesting deletion of file ${fileId} for ${userEmail}...`);
  
  // Note: You will need to create this DELETE endpoint on your FastAPI backend.
  const response = await fetch(`${API_BASE_URL}/api/files/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_email: userEmail, file_id: fileId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to delete file.");
  }

  console.log(`File ${fileId} deleted successfully.`);
};
