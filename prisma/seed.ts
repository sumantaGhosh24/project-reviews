import "dotenv/config";

import {faker} from "@faker-js/faker";

import prisma from "@/lib/db";

const CATEGORY_NAMES = [
  "Web Development",
  "Mobile Apps",
  "AI & Machine Learning",
  "DevOps",
  "Open Source",
  "FinTech",
  "HealthTech",
  "EdTech",
  "Game Development",
  "Productivity Tools",
];

function randomDateAfter(date: Date) {
  return faker.date.between({from: date, to: new Date()});
}

async function main() {
  console.time("seed");
  console.log("🌱 Seeding database...");

  console.log("👤 Creating users...");
  const users = await Promise.all(
    Array.from({length: 10}).map(() => {
      const id = faker.string.uuid();

      return prisma.user.create({
        data: {
          id,
          name: faker.person.fullName(),
          email: faker.internet.email().toLowerCase(),
          image:
            "https://w3bkow2cit.ufs.sh/f/jLzp5qrLYh1KWP2CB5X5THxLaA1rNpE8DRtju7ZhPmKs2MoF",
          favoriteNumber: faker.number.int({min: 1, max: 100}),
          role: "user",
          emailVerified: true,
          accounts: {
            create: {
              id: faker.string.uuid(),
              accountId: id,
              providerId: "credential",
              password:
                "d04005724241e61dc7ed9c3d93571728:259ab6ee004aacbfbd96a1f58e8d650b429526682ac529d1092b8ce7facf1cd92cdd149af22fc01ef6698a8553b5e68371e9552fd5ba0d4018ef3780bbbe479b",
            },
          },
        },
      });
    })
  );
  console.log(`✅ Created ${users.length} users`);

  console.log("📚 Creating categories...");
  const categories = await Promise.all(
    CATEGORY_NAMES.map((name) =>
      prisma.category.create({
        data: {name},
      })
    )
  );
  console.log(`✅ Created ${categories.length} categories`);

  console.log("📝 Creating projects...");
  const projects = [];

  for (let i = 0; i < 25; i++) {
    const category = faker.helpers.arrayElement(categories);

    const project = await prisma.project.create({
      data: {
        title: faker.company.buzzPhrase(),
        description: faker.lorem.sentences(2),
        content: faker.lorem.paragraphs(5),
        status: "PRODUCTION",
        visibility: "PUBLIC",
        ownerId: faker.helpers.arrayElement(users).id,
        categoryId: category.id,
        tags: faker.helpers.arrayElements(
          ["nextjs", "react", "nestjs", "prisma", "postgres", "ai", "docker"],
          faker.number.int({min: 2, max: 5})
        ),
        githubUrl: faker.internet.url(),
        websiteUrl: faker.internet.url(),
        publishedAt: faker.date.past({years: 1}),
      },
    });

    projects.push(project);
  }
  console.log(`✅ Created ${projects.length} projects`);

  console.log("📦 Creating releases...");
  const releases = [];

  for (let i = 0; i < 100; i++) {
    const project = faker.helpers.arrayElement(projects);

    const release = await prisma.release.create({
      data: {
        title: `v${faker.system.semver()}`,
        description: faker.lorem.sentences(2),
        content: faker.lorem.paragraphs(4),
        status: "PRODUCTION",
        visibility: "PUBLIC",
        projectId: project.id,
        publishedAt: faker.date.between({
          from: project.createdAt,
          to: new Date(),
        }),
      },
    });

    releases.push(release);
  }
  console.log(`✅ Created ${releases.length} releases`);

  console.log("💬 Creating comments...");
  const comments = [];
  const replies = [];

  for (const release of releases) {
    const commentCount = faker.number.int({min: 2, max: 5});

    for (let i = 0; i < commentCount; i++) {
      const author = faker.helpers.arrayElement(users);

      const comment = await prisma.comment.create({
        data: {
          body: faker.lorem.sentences(faker.number.int({min: 1, max: 3})),
          authorId: author.id,
          releaseId: release.id,
          createdAt: randomDateAfter(release.createdAt),
          image: faker.datatype.boolean()
            ? "https://w3bkow2cit.ufs.sh/f/jLzp5qrLYh1KWP2CB5X5THxLaA1rNpE8DRtju7ZhPmKs2MoF"
            : null,
        },
      });

      comments.push(comment);

      if (faker.datatype.boolean()) {
        const replyCount = faker.number.int({min: 1, max: 3});

        for (let r = 0; r < replyCount; r++) {
          const replier = faker.helpers.arrayElement(users);

          const reply = await prisma.comment.create({
            data: {
              body: faker.lorem.sentence(),
              authorId: replier.id,
              releaseId: release.id,
              parentId: comment.id,
              createdAt: randomDateAfter(comment.createdAt),
            },
          });

          replies.push(reply);
        }
      }
    }
  }
  console.log(
    `✅ Created ${comments.length} comments & ${replies.length} replies`
  );

  console.log("👀 Creating reviews...");
  const reviews = [];

  for (const release of releases) {
    const reviewCount = faker.number.int({min: 1, max: 3});

    const reviewers = faker.helpers.shuffle(users).slice(0, reviewCount);

    for (const reviewer of reviewers) {
      const review = await prisma.review.create({
        data: {
          rating: faker.number.int({min: 3, max: 5}),
          feedback: faker.lorem.paragraph(),
          authorId: reviewer.id,
          releaseId: release.id,
          createdAt: faker.date.between({
            from: release.createdAt,
            to: new Date(),
          }),
        },
      });

      reviews.push(review);
    }
  }
  console.log(`✅ Created ${reviews.length} reviews`);

  console.log("👀 Creating project votes...");
  const projectVotes = [];

  for (const project of projects) {
    const voterCount = faker.number.int({min: 3, max: 10});

    const voters = faker.helpers.shuffle(users).slice(0, voterCount);

    for (const voter of voters) {
      const vote = await prisma.vote.create({
        data: {
          type: faker.helpers.arrayElement(["UP", "DOWN"]),
          target: "PROJECT",
          targetId: project.id,
          userId: voter.id,
          createdAt: faker.date.between({
            from: project.createdAt,
            to: new Date(),
          }),
        },
      });

      projectVotes.push(vote);
    }
  }
  console.log(`✅ Created ${projectVotes.length} project votes`);

  console.log("👀 Creating release votes...");
  const releaseVotes = [];

  for (const release of releases) {
    const voterCount = faker.number.int({min: 3, max: 10});

    const voters = faker.helpers.shuffle(users).slice(0, voterCount);

    for (const voter of voters) {
      const vote = await prisma.vote.create({
        data: {
          type: faker.helpers.arrayElement(["UP", "DOWN"]),
          target: "RELEASE",
          targetId: release.id,
          userId: voter.id,
          createdAt: faker.date.between({
            from: release.createdAt,
            to: new Date(),
          }),
        },
      });

      releaseVotes.push(vote);
    }
  }
  console.log(`✅ Created ${releaseVotes.length} release votes`);

  console.log("👀 Creating comment votes...");
  const commentVotes = [];

  for (const comment of comments) {
    const voterCount = faker.number.int({min: 3, max: 10});

    const voters = faker.helpers.shuffle(users).slice(0, voterCount);

    for (const voter of voters) {
      const vote = await prisma.vote.create({
        data: {
          type: faker.helpers.arrayElement(["UP", "DOWN"]),
          target: "COMMENT",
          targetId: comment.id,
          userId: voter.id,
          createdAt: faker.date.between({
            from: comment.createdAt,
            to: new Date(),
          }),
        },
      });

      commentVotes.push(vote);
    }
  }
  console.log(`✅ Created ${commentVotes.length} comment votes`);

  console.log("👀 Creating review votes...");
  const reviewVotes = [];

  for (const review of reviews) {
    const voterCount = faker.number.int({min: 3, max: 10});

    const voters = faker.helpers.shuffle(users).slice(0, voterCount);

    for (const voter of voters) {
      const vote = await prisma.vote.create({
        data: {
          type: faker.helpers.arrayElement(["UP", "DOWN"]),
          target: "REVIEW",
          targetId: review.id,
          userId: voter.id,
          createdAt: faker.date.between({
            from: review.createdAt,
            to: new Date(),
          }),
        },
      });

      reviewVotes.push(vote);
    }
  }
  console.log(`✅ Created ${reviewVotes.length} review votes`);

  console.log("👀 Creating project views...");
  const projectView = [];

  for (const project of projects) {
    const viewCount = faker.number.int({min: 3, max: 10});

    const viewers = faker.helpers.arrayElements(users, viewCount);

    for (const viewer of viewers) {
      const view = await prisma.view.create({
        data: {
          target: "PROJECT",
          targetId: project.id,
          viewerId: viewer.id,
        },
      });

      projectView.push(view);
    }
  }
  console.log(`✅ Created ${projectView.length} project views`);

  console.log("👀 Creating release views...");
  const releaseView = [];

  for (const release of releases) {
    const viewCount = faker.number.int({min: 3, max: 10});

    const viewers = faker.helpers.arrayElements(users, viewCount);

    for (const viewer of viewers) {
      const view = await prisma.view.create({
        data: {
          target: "RELEASE",
          targetId: release.id,
          viewerId: viewer.id,
        },
      });

      releaseView.push(view);
    }
  }
  console.log(`✅ Created ${releaseView.length} release views`);

  console.log("👀 Creating project images...");
  const projectImage = [];

  for (const project of projects) {
    const imageCount = faker.number.int({min: 2, max: 4});

    for (let i = 0; i < imageCount; i++) {
      const image = await prisma.image.create({
        data: {
          target: "PROJECT",
          targetId: project.id,
          url: "https://w3bkow2cit.ufs.sh/f/jLzp5qrLYh1KWP2CB5X5THxLaA1rNpE8DRtju7ZhPmKs2MoF",
        },
      });

      projectImage.push(image);
    }
  }
  console.log(`✅ Created ${projectImage.length} project images`);

  console.log("👀 Creating release images...");
  const releaseImage = [];

  for (const release of releases) {
    const imageCount = faker.number.int({min: 2, max: 4});

    for (let i = 0; i < imageCount; i++) {
      const image = await prisma.image.create({
        data: {
          target: "RELEASE",
          targetId: release.id,
          url: "https://w3bkow2cit.ufs.sh/f/jLzp5qrLYh1KWP2CB5X5THxLaA1rNpE8DRtju7ZhPmKs2MoF",
        },
      });

      releaseImage.push(image);
    }
  }
  console.log(`✅ Created ${releaseImage.length} release images`);

  console.log("✅ Seed completed");
  console.timeEnd("seed");
}

main();
