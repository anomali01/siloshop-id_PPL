import ImageKit from "imagekit";

const isPlaceholder = (key) => !key || key.includes("xxxxxx") || key.includes("your_imagekit_id");

const usePlaceholder = 
  isPlaceholder(process.env.IMAGEKIT_PUBLIC_KEY) || 
  isPlaceholder(process.env.IMAGEKIT_PRIVATE_KEY) || 
  isPlaceholder(process.env.IMAGEKIT_URL_ENDPOINT);

let imagekit;

if (usePlaceholder) {
  console.log("⚠️ Using mock ImageKit provider (base64 fallback) because keys are not configured in .env");
  imagekit = {
    upload: async ({ file, fileName }) => {
      let base64;
      if (Buffer.isBuffer(file)) {
        base64 = file.toString("base64");
      } else {
        base64 = Buffer.from(file).toString("base64");
      }
      const ext = fileName ? fileName.split('.').pop() : 'jpeg';
      const mimeType = ext === 'png' ? 'image/png' : 
                       ext === 'webp' ? 'image/webp' : 
                       ext === 'svg' ? 'image/svg+xml' : 'image/jpeg';
      return {
        filePath: `data:${mimeType};base64,${base64}`,
      };
    },
    url: ({ path }) => {
      return path;
    }
  };
} else {
  imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  });
}

export default imagekit;

