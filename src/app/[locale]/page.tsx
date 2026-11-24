import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations("Metadata");

  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-2xl font-bold">{t("siteName")} PC</h1>
    </div>
  );
}
