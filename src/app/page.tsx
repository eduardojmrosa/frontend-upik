"use client";
import WishlistForm from "@/components/WishListForm";
import WishLists from "../components/WishLists";

export default function Home() {
  return (
    <main className="flex flex-row">
      <div className="border-solid border-2 border-white p-8 rounded-xl w-1/4">
        <WishLists />
      </div>
      <div className="border-solid border-2 border-white p-8 rounded-xl w-1/2">
        <WishlistForm />
      </div>
    </main>
  );
}
