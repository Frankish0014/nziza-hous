import ServiceDetailsPage from '@/page-components/ServiceDetailsPage';

export default async function Page({ params }) {
  const { id } = await params;
  return <ServiceDetailsPage id={id} />;
}
