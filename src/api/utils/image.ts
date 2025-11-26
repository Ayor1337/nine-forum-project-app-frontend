const baseURL = process.env.NEXT_PUBLIC_RES_URL;

const getImageUrl = (url?: string) => {
  if (url == null) return `${baseURL}/nineforum/fallback.png`;
  if (url?.startsWith("data:image")) return url;
  return `${baseURL}/${url}`;
};

const convertImageToBase64 = (file: File | Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = (reader.result as string).split(",")[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

const getBase64WithType = (file: File | Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export { getImageUrl, convertImageToBase64, getBase64WithType };
