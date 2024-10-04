import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { buttonVariants } from "../ui/button";
import { Menubar } from "@/components/ui/menubar";
import "./Header.css"; // Import your custom CSS

interface HeaderProps {
  signOut: any;
}

export default function Header({ signOut }: HeaderProps) {
  return (
    <div>
      <Menubar className="menubar px-4">
        <div className="left-side">
          <Link className={buttonVariants({ variant: "ghost" })} to={"/"}>
            Home
          </Link>
          <Link
            className={buttonVariants({ variant: "ghost" })}
            to={"/industries"}
          >
            Industries
          </Link>
        </div>
        <div className="right-side">
          <Button variant="ghost" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </Menubar>
    </div>
  );
}
