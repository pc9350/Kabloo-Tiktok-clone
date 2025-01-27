export const getVideoDuration = async (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
  
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
  
      video.onerror = () => {
        reject("Error loading video");
      };
  
      video.src = URL.createObjectURL(file);
    });
  };