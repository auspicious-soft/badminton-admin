// admin/page.tsx
import { redirect } from "next/navigation";

export default function AdminPage() {
  redirect("/authority/dashboard");
  return null;
}
