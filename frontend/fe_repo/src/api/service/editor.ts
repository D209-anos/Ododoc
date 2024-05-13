import api from '../instances/api'
interface Response {
  status: number,
  data: any
}

// 게시글 이미지 업로드
// 이미지 업로드를 처리하는 함수
export const editorUploadImage = async (file: File, directoryId: string): Promise<any> => {
  const formData = new FormData();
  formData.append("multipartFile", file);
  
  const response = await api.post(`/file/image/${directoryId}`, formData, {
    headers: {
        "Content-Type": "multipart/form-data",
    },
  });
  const data = response.data;

  return {
    src: data.secure_url,
    alt: 'Uploaded image',
    sizes: {
      width: data.width,
      height: data.height,
    }
  };
};

export const fetchFile = async (directoryId: string): Promise<any> => {
  try {
    const response = await api.get<Response>(`/file/${directoryId}`);
    const data = response.data.data;
    return data
  } catch (error: any) {
    console.error('Failed to fetch File:', error.response?.data || error.message);
    return null;
  }
}

export const saveFile = async (actionType: string, directoryId: string, content: any): Promise<any> => {
  try {
    const response = await api.post<Response>(`/file/${actionType}`, {
      directoryId: directoryId,
      content: content
    })
    return response.data;
  } catch (error: any) {
    console.error('Failed to save File:', error.response?.data || error.message);
    return null;
  }
}