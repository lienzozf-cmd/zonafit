import { collectionMetadata } from '@/lib/seo';
import CollectionPage from '@/components/seo/collection-page';

export const revalidate = 60;
export const metadata = collectionMetadata('/hombres');

export default function Page() {
  return <CollectionPage path="/hombres" />;
}
