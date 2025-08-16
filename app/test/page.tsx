import { db } from "@/lib/db/config";

export default async function TestPage() {
  const user = await db.user.create({
    data: { email: "sewkito@gmail.com", password: "", name: "" },
  });
  // const blog = await db.

  return <p>{JSON.stringify(user)}</p>;
}
