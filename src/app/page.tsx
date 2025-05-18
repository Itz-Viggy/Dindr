import { Button } from "../../components/ui/button";
import { Utensils } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen text-center">
        <div className="mb-8 p-4 rounded-full bg-primary/10">
          <Utensils className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Welcome to Dindr
        </h1>
        <p className="text-base md:text-xl lg:text-2xl text-muted-foreground mb-8 max-w-md leading-relaxed">
  Tired of the <span className="italic font-medium text-primary">'I don't know, you pick'</span> loop?
  <br className="block md:hidden" />
  Let <span className="font-bold">Dindr</span> decide for you.
  <span className="block mt-2 font-semibold">Swipe. Match. Eat.</span>
</p>

        <div className="space-x-4">
          <Button asChild variant="outline" size="lg">
            <Link href="/auth/sign-in">Sign In</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/auth/sign-up">Create Account</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}