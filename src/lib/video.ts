import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

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

  export const compressVideo = async (file: File): Promise<File> => {
    const ffmpeg = createFFmpeg({ 
      log: true,
      corePath: 'https://unpkg.com/@ffmpeg/core@0.8.5/dist/ffmpeg-core.js'
    });
  
    try {
      await ffmpeg.load();
  
      ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(file));
      console.log('Original file size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
  
      await ffmpeg.run(
        '-i', 'input.mp4',
        '-c:v', 'libx264',
        '-preset', 'veryfast', 
        '-crf', '28',
        '-c:a', 'aac',           
        '-b:a', '128k', 
        'output.mp4'
      );
  
      const data = ffmpeg.FS('readFile', 'output.mp4');
      const compressedBlob = new Blob([data.buffer], { type: 'video/mp4' });
      console.log('Compressed file size:', (compressedBlob.size / 1024 / 1024).toFixed(2), 'MB');
  
      ffmpeg.FS('unlink', 'input.mp4');
      ffmpeg.FS('unlink', 'output.mp4');
  
      return new File([compressedBlob], file.name, { type: 'video/mp4' });
    } catch (error) {
      console.error('Error during compression:', error);
      throw error;
    }
  };