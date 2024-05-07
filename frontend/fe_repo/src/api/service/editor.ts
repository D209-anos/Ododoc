import api from '../instances/api'

// 게시글 이미지 업로드
export const fetchEditorUploadImage = (file: File) => {
    const body = new FormData();
    body.append("multipartFile", file);
  
    return api.post("editor/upload", body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };