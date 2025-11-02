import { authStorage } from "@/features/auth/services/authStorage";
import { redirect } from "next/navigation";

export default function HomePage() {
  const token = authStorage.getToken();

  if (token) {
    redirect('/main');
  } else {
    redirect('/auth');
  }

  return null;
}
