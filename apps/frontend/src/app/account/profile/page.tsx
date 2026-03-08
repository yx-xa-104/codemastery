import { redirect } from "next/navigation";

export default function AccountProfileRedirect() {
    redirect("/dashboard/profile");
}
