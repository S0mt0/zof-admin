import { db } from "@/lib/db";

export default async function TestPage() {
  const user = await db.user.create({ data: { email: "sewkito@gmail.com" } });

  return <p>{JSON.stringify(user)}</p>;
}
