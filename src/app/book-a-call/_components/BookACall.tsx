import CalCom from "@/app/book-a-call/_components/CalCom";
import Banner from "@/components/layout/sections/Banner";
import TrustedBy from "@/components/layout/sections/TrustedBy";

const BookACall: React.FC = () => {
  return (
    <>
      <Banner
        title="Book a 30-min call"
        description="Tell us a bit more about what you're building and see how our squad can plug into your team and turn your product or website into a growth engine."
      />
      <CalCom />
      <TrustedBy hasHeading={false} hasStats={false} />
    </>
  );
};

export default BookACall;
