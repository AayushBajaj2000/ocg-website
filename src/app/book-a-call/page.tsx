import { Metadata } from "next";
import BookACall from "@/app/book-a-call/_components/BookACall";

export const metadata: Metadata = {
  title: "Book a Call | OpenCore Group",
  description: "Book a 30-minute intro call with OpenCore Group.",
};

const BookACallPage = () => <BookACall />;

export default BookACallPage;
