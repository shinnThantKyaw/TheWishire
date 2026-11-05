import Link from "next/link";
import { Gift } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MagicLinkForm } from "@/components/auth/magic-link-form";

export default function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center bg-gradient-to-b from-pink-50 to-white px-4 py-12 dark:from-pink-950/20 dark:to-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900/30">
            <Gift className="h-6 w-6 text-pink-600 dark:text-pink-400" />
          </div>
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in to create your next surprise</CardDescription>
        </CardHeader>
        <CardContent>
          <MagicLinkForm mode="login" />
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-pink-600 hover:underline dark:text-pink-400">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
