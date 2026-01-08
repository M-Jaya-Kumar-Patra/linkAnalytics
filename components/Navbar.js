import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import LogoutButton from "./LogoutButton";

const Navbar = async () => {
  const session = await getServerSession(authOptions);

  return (
    <header className="top-0 fixed w-full h-[70px] border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 h-full  flex items-center justify-between">

        {/* Logo */}
        <div className="relative w-36 h-14">
          <Image
            src="/images/logo_new.png"
            alt="Link Analytics"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Profile + Logout */}
        <div className="flex items-center gap-4">
             <LogoutButton /> 

          {session?.user?.image && (
            <div className="relative w-8 h-8 rounded-full overflow-hidden border">
              <Image
                src={session.user.image}
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
          )}

         
        </div>

      </div>
    </header>
  );
};

export default Navbar;
