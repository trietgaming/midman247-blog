import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const GITHUB_OWNER = 'trietgaming';
const GITHUB_REPO = 'midman247-blog';
const GITHUB_BRANCH = 'main';
const GITHUB_PATH = 'src/content/blog';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export interface PostData {
  slug: string;
  title: string;
  date: string;
  description: string;
  image?: string;
  contentHtml?: string;
}

const headers: Record<string, string> = {
  Accept: 'application/vnd.github.v3+json',
};

if (GITHUB_TOKEN) {
  headers['Authorization'] = `token ${GITHUB_TOKEN}`;
}

export async function getSortedPostsData(): Promise<PostData[]> {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_PATH}?ref=${GITHUB_BRANCH}`;
  
  try {
    const res = await fetch(url, { 
      headers,
      next: { revalidate: 60 } // ISR: Check for updates every 60 seconds
    });
    
    if (!res.ok) return [];
    
    const files = await res.json();
    
    const allPostsData = await Promise.all(
      files
        .filter((file: any) => file.name.endsWith('.md'))
        .map(async (file: any) => {
          const slug = file.name.replace(/\.md$/, '');
          
          // Fetch individual file content
          const contentRes = await fetch(file.download_url, { 
            headers,
            next: { revalidate: 60 }
          });
          const fileContents = await contentRes.text();
          
          const { data } = matter(fileContents);
          return {
            slug,
            ...(data as { title: string; date: string; description: string; image?: string }),
          };
        })
    );

    return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
  } catch (error) {
    console.error('Error fetching posts from GitHub:', error);
    return [];
  }
}

export async function getPostData(slug: string): Promise<PostData> {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_PATH}/${slug}.md?ref=${GITHUB_BRANCH}`;
  
  try {
    const res = await fetch(url, { 
      headers,
      next: { revalidate: 60 }
    });
    
    if (!res.ok) throw new Error('Post not found');
    
    const file = await res.json();
    const fileContents = Buffer.from(file.content, 'base64').toString('utf8');

    const { data, content } = matter(fileContents);
    const processedContent = await remark().use(html).process(content);
    const contentHtml = processedContent.toString();

    return {
      slug,
      contentHtml,
      ...(data as { title: string; date: string; description: string; image?: string }),
    };
  } catch (error) {
    console.error(`Error fetching post ${slug} from GitHub:`, error);
    throw error;
  }
}
