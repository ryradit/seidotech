import { type Post } from '@/lib/blog';
import { FeaturedPost } from './FeaturedPost';

interface GridLayoutProps {
  posts: Post[];
  variant: 'layout1' | 'layout2' | 'layout3' | 'layout4' | 'layout5';
}

// Layout Variations for 5 articles
export function GridLayout({ posts, variant = 'layout1' }: GridLayoutProps) {
  if (posts.length < 5) return null;

  // Layout 1: 1 Large (left) + 2 Small (right) + 2 Medium (bottom)
  const Layout1 = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 [&>*]:h-full">
      <div className="md:col-span-2 h-full">
        <FeaturedPost post={posts[0]} variant="large" className="h-full" />
      </div>
      <div className="grid grid-rows-2 h-full [&>*]:h-full">
        <FeaturedPost post={posts[1]} variant="small" className="h-full" />
        <FeaturedPost post={posts[2]} variant="small" className="h-full" />
      </div>
      <div className="md:col-span-3 grid grid-cols-2 [&>*]:h-full">
        <FeaturedPost post={posts[3]} variant="medium" className="h-full" />
        <FeaturedPost post={posts[4]} variant="medium" className="h-full" />
      </div>
    </div>
  );

  // Layout 2: 1 Large (top) + 4 Small (bottom grid)
  const Layout2 = () => (
    <div className="grid grid-cols-1 gap-0 [&>*]:h-full">
      <div className="h-full">
        <FeaturedPost post={posts[0]} variant="large" className="h-full" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 [&>*]:h-full">
        <FeaturedPost post={posts[1]} variant="small" className="h-full" />
        <FeaturedPost post={posts[2]} variant="small" className="h-full" />
        <FeaturedPost post={posts[3]} variant="small" className="h-full" />
        <FeaturedPost post={posts[4]} variant="small" className="h-full" />
      </div>
    </div>
  );

  // Layout 3: 3 Small (top) + 2 Medium (bottom)
  const Layout3 = () => (
    <div className="grid grid-cols-1 gap-0 [&>*]:h-full">
      <div className="grid grid-cols-3 [&>*]:h-full">
        <FeaturedPost post={posts[0]} variant="small" className="h-full" />
        <FeaturedPost post={posts[1]} variant="small" className="h-full" />
        <FeaturedPost post={posts[2]} variant="small" className="h-full" />
      </div>
      <div className="grid grid-cols-2 [&>*]:h-full">
        <FeaturedPost post={posts[3]} variant="medium" className="h-full" />
        <FeaturedPost post={posts[4]} variant="medium" className="h-full" />
      </div>
    </div>
  );

  // Layout 4: 2 Medium (left) + 3 Small (right stack)
  const Layout4 = () => (
    <div className="grid grid-cols-1 md:grid-cols-5 [&>*]:h-full">
      <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 [&>*]:h-full">
        <FeaturedPost post={posts[0]} variant="medium" className="h-full" />
        <FeaturedPost post={posts[1]} variant="medium" className="h-full" />
      </div>
      <div className="md:col-span-2 grid grid-rows-3 [&>*]:h-full">
        <FeaturedPost post={posts[2]} variant="small" className="h-full" />
        <FeaturedPost post={posts[3]} variant="small" className="h-full" />
        <FeaturedPost post={posts[4]} variant="small" className="h-full" />
      </div>
    </div>
  );

  // Layout 5: Cross Layout (1 large center + 4 small corners)
  const Layout5 = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 grid-rows-2 [&>*]:h-full">
      <FeaturedPost post={posts[1]} variant="small" className="h-full" />
      <FeaturedPost post={posts[2]} variant="small" className="h-full md:col-start-3" />
      <FeaturedPost 
        post={posts[0]} 
        variant="large" 
        className="h-full row-start-1 row-end-3 col-start-1 col-end-4 md:col-start-2 md:col-end-3" 
      />
      <FeaturedPost post={posts[3]} variant="small" className="h-full" />
      <FeaturedPost post={posts[4]} variant="small" className="h-full md:col-start-3" />
    </div>
  );

  // Render the selected layout
  switch (variant) {
    case 'layout1': return <Layout1 />;
    case 'layout2': return <Layout2 />;
    case 'layout3': return <Layout3 />;
    case 'layout4': return <Layout4 />;
    case 'layout5': return <Layout5 />;
    default: return <Layout1 />;
  }
}
