const dbConnect = require("../config/dbConnect").default;
const { User } = require("../config/models/user.model");
async function migrateCloudinaryIds() {
  await dbConnect();

  const users = await User.find({
    "profilePicture.id": { $exists: true, $ne: "" },
  });

  // console.log(`Found ${users.length} users with profile pictures`);

  for (const user of users) {
    const currentId = user.profilePicture.id;

    // If it's a full URL, extract the public_id
    if (currentId.startsWith("http")) {
      // Example URL: https://res.cloudinary.com/demo/image/upload/v1234567890/Next-Hire-AI/avatars/abc123.jpg
      // Extract: Next-Hire-AI/avatars/abc123

      const match = currentId.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
      if (match && match[1]) {
        const publicId = match[1];
        user.profilePicture.id = publicId;
        await user.save();
        // console.log(`Migrated user ${user.email}: ${currentId} → ${publicId}`);
      } else {
        console.warn(
          `Could not parse URL for user ${user.email}: ${currentId}`
        );
      }
    }
  }

  // console.log("Migration complete!");
  process.exit(0);
}

migrateCloudinaryIds().catch(console.error);
