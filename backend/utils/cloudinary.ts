// import cloudinary from "cloudinary";

// cloudinary.v2.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const upload_file = (
//   file: string,
//   folder: string
// ): Promise<{ id: string; url: string }> => {
//   return new Promise((resolve, reject) => {
//     cloudinary.v2.uploader.upload(
//       file,
//       {
//         resource_type: "auto",
//         folder,
//       },
//       (error, result) => {
//         if (error || !result) {
//           return reject(error || new Error("Upload failed"));
//         }
//         resolve({
//           id: result.url,
//           url: result.secure_url,
//         });
//       }
//     );
//   });
// };

// const delete_file = async (public_Id: string): Promise<boolean> => {
//   const res = await cloudinary.v2.uploader.destroy(public_Id);
//   if (res?.result === "ok") return true;
//   return false;
// };

// export { delete_file, upload_file };
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload_file = (
  file: string,
  folder: string
): Promise<{ id: string; url: string }> => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(
      file,
      {
        resource_type: "auto",
        folder,
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error("Upload failed"));
        }
        resolve({
          id: result.public_id, // ✅ Fixed: Use public_id instead of url
          url: result.secure_url,
        });
      }
    );
  });
};

const delete_file = async (public_Id: string): Promise<boolean> => {
  try {
    // Add validation
    if (!public_Id || public_Id.trim() === "") {
      console.warn("delete_file called with empty public_id");
      return false;
    }

    const res = await cloudinary.v2.uploader.destroy(public_Id);

    // Log for debugging
    if (res?.result !== "ok") {
      console.error(`Failed to delete file: ${public_Id}`, res);
    }

    return res?.result === "ok";
  } catch (error) {
    console.error(`Error deleting file ${public_Id}:`, error);
    return false;
  }
};

export { delete_file, upload_file };
