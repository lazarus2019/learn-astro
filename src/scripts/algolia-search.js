import { algoliasearch } from 'algoliasearch';

const { ALGOLIA_APP_ID, ALGOLIA_API_KEY } = import.meta.env;

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);

// Fetch and index objects in Algolia
const processRecords = async () => {
  const movies = [
    {
      frontmatter: {
        title: 'My First Blog Post',
        pubDate: '2022-07-01T00:00:00.000Z',
        description: 'This is the first post of my new Astro blog.',
        author: 'Astro Learner',
        image: {
          url: 'https://docs.astro.build/assets/rose.webp',
          alt: 'The Astro logo on a dark background with a pink glow.',
        },
        tags: ['astro', 'blogging', 'learning in public'],
        layout: '@/layouts/MarkDownPostLayout.astro',
      },
      file: '/home/thaison/workspace/github.com/lazarus2019/learn-astro/src/pages/posts/post-1.md',
      url: '/posts/post-1',
    },
    {
      frontmatter: {
        title: 'My Second Blog Post',
        author: 'Astro Learner',
        description: "After learning some Astro, I couldn't stop!",
        image: {
          url: 'https://docs.astro.build/assets/arc.webp',
          alt: 'The Astro logo on a dark background with a purple gradient arc.',
        },
        pubDate: '2022-07-08T00:00:00.000Z',
        tags: ['astro', 'blogging', 'learning in public', 'successes'],
        layout: '@/layouts/MarkDownPostLayout.astro',
      },
      file: '/home/thaison/workspace/github.com/lazarus2019/learn-astro/src/pages/posts/post-2.md',
      url: '/posts/post-2',
    },
    {
      frontmatter: {
        title: 'My Third Blog Post',
        author: 'Astro Learner',
        description:
          'I had some challenges, but asking in the community really helped!',
        image: {
          url: 'https://docs.astro.build/assets/rays.webp',
          alt: 'The Astro logo on a dark background with rainbow rays.',
        },
        pubDate: '2022-07-15T00:00:00.000Z',
        tags: ['astro', 'learning in public', 'setbacks', 'community'],
        layout: '@/layouts/MarkDownPostLayout.astro',
      },
      file: '/home/thaison/workspace/github.com/lazarus2019/learn-astro/src/pages/posts/post-3.md',
      url: '/posts/post-3',
    },
    {
      frontmatter: {
        layout: '@/layouts/MarkDownPostLayout.astro',
        title: 'My Fourth Blog Post',
        author: 'Astro Learner',
        description: 'This post will show up on its own!',
        image: {
          url: 'https://docs.astro.build/default-og-image.png',
          alt: 'The word astro against an illustration of planets and stars.',
        },
        pubDate: '2022-08-08T00:00:00.000Z',
        tags: ['astro', 'successes'],
      },
      file: '/home/thaison/workspace/github.com/lazarus2019/learn-astro/src/pages/posts/post-4.md',
      url: '/posts/post-4',
    },
  ];

  return await client.saveObjects({
    indexName: 'blog-astro',
    objects: movies,
  });
};

processRecords()
  .then(() => console.log('Successfully indexed objects!'))
  .catch((err) => console.error(err));
