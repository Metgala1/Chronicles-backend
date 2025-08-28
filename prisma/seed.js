const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Hashing password
  const hashedPassword = await bcrypt.hash("password123", 10);

  // Create Users
  const users = await prisma.user.createMany({
    data: [
      { username: "elonmusk", email: "elon@tesla.com", password: hashedPassword, role: "author" },
      { username: "natalie_travels", email: "natalie@travelblog.com", password: hashedPassword, role: "author" },
      { username: "john_doe", email: "john@example.com", password: hashedPassword },
      { username: "sarah_dev", email: "sarah@codeworld.io", password: hashedPassword, role: "author" },
      { username: "foodie_jane", email: "jane@foodielife.com", password: hashedPassword, role: "author" },
      { username: "michael_b", email: "mikeb@design.com", password: hashedPassword },
      { username: "chris_gamer", email: "chris@gaming.net", password: hashedPassword, role: "author" },
      { username: "linda_fitness", email: "linda@fitlife.com", password: hashedPassword, role: "author" },
      { username: "alex_writer", email: "alex@wordsmith.org", password: hashedPassword, role: "author" },
      { username: "emma_artist", email: "emma@creativespace.com", password: hashedPassword, role: "author" },
    ],
  });

  // Fetch users after creation
  const [elon, natalie, john, sarah, jane, mike, chris, linda, alex, emma] =
    await prisma.user.findMany();

  // Create Posts
  const posts = await prisma.post.createMany({
    data: [
      {
        title: "Why Mars Colonization Is Closer Than You Think",
        content: "SpaceX is pushing boundaries. Mars could be habitable within decades with sustainable bases.",
        authorId: elon.id,
        published: true,
      },
      {
        title: "Top 10 Hidden Beaches in Southeast Asia",
        content: "From secret Thai islands to untouched Philippine beaches, these gems will blow your mind.",
        authorId: natalie.id,
        published: true,
      },
      {
        title: "The Future of AI in Everyday Life",
        content: "AI is no longer science fiction. From ChatGPT to self-driving cars, it’s already shaping our lives.",
        authorId: sarah.id,
        published: true,
      },
      {
        title: "5 Street Foods You Must Try in Mexico City",
        content: "Tacos al pastor, esquites, churros... Mexican street food is an explosion of flavor.",
        authorId: jane.id,
        published: true,
      },
      {
        title: "Why Indie Games Are Beating AAA Titles",
        content: "Gamers crave originality. Indie devs are winning hearts with creativity over budget.",
        authorId: chris.id,
        published: true,
      },
      {
        title: "10-Minute Morning Workout for Busy People",
        content: "No excuses. Here’s a full-body workout you can do before coffee.",
        authorId: linda.id,
        published: true,
      },
      {
        title: "How to Beat Writer’s Block and Stay Inspired",
        content: "Writing daily is tough, but small rituals like journaling can spark ideas.",
        authorId: alex.id,
        published: true,
      },
      {
        title: "The Rise of AI-Generated Art",
        content: "Is AI art really art? Or is it just another tool like Photoshop once was?",
        authorId: emma.id,
        published: true,
      },
    ],
  });

  const allPosts = await prisma.post.findMany();

  // Create Comments
  await prisma.comment.createMany({
    data: [
      { content: "This is mind-blowing. I can’t wait for Mars colonies!", postId: allPosts[0].id, userId: john.id },
      { content: "I’ve been to Koh Lipe, it’s absolutely magical!", postId: allPosts[1].id, userId: mike.id },
      { content: "AI is going to replace jobs, but also create new ones.", postId: allPosts[2].id, userId: elon.id },
      { content: "Mexican churros are the best I’ve ever had!", postId: allPosts[3].id, userId: natalie.id },
      { content: "Totally agree. Hades and Hollow Knight are better than most AAA games.", postId: allPosts[4].id, userId: john.id },
      { content: "10 minutes? Perfect for me. Will try tomorrow morning!", postId: allPosts[5].id, userId: jane.id },
      { content: "Journaling saved my creativity. Couldn’t agree more.", postId: allPosts[6].id, userId: linda.id },
      { content: "AI art is cool but scary. What about human artists?", postId: allPosts[7].id, userId: mike.id },
    ],
  });

  console.log("✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
