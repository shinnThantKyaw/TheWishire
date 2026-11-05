import { WishEditor } from "../editor/wish-editor";

export default async function EditWishPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <WishEditor id={id} />;
}
